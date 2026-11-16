#!/usr/bin/env node
/** Snapshot-locked 651-row GSI v9.8 private research seed generator.
 * Does not connect to a database, certify research, or overwrite v9.6.
 * Usage:
 *   node scripts/build-gsi-v98-private-staging.mjs --check
 *   node scripts/build-gsi-v98-private-staging.mjs --output /secure/gsi-v98.sql
 */
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {parseCsv} from '../lib/gsiEnrichmentBridge.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const version='v9.8_WORKING_2026_11_15';
const batch='GSI_V98_651_FULL_SOURCE_2026_11_15';
const sources=[
 ['MASTER','database/GSI_Global_Research_Master_v9.8_WORKING.csv','master_record_id',651,'b746ea81d96675250e3150d2d8715f98b0f9618d'],
 ['LEDGER','database/GSI_Research_Ledger_v9.8_WORKING.csv','record_id',371,'6fbd325a0f99da4318e25d5df39994d3d77980fd'],
 ['SYNDICATE','database/GSI_PE_Syndicate_Map_v9.8_WORKING.csv',null,206,'6675c2775c7a51c9502b32601d1da64018dbb261'],
 ['CROSSWALK','database/GSI_Label_Crosswalk_v9.8_WORKING.csv','master_record_id',651,'0df804b943b32700f523a22407ccc39ff97052b1'],
 ['HELD_CASE','database/RECONCILIATION_200_HELD_CASES_v9.8.csv','resolution_case_id',200,'93994d82f4662df0f8fddebf907d335d5402994f']
];
const data={};const shas={};
for(const [kind,path,idKey,count,expectedSha] of sources){
 const txt=readFileSync(resolve(root,path),'utf8'),body=Buffer.from(txt);
 const sha=createHash('sha1').update(Buffer.from('blob '+body.length+'\0')).update(body).digest('hex');
 assert.equal(sha,expectedSha,'Unreviewed source changed: '+path+'; review and rebase the seed');
 const rows=parseCsv(txt);
 assert.equal(rows.length,count,kind+' record count drift; review before import');
 if(idKey){const ids=rows.map(x=>x[idKey]);assert.ok(ids.every(x=>typeof x==='string'&&x.trim()),kind+' empty source id');assert.equal(new Set(ids).size,rows.length,kind+' duplicate id');}
 data[kind]=rows;shas[kind]=sha;
}
const masterIds=new Set(data.MASTER.map(x=>x.master_record_id));
const ledgerIds=new Set(data.LEDGER.map(x=>x.record_id));
const crosswalkIds=new Set(data.CROSSWALK.map(x=>x.master_record_id));
assert.equal(masterIds.size,crosswalkIds.size,'Master/crosswalk cardinality mismatch');
assert.ok([...masterIds].every(x=>crosswalkIds.has(x)),'Crosswalk is not exactly master-linked');
const orphans=data.SYNDICATE.filter(x=>!masterIds.has(x.linked_master_id)&&!ledgerIds.has(x.linked_master_id));
assert.equal(orphans.length,0,'Orphan syndicate reference');
const pending=data.HELD_CASE.filter(x=>x.resolution_outcome==='SOURCE_VERIFICATION_PENDING');
assert.equal(pending.length,10,'Historical direct evidence-blocked count drift');
const provisional=data.HELD_CASE.filter(x=>x.resolution_outcome==='EXISTING_RECORD_LINK_STILL_PROVISIONAL');
assert.equal(provisional.length,50,'Provisional hold count changed');
const sql=x=>"'"+String(x).replaceAll("'","''").replaceAll('\0','')+"'";
const json=x=>sql(JSON.stringify(x))+'::jsonb';
const parts=['BEGIN;', "SET LOCAL lock_timeout='5s';", "SET LOCAL statement_timeout='120s';"];
for(const [kind,,idKey] of sources){
 data[kind].forEach((row,i)=>{
  const id=idKey?row[idKey]:'SYNDICATE-'+String(i+1).padStart(4,'0');
  parts.push('INSERT INTO gsi_research_private.source_row_versions (source_version,source_table,source_row_id,source_position,source_payload,evidence_state) VALUES ('+
    [sql(version),sql(kind),sql(id),i+1,json(row),sql('UNREVIEWED')].join(',')+
    ') ON CONFLICT (source_version,source_table,source_row_id) DO NOTHING;');
 });
}
parts.push('INSERT INTO gsi_research_private.source_batch_versions (batch_id,source_version,declared_master,declared_ledger,declared_syndicate,declared_crosswalk,declared_held,source_commit_shas,record_state) VALUES ('+
  [sql(batch),sql(version),651,371,206,651,200,json(shas),sql('UNREVIEWED')].join(',')+
  ') ON CONFLICT (batch_id) DO NOTHING;');
parts.push("DO $verify$ DECLARE n int; BEGIN "+
  ...sources.map(([kind,,,count])=>
   "SELECT count(*) INTO n FROM gsi_research_private.source_row_versions WHERE source_version="+sql(version)+" AND source_table="+sql(kind)+"; "+
   "IF n <> "+count+" THEN RAISE EXCEPTION 'GSI v9.8 "+kind+" count % != "+count+"',n; END IF; "),
  "END $verify$;");
parts.push('COMMIT;');
const result={state:'PREPARED_NOT_APPLIED',source_version:version,source_files:sources.length,counts:Object.fromEntries(sources.map(([kind])=>[kind,data[kind].length])),total_source_rows:sources.reduce((n,[kind])=>n+data[kind].length,0),canonical_unique_ids:masterIds.size,orphan_syndicates:orphans.length,evidence_blocked_held_cases:pending.length,provisional_held_links:provisional.length,sha_locked:true,sql_bytes:Buffer.byteLength(parts.join('\n'))};
if(process.argv.includes('--check'))process.stdout.write(JSON.stringify(result)+'\n');
else {
 const i=process.argv.indexOf('--output');
 if(i<0||!process.argv[i+1])throw Error('Use --check or --output /secure/path/file.sql');
 const target=resolve(process.argv[i+1]);
 mkdirSync(dirname(target),{recursive:true});
 writeFileSync(target,parts.join('\n')+'\n',{mode:0o600});
 process.stdout.write(JSON.stringify({...result,output_path:target})+'\n');
}
