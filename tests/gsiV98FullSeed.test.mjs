import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
test('v9.8 full seed is version-locked with 651 unique master rows and all supporting tables',()=>{
 const out=JSON.parse(execFileSync(process.execPath,[resolve(root,'scripts/build-gsi-v98-private-staging.mjs'),'--check'],{encoding:'utf8',maxBuffer:3_000_000}));
 assert.deepEqual(out.counts,{MASTER:651,LEDGER:371,SYNDICATE:206,CROSSWALK:651,HELD_CASE:200});
 assert.equal(out.total_source_rows,2079);
 assert.equal(out.canonical_unique_ids,651);
 assert.equal(out.orphan_syndicates,0);
 assert.equal(out.evidence_blocked_held_cases,10);
 assert.equal(out.provisional_held_links,50);
 assert.equal(out.sha_locked,true);
 assert.equal(out.state,'PREPARED_NOT_APPLIED');
 assert.ok(out.sql_bytes>1_500_000);
});
test('v9.8 migration is additive, private and preserves historical source versions',()=>{
 const sql=readFileSync(resolve(root,'supabase/gsi_v98_versioned_source_staging_private.sql'),'utf8');
 for(const table of ['source_row_versions','source_batch_versions']){
   assert.match(sql,new RegExp('CREATE TABLE IF NOT EXISTS gsi_research_private\\.'+table));
   assert.match(sql,new RegExp('ALTER TABLE gsi_research_private\\.'+table+' ENABLE ROW LEVEL SECURITY'));
 }
 assert.match(sql,/PRIMARY KEY\(source_version,source_table,source_row_id\)/);
 assert.match(sql,/REVOKE ALL ON SCHEMA gsi_research_private FROM PUBLIC, anon, authenticated/);
 assert.doesNotMatch(sql,/ALTER TABLE\s+public\.gsi_master_full/i);
 assert.doesNotMatch(sql,/UPDATE\s+gsi_research_private\.master_research_import/i);
});
