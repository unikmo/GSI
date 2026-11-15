import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const d=JSON.parse(readFileSync(new URL('../research/verified_dossiers/gsi_next50_quality_review_2026-11-15_batch05.json',import.meta.url),'utf8'));
const rows=d.records, ids=new Set(rows.map(x=>x.master_record_id));
test('fifty unique prioritized master IDs selected without redoing previous three',()=>{
 assert.equal(rows.length,50);assert.equal(ids.size,50);
 for(const id of d.excludes)assert.ok(!ids.has(id),id);
 for(let i=0;i<50;i++)assert.equal(rows[i].batch_index,i+1);
});
test('correct primary verification accounting and no false certification',()=>{
 const count=label=>rows.filter(x=>x.verification.evidence_level===label).length;
 assert.equal(d.summary.primary_transaction_claim_checks,count('PRIMARY_SOURCE_TRANSACTION_CLAIMS_CHECKED'));
 assert.equal(d.summary.issuer_event_only_investor_not_confirmed,count('ISSUER_EVENT_ONLY_INVESTOR_ROLE_UNVERIFIED'));
 assert.equal(d.summary.master_only_not_independently_checked,count('SOURCE_NOT_INDEPENDENTLY_CHECKED'));
 assert.equal(d.summary.records,50);
 assert.ok(rows.every(x=>!x.public_eligible&&!x.aggregation_eligible&&x.moic===null&&x.irr===null));
});
test('all verified claims have a source URL and substantive finding',()=>{
 for(const row of rows){
  const v=row.verification;
  if(v.evidence_level!=='SOURCE_NOT_INDEPENDENTLY_CHECKED'){
   assert.match(v.url,/^https:\/\//);
   assert.ok(v.finding?.length>30,row.master_record_id);
  }
 }
});
test('duplicate lifecycle does not inflate economic event totals',()=>{
 const eventKeys=new Set(rows.map(x=>x.verification.event_key));
 assert.equal(eventKeys.size,48);
 assert.equal(rows.find(x=>x.master_record_id==='GSI25F02-001').verification.event_key,rows.find(x=>x.master_record_id==='GSI26B03-001').verification.event_key);
 assert.equal(rows.find(x=>x.master_record_id==='GSI-2020-03-002').verification.event_key,rows.find(x=>x.master_record_id==='GSI-2020-OCT-006').verification.event_key);
});
test('QIA XPeng issue has actual investor vehicle and price',()=>{
 const x=rows.find(x=>x.master_record_id==='GSI-2020-AUG-004');
 const claim=x.financial_and_capital_evidence[0];
 assert.equal(claim.value,100);assert.equal(claim.vehicle,'Al-Rayyan Holding LLC');assert.equal(claim.shares,23065390);
});
test('financial and capital metric evidence has distinct source and scope',()=>{
 for(const row of rows)for(const m of row.financial_and_capital_evidence||[]){
  assert.match(m.source_url,/^https:\/\//);assert.ok(m.scope?.length>15);
 }
});
test('Culligan issuer statement does not certify Mubadala participation',()=>{
 const x=rows.find(x=>x.master_record_id==='GSI21M05-003');
 assert.equal(x.verification.evidence_level,'ISSUER_EVENT_ONLY_INVESTOR_ROLE_UNVERIFIED');
});
