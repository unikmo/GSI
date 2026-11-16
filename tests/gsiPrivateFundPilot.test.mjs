import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
import {validatePrivateFundPilot} from '../scripts/validate-gsi-private-fund-pilot.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const load=p=>JSON.parse(readFileSync(resolve(root,p),'utf8'));
const manager=load('research/private_funds/gulf_manager_seed_2026-11-16_UNREVIEWED.json');
const deals=load('research/private_funds/gulf_private_deals_advisers_pilot_2026-11-16_UNREVIEWED.json');
test('source-backed Gulf private manager and transaction pilot remains unreviewed',()=>{
 const a=validatePrivateFundPilot(manager,deals);
 assert.equal(a.managers,4);
 assert.equal(a.named_funds,2);
 assert.equal(a.events,6);
 assert.equal(a.exit_events.length,2);
 assert.ok(a.distinct_law_firms>=7);
 assert.ok(a.coinvestor_mentions.some(x=>x.includes('PSP')));
 assert.equal(a.state,'SOURCE_LINKED_NOT_CERTIFIED_NOT_IMPORTED');
});
test('advisers remain parties distinct from capital payers',()=>{
 const a=structuredClone(deals);
 a.events[0].advisers[0].amount=100;
 assert.throws(()=>validatePrivateFundPilot(manager,a),/Adviser falsely given investor amount/);
});
test('unknown fund linkage is rejected',()=>{
 const d=structuredClone(manager);d.named_funds[0].manager_id='NONEXISTENT';
 assert.throws(()=>validatePrivateFundPilot(d,deals),/Unknown manager/);
});
test('unsubstantiated investor capital is rejected',()=>{
 const a=structuredClone(deals);
 a.events[1].parties[0].amount=999;
 assert.throws(()=>validatePrivateFundPilot(manager,a),/Unverified participant ticket/);
});
test('deal advisers SQL is private, roles separated from investment participants',()=>{
 const s=readFileSync(resolve(root,'supabase/capital_intelligence_transaction_advisers_private.sql'),'utf8');
 for(const t of ['professional_service_firms','transaction_adviser_engagements'])assert.match(s,new RegExp(t+' ENABLE ROW LEVEL SECURITY'));
 assert.match(s,/REVOKE ALL ON ALL TABLES IN SCHEMA gsi_cap_private FROM PUBLIC, anon, authenticated/);
 assert.doesNotMatch(s,/ALTER TABLE\s+public\.gsi_master_full/i);
});
