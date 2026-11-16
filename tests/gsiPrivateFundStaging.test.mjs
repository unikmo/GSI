import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
test('private fund SQL staging builder requires source-linked records and does not write DB',()=>{
 const stdout=execFileSync(process.execPath,[resolve(root,'scripts/build-gsi-private-fund-staging.mjs'),'--check'],{encoding:'utf8'});
 const r=JSON.parse(stdout);
 assert.equal(r.records,20);
 assert.deepEqual(r.by_kind,{MANAGER:8,FUND:4,TRANSACTION:5,EXIT:2,FUND_COMMITMENT:1});
 assert.equal(r.law_firms_in_payload,9);
 assert.equal(r.state,'PREPARED_UNREVIEWED_NOT_APPLIED');
 assert.ok(r.sql_bytes>10000);
});
test('intake migration has private RLS and does not edit the public master',()=>{
 const sql=readFileSync(resolve(root,'supabase/capital_intelligence_private_research_staging.sql'),'utf8');
 for(const t of ['research_intake_batches','research_intake_records'])assert.match(sql,new RegExp(t+' ENABLE ROW LEVEL SECURITY'));
 assert.match(sql,/REVOKE ALL ON ALL TABLES IN SCHEMA gsi_cap_private FROM PUBLIC, anon, authenticated/);
 assert.doesNotMatch(sql,/ALTER TABLE\s+public\.gsi_master_full/i);
});
