import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=n=>JSON.parse(readFileSync(new URL('../research/investee_snapshots/'+n,import.meta.url),'utf8'));
const pif=read('pif_remaining_68_2026-11-15_UNREVIEWED.json');
const qia=read('qia_first_67_2026-11-15_UNREVIEWED.json');
const prev=read('mubadala_final25_pif_first25_2026-11-15_UNREVIEWED.json');
const idOf=r=>r.master_record_id;
test('68 PIF + 67 QIA, no overlap and 135 unique IDs',()=>{
 assert.equal(pif.records.length,68);
 assert.equal(qia.records.length,67);
 const all=[...pif.records,...qia.records].map(idOf);
 assert.equal(all.length,135);
 assert.equal(new Set(all).size,135);
 const old=new Set(prev.records.map(idOf));
 assert.ok(all.every(id=>!old.has(id)));
 assert.ok(pif.records.every(r=>r.investor_group==='PIF'));
 assert.ok(qia.records.every(r=>r.investor==='QIA'));
});
test('90+ PIF research coverage is 25 previously + 68 new',()=>{
 assert.equal(prev.records.filter(r=>r.investor_group==='PIF').length,25);
 assert.equal(pif.records.length+25,93);
});
test('no nonverified cash, financial data or fund attribution is promoted',()=>{
 for(const r of pif.records){
  assert.equal(r.assessment_state,'UNREVIEWED');
  assert.equal(r.funding_assertion,'NOT_VERIFIED');
  assert.equal(r.standalone_financials.ebitda,null);
  assert.equal(r.do_not_report_as_verified_investment,true);
  assert.ok(r.source_registry.length>=1);
 }
 for(const r of qia.records){
  assert.equal(r.investee_financials.ebitda,null);
  assert.equal(r.qualifying_as_completed_funded_deal,false);
  assert.equal(r.verification_status,'UNREVIEWED_MASTER_CLAIM_WITH_SELECTIVE_SOURCE_SPOT_CHECK');
  assert.ok(r.source_register.length>=1);
 }
});
test('Scopely acquisition closing cannot rewrite April 2023 signing',()=>{
 const r=pif.records.find(x=>x.master_record_id==='GSI23M04-001');
 assert.equal(r.transaction_lifecycle.later_event.date,'2023-07-12');
 assert.equal(r.spot_verified_quantitative_metric.value,4900);
 assert.match(r.spot_verified_quantitative_metric.scope,/not PIF parent equity cheque/i);
});
test('RWE QIA agreed convertible distinct from verified settled cash',()=>{
 const r=qia.records.find(x=>x.master_record_id==='GSI22O10-001');
 assert.equal(r.verified_numeric_claim.value,2427.6);
 assert.match(r.verified_numeric_claim.scope,/not 1 October cash-settled/);
 assert.equal(r.lifecycle.exact_settlement,'UNVERIFIED');
});
test('RWE follow-on is a separate master record and QIA data stays source-qualified',()=>{
 const a=qia.records.find(x=>x.master_record_id==='V1.6_CANDIDATES-001');
 const b=qia.records.find(x=>x.master_record_id==='GSI22O10-001');
 assert.ok(a&&b); assert.notEqual(a.master_record_id,b.master_record_id);
 const checked=qia.records.filter(r=>r.verified_numeric_claim);
 assert.equal(checked.length,1);
});
