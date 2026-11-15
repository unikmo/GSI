import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const d=JSON.parse(readFileSync(new URL('../research/verified_dossiers/gsi_next50_quality_review_2026-11-15_batch06.json',import.meta.url),'utf8'));
const rows=d.records;
const byId=id=>rows.find(r=>r.id===id);
test('50 new non-duplicated sovereign records, with correct queue/master source split',()=>{
 assert.equal(rows.length,50);
 assert.equal(new Set(rows.map(r=>r.id)).size,50);
 assert.equal(rows.filter(r=>r.source_layer==='PRIORITY_QUEUE').length,37);
 assert.equal(rows.filter(r=>r.source_layer==='MASTER_445').length,13);
 rows.forEach((r,i)=>assert.equal(r.position,i+1));
});
test('Every source-check has actual evidence, no false publication and no invented fund returns',()=>{
 const checked=rows.filter(r=>r.check.evidence_grade==='PRIMARY_SOURCE_DIRECTLY_CHECKED');
 assert.equal(checked.length,d.summary.independently_checked_transaction_claims);
 assert.equal(rows.length-checked.length,d.summary.source_only_awaiting_verification);
 for(const r of rows){
  assert.equal(r.public_eligible,false); assert.equal(r.aggregation_eligible,false);
  assert.equal(r.moic,null);assert.equal(r.irr,null);assert.equal(r.cash_flow_schedule,null);
  if(r.check.evidence_grade==='PRIMARY_SOURCE_DIRECTLY_CHECKED'){
   assert.match(r.check.url,/^https:\/\//);
   assert.ok(r.check.finding.length>=40);
  }else assert.equal(r.check.state,'UNVERIFIED');
 }
});
test('investor-specific XPeng records distinguish sovereign and subscription dates',()=>{
 const a=byId('GSI-2020-AUG-001');
 assert.equal(a.check.legal_vehicle,'Aerospace Holding Company LLC');
 assert.equal(a.check.verified_amount.value,100);
 assert.equal(a.check.cross_investor_related,'GSI-2020-AUG-004');
});
test('no capital inflation from convertible securities, manager commitments, or consortiums',()=>{
 assert.equal(byId('GSI22O10-001').check.verified_amount.value,2427.6);
 assert.match(byId('GSI-2020-SEP-001').check.cash_scope,/COMMITMENT/);
 assert.match(byId('GSI24J06-001').check.cash_scope,/COMBINED/);
 assert.match(byId('GSI-2021-MAR-004').check.cash_scope,/NO_EXTERNAL_NEW_CASH/);
 assert.match(byId('GSI24A08-005').check.cash_scope,/NOT_ADQ/);
});
test('Silver Rock future fund commitments and signed-vs-closed chronology explicit',()=>{
 assert.match(byId('GSI24D12-001').check.finding,/2025/);
 assert.match(byId('GSI-2020-NOV-006').check.finding,/2021/);
});
test('Noatum post-acquisition financials cannot masquerade as pre-decision performance',()=>{
 const n=byId('GSI23M06-007');
 assert.ok(n.check.financials.every(f=>f.post_event===true));
 assert.equal(n.financials_pre_decision,'NOT_AUDITED_IN_THIS_BATCH');
});
