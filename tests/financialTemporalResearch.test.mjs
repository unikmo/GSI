import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const cityData=JSON.parse(readFileSync(new URL('../research/investee_snapshots/mubadala_energy_infrastructure_followons_2026-11-14.json',import.meta.url),'utf8'));
const pilot=JSON.parse(readFileSync(new URL('../research/investee_snapshots/mubadala_pilot_2026-11-14.json',import.meta.url),'utf8'));
const city=cityData.cases.find(x=>x.investee==='CityFibre');
const ci=pilot.records.find(x=>x.master_record_id==='GSI24N11-005');
test('CityFibre commitment distinct from later received equity',()=>{
  assert.equal(city.funding_reconciliation.announced_on,'2022-03-21');
  assert.equal(city.funding_reconciliation.receipt_disclosure.period,'2023-Q1');
  assert.equal(city.funding_reconciliation.receipt_disclosure.amount_gbp_millions,300);
  assert.notEqual(city.funding_reconciliation.state,'CASH_RECEIVED_MARCH_2022');
});
test('financial statements signed after March 2022 cannot be contemporaneous evidence',()=>{
  const later=city.historical_financials.filter(x=>x.fiscal_year===2021);
  assert.ok(later.length>=3);
  assert.ok(later.every(x=>x.data_state==='LATER_DISCLOSED_NOT_PUBLIC_AT_2022_03_21'));
  for(const x of later) assert.equal(cityData.sources.find(s=>s.id===x.source_id).published,'2022-09-26');
});
test('historic revenues and operating losses use units, no invented EBITDA',()=>{
  assert.equal(city.historical_financials.find(x=>x.fiscal_year===2020&&x.metric==='revenue').value,63.132);
  assert.equal(city.historical_financials.find(x=>x.metric==='operating_loss').value,-113.589);
  assert.equal(city.historical_financials.some(x=>x.metric==='ebitda'),false);
});
test('CI Financial distinguishes IFRS and adjusted metrics and leverage',()=>{
 const xs=ci.company_snapshot.disclosures;
 assert.equal(xs.find(x=>x.field==='ifrs_total_net_revenue').value,785.4);
 assert.equal(xs.find(x=>x.field==='adjusted_net_revenue').value,754.9);
 assert.equal(xs.find(x=>x.field==='net_leverage_ratio').value,3.3);
 assert.ok(xs.every(x=>pilot.sources.some(s=>s.id===x.source_id)));
});


test('macro evidence respects what was published by the March 2022 decision date',()=>{
 const snap=city.macro_strategy_snapshot;
 assert.equal(snap.as_of,'2022-03-21');
 const before=snap.observations.filter(x=>x.temporal_state==='PUBLIC_AT_ANNOUNCEMENT');
 assert.ok(before.length>=2);
 for(const x of before)assert.ok(x.known_on<=snap.as_of);
 const later=snap.observations.find(x=>x.metric==='UK_CPI_February_2022_YOY');
 assert.equal(later.known_on,'2022-03-23');
 assert.equal(later.temporal_state,'NOT_PUBLIC_AT_ANNOUNCEMENT');
 assert.equal(snap.analytical_state,'STRATEGY_CATEGORY_CONSISTENT_TRANSACTION_CAUSALITY_UNVERIFIED');
});

test('CityFibre 2021 EBITDA and leverage inputs retain precise accounting bases and dates',()=>{
 const metrics=city.historical_financials.filter(x=>x.fiscal_year===2021);
 const by=k=>metrics.find(x=>x.metric===k);
 assert.equal(by('ebitda').value,-60.535);
 assert.equal(by('adjusted_ebitda').value,-49.494);
 assert.equal(by('gross_debt').value,812.9);
 assert.equal(by('cash_balance').value,47);
 assert.equal(by('operating_cash_flow').value,-81.7);
 assert.equal(by('ppe_additions').value,787.1);
 assert.ok(metrics.every(x=>x.data_state==='LATER_DISCLOSED_NOT_PUBLIC_AT_2022_03_21'));
 assert.equal(city.ownership_at_2021_end.percentages,'UNDISCLOSED_IN_CHECKED_TEXT');
});
