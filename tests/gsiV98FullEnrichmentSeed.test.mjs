import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
import {parseCsv} from '../lib/gsiEnrichmentBridge.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const load=p=>readFileSync(resolve(root,p),'utf8');
const profiles=JSON.parse(load('research/enrichment/v98_all_651_minimum_profiles_UNREVIEWED.json'));
const master=parseCsv(load('database/GSI_Global_Research_Master_v9.8_WORKING.csv'));
const syndicate=parseCsv(load('database/GSI_PE_Syndicate_Map_v9.8_WORKING.csv'));
test('exactly 651 canonical master entries have individual source-linked enrichment skeletons',()=>{
 assert.equal(profiles.status,'UNREVIEWED_NOT_CERTIFIED');
 assert.equal(profiles.profiles.length,651);
 assert.equal(new Set(profiles.profiles.map(p=>p.master_record_id)).size,651);
 assert.deepEqual(new Set(profiles.profiles.map(p=>p.master_record_id)),new Set(master.map(m=>m.master_record_id)));
 const source=new Map(master.map(m=>[m.master_record_id,m]));
 for(const p of profiles.profiles){
  const row=source.get(p.master_record_id);
  assert.equal(p.reported_investing_entity,row.investing_entity||null);
  assert.equal(p.investee_or_event,row.target_or_event||null);
  assert.equal(p.announcement_date,row.announcement_date||null);
  assert.equal(p.primary_source,row.primary_source||null);
  assert.equal(p.inclusion_decision,row.inclusion_decision||null);
  assert.equal(p.research_state,'UNREVIEWED_SOURCE_CLAIM_ONLY');
  assert.equal(p.pre_entry_revenue,null);
  assert.equal(p.pre_entry_ebitda,null);
  assert.equal(p.investor_vehicle_legal_identity,null);
  assert.deepEqual(p.law_firms,[]);
 }
});
test('syndicate claims are carried only to matching master IDs without inventing investor amounts',()=>{
 const expected=syndicate.filter(s=>master.some(m=>m.master_record_id===s.linked_master_id)).length;
 const actual=profiles.profiles.flatMap(x=>x.related_syndicate_links);
 assert.equal(actual.length,expected);
 assert.ok(actual.every(s=>s.verification_required===true));
 assert.ok(profiles.profiles.every(p=>p.realised_irr===null&&p.realised_moic===null&&p.verified_divestment_proceeds===null));
});
