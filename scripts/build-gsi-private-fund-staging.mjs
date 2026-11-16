#!/usr/bin/env node
/** Prepare an UNREVIEWED private research staging SQL artifact. Never connects to DB.
 * --check validates/prints only; --output writes SQL to a local private file.
 */
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {validatePrivateFundPilot} from './validate-gsi-private-fund-pilot.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const load=x=>JSON.parse(readFileSync(resolve(root,x),'utf8'));
const a=load('research/private_funds/gulf_manager_seed_2026-11-16_UNREVIEWED.json');
const b=load('research/private_funds/gulf_private_deals_advisers_pilot_2026-11-16_UNREVIEWED.json');
const qa=validatePrivateFundPilot(a,b);
const escape=x=>"'"+String(x).replaceAll("'","''").replaceAll('\0','')+"'";
const json=x=>escape(JSON.stringify(x))+'::jsonb';
const batch='GSI_PRIVATE_RESEARCH_2026_11_16_SEED';
const records=[
 ...a.managers.map(x=>({id:x.id,kind:'MANAGER',data:x})),
 ...a.named_funds.map(x=>({id:x.id,kind:'FUND',data:x})),
 ...b.events.map(x=>({id:x.id,kind:x.event_type==='FULL_EXIT'?'EXIT':x.event_type==='FUND_COMMITMENT'?'FUND_COMMITMENT':'TRANSACTION',data:x}))
];
if(new Set(records.map(x=>x.id)).size!==records.length)throw Error('Duplicate intake IDs');
const chunks=['BEGIN;',"SET LOCAL lock_timeout='5s';",
 'INSERT INTO gsi_cap_private.research_intake_batches (batch_id,source_dataset,captured_as_of,status) VALUES ('+
 [escape(batch),escape(a.dataset+' + '+b.dataset),escape('2026-11-16'),escape('UNREVIEWED')].join(',')+
 ') ON CONFLICT (batch_id) DO NOTHING;'];
for(const r of records){
 chunks.push('INSERT INTO gsi_cap_private.research_intake_records (batch_id,intake_id,record_kind,payload,evidence_state) VALUES ('+
 [escape(batch),escape(r.id),escape(r.kind),json(r.data),escape('SOURCE_LINKED_UNREVIEWED')].join(',')+
 ') ON CONFLICT (batch_id,intake_id) DO NOTHING;');
}
chunks.push('COMMIT;');
const output=chunks.join('\n')+'\n';
const counts=Object.fromEntries(['MANAGER','FUND','TRANSACTION','EXIT','FUND_COMMITMENT'].map(k=>[k,records.filter(x=>x.kind===k).length]));
const result={state:'PREPARED_UNREVIEWED_NOT_APPLIED',batch_id:batch,records:records.length,by_kind:counts,law_firms_in_payload:qa.distinct_law_firms,events:qa.events,sql_bytes:Buffer.byteLength(output)};
if(process.argv.includes('--check'))process.stdout.write(JSON.stringify(result)+'\n');
else{
 const i=process.argv.indexOf('--output');
 if(i<0||!process.argv[i+1])throw Error('Use --check or --output /secure/absolute/file.sql');
 const target=resolve(process.argv[i+1]);mkdirSync(dirname(target),{recursive:true});writeFileSync(target,output,{mode:0o600});
 process.stdout.write(JSON.stringify({...result,file:target})+'\n');
}
