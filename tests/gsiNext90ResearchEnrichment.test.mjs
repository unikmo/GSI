import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const load=n=>JSON.parse(readFileSync(new URL('../research/verified_dossiers/'+n,import.meta.url),'utf8'));
const data=load('gsi_next90_priority_enrichment_2026-11-15_UNREVIEWED.json');
const prior=[load('gsi_four_transaction_dossiers_2026-11-15.json'),load('gsi_three_transaction_dossiers_2026-11-15_batch02.json'),load('gsi_three_lifecycle_cases_2026-11-15_batch03.json')];
const lookup=id=>data.records.find(r=>r.master_record_id===id);
test('90 priorities distinct and separate from previous deep dossiers',()=>{
 const ids=data.records.map(r=>r.master_record_id);
 const priorIds=new Set(prior.flatMap(b=>b.dossiers.map(x=>x.master_record_id).filter(Boolean)));
 assert.equal(ids.length,90);assert.equal(new Set(ids).size,90);
 assert.ok(ids.every(id=>!priorIds.has(id)));
 assert.equal(data.summary.records,90);
});
test('exact quotas are met and no unresearched financials are claimed',()=>{
 for(const [fund,n] of Object.entries(data.selection.quotalimits))
  assert.equal(data.records.filter(x=>x.investor_group===fund).length,n);
 for(const x of data.records){
  assert.equal(x.financial_profile.ebitda,null);
  assert.equal(x.financial_profile.verification_status,'NOT_YET_EXTRACTED');
  assert.equal(x.data_quality.ready_for_public_display,false);
  assert.equal(x.data_quality.aggregation_eligible,false);
  assert.equal(x.returns.irr,null);
  assert.ok(x.source_register.length>=1);
 }
 assert.equal(data.summary.full_pre_entry_financial_dossiers,0);
});
test('ADIA and Mubadala Jio legal investing vehicles and cash receipts are distinguished',()=>{
 const a=lookup('GSI-2020-06-002'),m=lookup('GSI-2020-06-001');
 assert.equal(a.independent_source_check.verified_claim.value,5683.5);
 assert.equal(m.independent_source_check.verified_claim.value,9093.6);
 assert.notEqual(a.deal_status.legal_vehicle,m.deal_status.legal_vehicle);
 assert.equal(a.deal_status.documented_close_date,'2020-07-13');
 assert.equal(m.deal_status.documented_close_date,'2020-07-13');
});
test('Olam 2025 signing and 2026 completion are not two distinct purchases',()=>{
 const original=lookup('GSI25F02-001'),later=lookup('GSI26B03-001'),transfer=lookup('GSI26B03-004');
 assert.equal(original.independent_source_check.verified_claim.value,1880);
 assert.equal(later.independent_source_check.verified_claim.value,1880);
 assert.match(later.independent_source_check.interpretation,/do not double count/i);
 assert.equal(transfer.independent_source_check.verified_claim,null);
 assert.equal(transfer.deal_status.cash_received_status,'ISSUER_CONFIRMED_NONCASH_CONTRIBUTION');
});
test('independent checking scope is limited and all source references are HTTPS',()=>{
 assert.equal(data.records.filter(x=>x.independent_source_check).length,5);
 assert.equal(data.summary.not_individually_source_checked,85);
 for(const r of data.records){
  assert.ok(r.source_register.every(x=>x.url.startsWith('https://')));
  if(!r.independent_source_check){ assert.ok(['PRIORITIZED_FOR_DEEP_VERIFICATION','SOURCE_LINK_REPAIR_REQUIRED'].includes(r.data_quality.stage)); if(r.data_quality.stage==='SOURCE_LINK_REPAIR_REQUIRED'){assert.equal(r.source_register.length,0);assert.ok(r.data_quality.source_gap.includes('MISSING'));}}
 }
});
