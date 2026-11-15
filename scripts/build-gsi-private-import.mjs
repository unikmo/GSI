#!/usr/bin/env node
// Generate a deterministic private import SQL file; never sends secrets or data over network.
// Usage: node scripts/build-gsi-private-import.mjs --check
//        node scripts/build-gsi-private-import.mjs --output /secure/path/gsi-private-import.sql
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const file=(p)=>readFileSync(resolve(root,p),'utf8');
function parseCSV(t){
  const rows=[];let row=[],value='',quoted=false;
  for(let i=0;i<t.length;i++){
    const c=t[i];
    if(c==='"'){if(quoted&&t[i+1]==='"'){value+='"';i++;}else quoted=!quoted;}
    else if(c===','&&!quoted){row.push(value);value='';}
    else if((c==='\r'||c==='\n')&&!quoted){
      if(c==='\r'&&t[i+1]==='\n')i++;
      row.push(value);if(row.length>1)rows.push(row);row=[];value='';
    }else value+=c;
  }
  if(quoted)throw Error('Unclosed CSV quoted field');
  if(value.length||row.length){row.push(value);rows.push(row);}
  return rows;
}
const matrix=parseCSV(file('database/GSI_Global_Research_Master_2025_May_v9.6_WORKING.csv'));
const names=matrix[0].map(x=>x.replace(/^\uFEFF/,''));
const master=matrix.slice(1).map((a,i)=>{
  assert.equal(a.length,names.length,'CSV column mismatch at '+i);
  return Object.fromEntries(names.map((k,j)=>[k,a[j]||'']));
});
const dossierPaths=[
 'research/verified_dossiers/gsi_four_transaction_dossiers_2026-11-15.json',
 'research/verified_dossiers/gsi_three_transaction_dossiers_2026-11-15_batch02.json',
 'research/verified_dossiers/gsi_three_lifecycle_cases_2026-11-15_batch03.json'
];
const dossiers=dossierPaths.flatMap(p=>JSON.parse(file(p)).dossiers.map(d=>({...d,__file:p})));
const queue=JSON.parse(file('research/verified_dossiers/gsi_next90_priority_enrichment_2026-11-15_UNREVIEWED.json')).records;
const ids=new Set(master.map(m=>m.master_record_id));
assert.equal(ids.size,445,'Master must contain 445 unique IDs');
assert.equal(master.length,445,'Master size changed; review before import');
const certifiedDossiers=dossiers.filter(d=>d.master_record_id);
assert.equal(certifiedDossiers.length,9,'Expected 9 master-linked dossiers; CityFibre remains unlinked');
assert.equal(new Set(certifiedDossiers.map(d=>d.master_record_id)).size,9);
assert.ok(certifiedDossiers.every(d=>ids.has(d.master_record_id)),'Unknown dossier IDs');
assert.equal(queue.length,90,'90 queue entries required');
assert.equal(new Set(queue.map(q=>q.master_record_id)).size,90);
assert.ok(queue.every(q=>ids.has(q.master_record_id)));
const sqlLit=v=>"'"+String(v).replaceAll("'","''").replaceAll('\0','')+"'";
const js=v=>sqlLit(JSON.stringify(v))+'::jsonb';
const chunks=['BEGIN;','SET LOCAL lock_timeout = \x275s\x27;'];
for(const m of master){
  chunks.push('INSERT INTO gsi_research_private.master_research_import (master_record_id,source_version,source_claim,evidence_state) VALUES ('+
    [sqlLit(m.master_record_id),sqlLit('v9.6_WORKING'),js(m),sqlLit('UNREVIEWED_MASTER')].join(',')+
    ') ON CONFLICT (master_record_id) DO UPDATE SET source_claim=EXCLUDED.source_claim,source_version=EXCLUDED.source_version,imported_at=now() WHERE gsi_research_private.master_research_import.evidence_state=\x27UNREVIEWED_MASTER\x27;');
}
for(const d of certifiedDossiers){
  const p=d.__file;delete d.__file;
  chunks.push('INSERT INTO gsi_research_private.transaction_dossier_import (master_record_id,dossier_payload,source_file,evidence_state,independently_certified) VALUES ('+
   [sqlLit(d.master_record_id),js(d),sqlLit(p),sqlLit('SOURCE_CLAIMS_CHECKED'),'false'].join(',')+
   ') ON CONFLICT (master_record_id) DO UPDATE SET dossier_payload=EXCLUDED.dossier_payload,source_file=EXCLUDED.source_file,imported_at=now() WHERE NOT gsi_research_private.transaction_dossier_import.independently_certified;');
}
for(const q of queue){
 chunks.push('INSERT INTO gsi_research_private.research_priority_queue (master_record_id,queue_payload,evidence_state) VALUES ('+
  [sqlLit(q.master_record_id),js(q),sqlLit('UNREVIEWED')].join(',')+
  ') ON CONFLICT (master_record_id) DO UPDATE SET queue_payload=EXCLUDED.queue_payload,imported_at=now() WHERE gsi_research_private.research_priority_queue.evidence_state=\x27UNREVIEWED\x27;');
}
chunks.push("DO $verify$ BEGIN "+
 "IF (SELECT count(*) FROM gsi_research_private.master_research_import WHERE source_version='v9.6_WORKING') < 445 THEN RAISE EXCEPTION 'GSI imported master count below 445'; END IF; "+
 "IF (SELECT count(*) FROM gsi_research_private.transaction_dossier_import) < 9 THEN RAISE EXCEPTION 'GSI imported dossier count below 9'; END IF; "+
 "IF (SELECT count(*) FROM gsi_research_private.research_priority_queue) < 90 THEN RAISE EXCEPTION 'GSI import priority queue below 90'; END IF; "+
 "END $verify$;");
chunks.push("INSERT INTO gsi_research_private.research_import_manifest (import_id,expected_master_count,imported_master_count,expected_dossier_count,imported_dossier_count,imported_queue_count) VALUES ("+
 [sqlLit('gsi-v96-research-2026-11-15'),'445','445','9','9','90'].join(',')+
 ") ON CONFLICT (import_id) DO UPDATE SET imported_at=now(),imported_master_count=EXCLUDED.imported_master_count,imported_dossier_count=EXCLUDED.imported_dossier_count,imported_queue_count=EXCLUDED.imported_queue_count;");
chunks.push('COMMIT;');
const output=chunks.join('\n')+'\n';
if(process.argv.includes('--check')){
 process.stdout.write(JSON.stringify({master:master.length,dossiers:certifiedDossiers.length,unlinked_dossiers:dossiers.length-certifiedDossiers.length,priority_queue:queue.length,sql_bytes:Buffer.byteLength(output),state:'PREPARED_NOT_APPLIED'})+'\n');
}else{
 const n=process.argv.indexOf('--output');
 if(n<0||!process.argv[n+1])throw Error('Use --check or --output /absolute/path/file.sql');
 const dest=resolve(process.argv[n+1]);mkdirSync(dirname(dest),{recursive:true});writeFileSync(dest,output,{mode:0o600});
 process.stdout.write('Generated private import SQL at '+dest+'\n');
}
