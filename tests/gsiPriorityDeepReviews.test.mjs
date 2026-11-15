import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const dataset=JSON.parse(readFileSync(new URL('../research/verified_dossiers/gsi_three_priority_deep_reviews_2026-11-15_batch04.json',import.meta.url)));
const cases=dataset.cases;
test('Three distinct master-linked priority dossiers',()=>{
 assert.equal(cases.length,3);
 assert.equal(new Set(cases.map(x=>x.master_record_id)).size,3);
 assert.ok(cases.every(x=>x.review.decision_grade===false&&x.review.aggregation_eligible===false));
});
test('Every claim source ID belongs to published provenance register',()=>{
 const known=new Set(dataset.sources.map(s=>s.id));
 for(const c of cases){
  for(const t of c.timeline)assert.ok(known.has(t.evidence),t.evidence);
  for(const f of [...c.pre_decision_financials,...(c.non_predecision_financials||[])])assert.ok(known.has(f.source),f.source);
 }
});
test('Point-in-time values are never sourced from after the commitment',()=>{
 const dates=Object.fromEntries(dataset.sources.map(s=>[s.id,s.publication_date]));
 for(const c of cases){
  const decision=c.timeline.find(x=>/agreement|signed/i.test(x.event))?.date||c.timeline[0].date;
  for(const m of c.pre_decision_financials){
   assert.ok(m.available_before_signing, m.metric);
   assert.ok(dates[m.source]<=decision,m.metric+' source after deal decision');
  }
 }
});
test('Lucid preferred equity and loan facility not counted together as paid capital',()=>{
 const lucid=cases.find(c=>c.investee==='Lucid Group Inc.');
 assert.equal(lucid.transaction_terms.paid_preferred_equity_usd_m,750);
 assert.equal(lucid.transaction_terms.loan_facility_commitment_usd_m,750);
 assert.equal(lucid.transaction_terms.loan_drawn_on_announcement_usd_m,0);
 assert.equal(lucid.non_predecision_financials[0].available_before_signing,false);
});
test('Reliance economics separate fund ticket, cohort and financial metric scope',()=>{
 const r=cases.find(c=>c.investee==='Reliance Retail Ventures Limited');
 assert.equal(r.transaction_terms.investor_specific_funded_inr_crore,9555);
 assert.equal(r.transaction_terms.all_investors_total_round_inr_crore,47265);
 assert.ok(r.pre_decision_financials.some(x=>x.metric==='FY2020_RRVL_consolidated_net_revenue'&&x.value===146272));
});
test('RSGT does not manufacture PIF-specific proceeds from combined deal price',()=>{
 const r=cases.find(c=>c.investee==='Red Sea Gateway Terminal Limited');
 assert.equal(r.transaction_terms.combined_gross_equity_sale_usd_m,280);
 assert.equal(r.transaction_terms.PIF_specific_consideration_usd_m,null);
 assert.equal(r.transaction_terms.new_cash_into_investee,false);
});
test('Unverified sovereign fund return metrics remain null',()=>{
 for(const c of cases){assert.equal(c.returns.moic,null);assert.equal(c.returns.irr,null);assert.equal(c.returns.realized_proceeds,null);}
});
