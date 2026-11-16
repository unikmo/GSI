import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
import {parseCsv} from '../lib/gsiEnrichmentBridge.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const load=p=>readFileSync(resolve(root,p),'utf8');
const parts=Array.from({length:4},(_,i)=>JSON.parse(load('research/enrichment/v98_all_651_minimum_profiles_part_'+String(i+1).padStart(2,'0')+'_UNREVIEWED.json')));
const profiles={status:'UNREVIEWED_NOT_CERTIFIED',profiles:parts.flatMap(p=>p.profiles)};
for(const [i,part] of parts.entries()){
 assert.equal(part.part,i+1);
 assert.equal(part.parts_total,4);
 assert.equal(part.profile_count,part.profiles.length);
}
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
  for(const key of ['pre_entry_revenue','pre_entry_ebitda']){
   const metric=p[key];
   if(metric!==null){
    assert.ok(p.independently_rechecked_pre_entry_financials?.length);
    assert.ok(metric.source_url.startsWith('https://'));
    assert.ok(metric.period_end < p.announcement_date);
    assert.ok(metric.basis);
    assert.ok(metric.currency);
   }
  }
  if(p.investor_vehicle_legal_identity!==null){
   assert.ok(p.independently_checked_primary_claims?.some(s=>s.verified_vehicle===p.investor_vehicle_legal_identity));
  }
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
