import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const dossier=JSON.parse(readFileSync(new URL('../research/verified_dossiers/gsi_four_transaction_dossiers_2026-11-15.json',import.meta.url),'utf8'));
const row=id=>dossier.dossiers.find(x=>x.master_record_id===id);
test('four unique transaction dossiers and source IDs resolve',()=>{
 assert.equal(dossier.dossiers.length,4);
 assert.equal(new Set(dossier.dossiers.map(x=>x.master_record_id)).size,4);
 for(const d of dossier.dossiers){
  for(const item of [...d.investor_specific_economics,...d.historical_financials]){
   assert.ok(dossier.sources.some(s=>s.id===item.source_id),d.master_record_id+' missing '+item.source_id);
  }
  assert.ok(d.review_flags.length>=2);
 }
});
test('Evotec entry financials exclude FY2020 later disclosure',()=>{
 const e=row('GSI-2020-OCT-003');
 assert.equal(e.historical_financials.filter(x=>x.known_before_announcement===true).length,2);
 assert.ok(e.historical_financials.filter(x=>x.period==='FY2020').every(x=>x.known_before_announcement===false));
 assert.equal(e.investor_specific_economics.find(x=>x.metric==='subscribed_equity').value,200);
 assert.ok(e.review_flags.some(x=>x.includes('11,478,298')));
});
test('Jio issuer cash receipt distinguishes June agreement from July completion',()=>{
 const d=row('GSI-2020-06-003');
 assert.equal(d.event.signed,'2020-06-18');
 assert.equal(d.event.cash_and_share_allotment_confirmed_on,'2020-07-10');
 assert.equal(d.investor_specific_economics.find(x=>x.metric==='funded_subscription').value,11367);
});
test('stc exit value not realised profit',()=>{
 const d=row('GSI21D12-003');
 assert.equal(d.event.completed,'2021-12-13');
 assert.equal(d.investor_specific_economics.find(x=>x.metric==='remaining_pif_stake').value,64);
 assert.ok(d.review_flags.some(x=>x.includes('not portray SAR12bn gross proceeds as profit')));
});
test('SMR agreement cannot be labelled cash settled',()=>{
 const d=row('GSI21D12-001');
 assert.equal(d.event.state,'SIGNED_EQUITY_INVESTMENT_AGREEMENT_CASH_SETTLEMENT_NOT_INDEPENDENTLY_CONFIRMED');
 assert.equal(d.investor_specific_economics.find(x=>x.metric==='agreed_subscription').value,85);
});
test('historical financial publication dates align with entry information cut-off',()=>{
 for(const d of dossier.dossiers){
  const entry=d.event.announced||d.event.signed||d.event.agreed||d.event.exploratory_sale_announced;
  for(const f of d.historical_financials){
   if(f.known_before_announcement===true)assert.ok(f.published<=entry);
   if(f.known_before_announcement===false)assert.ok(f.published>entry);
  }
 }
});
