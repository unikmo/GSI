import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const data=JSON.parse(readFileSync(new URL('../research/verified_dossiers/gsi_three_lifecycle_cases_2026-11-15_batch03.json',import.meta.url),'utf8'));
const byInvestee=x=>data.dossiers.find(d=>d.investee===x);
test('three lifecycle dossiers with full source linkage',()=>{
 assert.equal(data.dossiers.length,3);
 const sources=new Set(data.sources.map(s=>s.id));
 for(const d of data.dossiers){
  const metrics=[...(d.economics||[]),...(d.financials||[]),...(d.performance||[]),...(d.contemporaneous_company_scale||[])];
  for(const metric of metrics)assert.ok(sources.has(metric.source_id),metric.metric+' missing '+metric.source_id);
  assert.ok(d.unresolved.length>=3);
 }
});
test('CI original issuer reports C dollars, never US-dollar transaction value',()=>{
 const ci=data.dossiers.find(x=>x.master_record_id==='GSI24N11-005');
 assert.equal(ci.economics.find(x=>x.metric==='enterprise_transaction_value').unit,'CAD billion');
 assert.equal(ci.economics.find(x=>x.metric==='equity_transaction_value').unit,'CAD billion');
 assert.equal(ci.financials.find(x=>x.metric==='adjusted_ebitda_attributable_to_shareholders').non_ifrs,true);
 assert.equal(ci.transaction_events[2].as_known_at_signing,false);
 const flag=data.cross_record_findings.find(x=>x.id==='CI_CURRENCY_CONFLICT');
 assert.equal(flag.severity,'HIGH');
 assert.equal(flag.resolution,'CANADIAN_DOLLARS_AS_CONTRACT_CURRENCY_RETROSPECTIVE_REVIEW_FLAGGED');
});
test('CoolIT full buyer consideration is not minority investor proceeds',()=>{
 const cool=data.dossiers.find(x=>x.investee==='CoolIT Systems');
 assert.equal(cool.investor_specific_proceeds,null);
 assert.equal(cool.investor_specific_irr,null);
 assert.equal(cool.economics.find(x=>x.metric==='consideration_transferred_to_sellers_net_acquired_cash').value,4627.2);
 assert.equal(cool.economics.find(x=>x.metric==='headline_transaction_value').value,4750);
 assert.ok(cool.performance.every(x=>/buyer commentary|projection/.test(x.basis)));
});
test('CityFibre separates a March 2022 commitment from Q1 2023 receipt',()=>{
 const cf=data.dossiers.find(x=>x.investee.startsWith('CityFibre'));
 assert.equal(cf.master_record_id,null);
 assert.equal(cf.transaction_events[1].date,'2022-03-21');
 assert.equal(cf.transaction_events[2].date,'2023-Q1');
 assert.equal(cf.transaction_events[2].as_known_at_commitment,false);
 assert.equal(cf.economics.find(x=>x.metric==='mubadala_cash_received_by_parent_Q1_2023').value,300);
 assert.equal(cf.historical_financials.length,0);
});
test('source dates and metrics do not imply post-event disclosures are known before signature',()=>{
 const ci=data.dossiers.find(x=>x.investee==='CI Financial Corp');
 const source=data.sources.find(s=>s.id==='CI-Q3-2024-11-14');
 assert.ok(source.published<'2024-11-25');
 assert.equal(data.sources.find(s=>s.id==='ECL-SEC-2026-09-30').published,'2026-11');
});
