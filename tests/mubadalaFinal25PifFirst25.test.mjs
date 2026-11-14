import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const file=n=>JSON.parse(readFileSync(new URL('../research/investee_snapshots/'+n,import.meta.url),'utf8'));
const batch=file('mubadala_final25_pif_first25_2026-11-15_UNREVIEWED.json');
const prior=[file('mubadala_batch_20_2026-11-14_UNREVIEWED.json'),file('mubadala_batch_02_20_2026-11-14_UNREVIEWED.json'),file('mubadala_batch_03_20_2026-11-15_UNREVIEWED.json'),file('mubadala_batch_04_50_2026-11-15_UNREVIEWED.json')];
const get=id=>batch.records.find(x=>x.master_record_id===id);
test('fifty disjoint records finish 135 exact-name Mubadala and start PIF',()=>{
 const old=new Set(prior.flatMap(b=>b.records.map(x=>x.master_record_id)));
 assert.equal(old.size,110);
 assert.equal(batch.records.length,50);
 assert.equal(new Set(batch.records.map(x=>x.master_record_id)).size,50);
 assert.ok(batch.records.every(x=>!old.has(x.master_record_id)));
 assert.equal(batch.records.filter(x=>x.investor_group==='Mubadala').length,25);
 assert.equal(batch.records.filter(x=>x.investor_group==='PIF').length,25);
 assert.equal(batch.quality.mubadala_exact_name_coverage_after,135);
});
test('all 50 remain unreviewed, no fabricated cash or investee EBITDA',()=>{
 for(const r of batch.records){
 assert.equal(r.review_state,'UNREVIEWED');
 assert.equal(r.investment_specific_paid_amount,null);
 assert.equal(r.transaction_cash_settlement_proven,false);
 assert.equal(r.financials.audited_ebitda,null);
 assert.equal(r.must_not_count_as_verified_funded_deal,true);
 assert.ok(r.source_urls.length>=1);
 }
});
test('duplicate Apollo events remain one economic transaction',()=>{
 const shadow=get('V1.6_HOLDS-008');assert.equal(shadow.classification,'DUPLICATE_SHADOW');assert.equal(shadow.linked_record_id,'GSI26B04-007');
 const apollo=get('GSI26B04-007');assert.equal(apollo.classification,'INBOUND_MANAGER_EQUITY_AND_FUTURE_LP_PLEDGES');
 assert.ok(apollo.source_observations.some(x=>x.metric==='aggregate_future_strategy_commitments'&&x.value===5000));
});
test('PIF Jio and STC preserve transaction amount scope and chronology',()=>{
 const j=get('GSI-2020-06-003');assert.equal(j.investor_group,'PIF');assert.equal(j.source_observations.find(x=>x.metric==='proposed_stake').value,2.32);
 const stc=get('GSI21D12-003');assert.equal(stc.classification,'SECONDARY_EQUITY_DIVESTMENT');assert.equal(stc.source_observations.find(x=>x.metric==='proceeds').value,12);
 assert.equal(stc.source_observations.find(x=>x.metric==='retained_shareholding').value,64);
});
test('strategies and 13F holdings are not dated as invested cash',()=>{
 assert.equal(get('GSI-2021-JAN-009').classification,'STRATEGY_CHANGE_ANCHOR');
 assert.equal(get('GSI-2020-05-003').classification,'SEC_13F_HOLDINGS_SNAPSHOT');
 assert.equal(get('GSI21M05-005').classification,'SEC_13F_HOLDINGS_SNAPSHOT');
 assert.equal(get('GSI-2020-OCT-009').linked_record_id,'GSI-2020-NOV-001');
});
