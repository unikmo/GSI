import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const schema=readFileSync(resolve(root,'supabase/gsi_research_private_import.sql'),'utf8');
test('schema remains private and never alters public master',()=>{
 assert.match(schema,/CREATE SCHEMA IF NOT EXISTS gsi_research_private/);
 assert.match(schema,/REVOKE ALL ON SCHEMA gsi_research_private FROM PUBLIC, anon, authenticated/);
 assert.match(schema,/master_research_import ENABLE ROW LEVEL SECURITY/);
 assert.match(schema,/transaction_dossier_import ENABLE ROW LEVEL SECURITY/);
 assert.match(schema,/research_priority_queue ENABLE ROW LEVEL SECURITY/);
 assert.doesNotMatch(schema,/ALTER TABLE\s+public\.gsi_master_full/i);
 assert.doesNotMatch(schema,/GRANT\s+SELECT\s+ON\s+.*\s+TO\s+anon/i);
});
test('import source registry builds 445 master, nine linked dossiers and 90 priorities',()=>{
 const output=execFileSync(process.execPath,[resolve(root,'scripts/build-gsi-private-import.mjs'),'--check'],{encoding:'utf8'});
 const summary=JSON.parse(output);
 assert.equal(summary.master,445);
 assert.equal(summary.dossiers,9);
 assert.equal(summary.unlinked_dossiers,1);
 assert.equal(summary.priority_queue,90);
 assert.equal(summary.state,'PREPARED_NOT_APPLIED');
 assert.ok(summary.sql_bytes>100000);
});
