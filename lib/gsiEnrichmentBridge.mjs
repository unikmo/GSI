/** Read-only v9.8 enrichment linkage; never certifies claims or writes to a database. */
export function parseCsv(text) {
 const out=[];let row=[],cell='',quoted=false;
 for(let i=0;i<text.length;i++){const c=text[i];
  if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}
  else if(c===','&&!quoted){row.push(cell);cell='';}
  else if((c==='\r'||c==='\n')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(x=>x!==''))out.push(row);row=[];cell='';}
  else cell+=c;
 }
 if(quoted)throw Error('Unclosed CSV quoted field');
 if(cell!==''||row.length){row.push(cell);out.push(row);}
 const header=out.shift()||[];
 if(new Set(header).size!==header.length)throw Error('Duplicate CSV column');
 return out.map((r,i)=>{if(r.length!==header.length)throw Error('CSV width mismatch at row '+(i+2));return Object.fromEntries(header.map((k,j)=>[k,r[j]]));});
}
export function reconcileEnrichment({masterCsv,ledgerCsv,crosswalkCsv,syndicateCsv,researchFiles,heldCasesCsv}){
 const master=parseCsv(masterCsv),ledger=parseCsv(ledgerCsv),crosswalk=parseCsv(crosswalkCsv),syndicate=parseCsv(syndicateCsv),held=parseCsv(heldCasesCsv);
 const ids=new Set(master.map(r=>r.master_record_id)),ledgerIds=new Set(ledger.map(r=>r.record_id)),linked=new Set(crosswalk.map(r=>r.master_record_id));
 const unique=(rows,k)=>new Set(rows.map(r=>r[k])).size===rows.length;
 const integrity={master_unique:unique(master,'master_record_id'),ledger_unique:unique(ledger,'record_id'),crosswalk_unique:unique(crosswalk,'master_record_id'),crosswalk_exact:ids.size===linked.size&&[...ids].every(id=>linked.has(id)),syndicate_orphans:syndicate.filter(r=>!ids.has(r.linked_master_id)&&!ledgerIds.has(r.linked_master_id)).map(r=>r.linked_master_id)};
 const index=new Map(),exceptions=[],accepted=[];
 for(const item of researchFiles){
  const doc=item.data,records=Array.isArray(doc.records)?doc.records:Array.isArray(doc.dossiers)?doc.dossiers:[];
  for(const [i,record] of records.entries()){
   const id=record.master_record_id,entry={source_file:item.path,source_index:i+1,master_record_id:id||null,source_version:record.master_source_version||record.master_version||null,source_research_status:record.research_status||doc.research_status||doc.status||null};
   if(typeof id!=='string'||!id.trim()){exceptions.push({...entry,issue:'NO_MASTER_ID'});continue;}
   if(!ids.has(id)){exceptions.push({...entry,issue:'NOT_IN_V98_MASTER'});continue;}
   const prior=index.get(id)||[];prior.push(entry);index.set(id,prior);
   accepted.push({...entry,link_state:'EXACT_ID_PRESENT_NOT_EVIDENCE_CERTIFIED'});
  }
 }
 const repeated=[...index.entries()].filter(([,a])=>a.length>1).map(([master_record_id,a])=>({master_record_id,source_files:a.map(x=>x.source_file)}));
 const pending=held.filter(r=>r.resolution_outcome==='SOURCE_VERIFICATION_PENDING').map(r=>r.resolution_case_id);
 return {status:'REVIEW_ONLY_NO_DB_WRITES',canonical:{master:master.length,ledger:ledger.length,crosswalk:crosswalk.length,syndicate:syndicate.length,held:held.length},integrity,research:{files:researchFiles.length,linked_occurrences:accepted.length,distinct_linked_records:index.size,unmatched:exceptions,overlapping_sources:repeated,source_versions:[...new Set(accepted.map(x=>x.source_version).filter(Boolean))].sort()},evidence_exceptions:{source_verification_pending_count:pending.length,source_verification_pending_ids:pending},admissibility:'NO_AUTO_PROMOTION_TO_VERIFIED_OR_FUNDED'};
}
