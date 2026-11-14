import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const folder='../research/investee_snapshots/';
const read=x=>JSON.parse(readFileSync(new URL(folder+x,import.meta.url),'utf8'));
const batch=read('mubadala_batch_04_50_2026-11-15_UNREVIEWED.json');
const previous=[read('mubadala_batch_20_2026-11-14_UNREVIEWED.json'),read('mubadala_batch_02_20_2026-11-14_UNREVIEWED.json'),read('mubadala_batch_03_20_2026-11-15_UNREVIEWED.json')];
const find=id=>batch.records.find(x=>x.master_record_id===id);
test('new 50 distinct master records do not duplicate previous 60',()=>{
const old=new Set(previous.flatMap(x=>x.records.map(r=>r.master_record_id))),ids=batch.records.map(x=>x.master_record_id);
assert.equal(ids.length,50);assert.equal(new Set(ids).size,50);assert.ok(ids.every(id=>!old.has(id)));assert.equal(old.size,60);assert.equal(batch.qa_summary.after_unique_count,110);
});
test('unverified primary sources do not become verified, complete CFO profiles or cash cheques',()=>{
for(const r of batch.records){
assert.equal(r.research_state,'UNREVIEWED');assert.equal(r.qa_level,'SOURCE_TRIAGE_NOT_FINANCIAL_CERTIFICATION');assert.equal(r.investee_financials.disclosure_state,'NOT_EXTRACTED_OR_NOT_APPLICABLE');
assert.equal(r.individual_investor_paid_cash,null);assert.ok(r.source_register.length>=1);assert.ok(r.source_register.every(s=>s.url.startsWith('https://')));
if(!r.official_source_verified_this_batch)assert.equal(r.claim_evidence_status,'CARRIED_FROM_UNREVIEWED_MASTER_NOT_REVERIFIED_THIS_BATCH');
}
});
test('directly checked issuer financial/operational figures retain their scope',()=>{
const p=find('V1.5_HOLDS-003');
assert.equal(p.quantitative_claims.find(x=>x.metric==='asset_capacity_supported').value,310);
assert.equal(p.individual_investor_paid_cash,null);
const l=find('V2.0_2026-010');
assert.equal(l.quantitative_claims.find(x=>x.metric==='property_acquisition_price').value,654);
assert.match(l.quantitative_claims.find(x=>x.metric==='property_acquisition_price').scope,/not Mubadala cheque/i);
});
test('no signed agreement becomes automatic settlement; fund LP money not equity cheque',()=>{
const a=find('GSI26B04-002');assert.equal(a.economic_event_category,'ATTRIBUTION_CONFLICT_HOLD');assert.ok(a.source_issue.includes('does not prove'));
const f=find('GSI24O10-006');assert.equal(f.economic_event_category,'THIRD_PARTY_ASSET_MANAGER_FUNDRAISE');assert.equal(f.exclusion_from_direct_investee_financial_cohort,true);
const pp=find('GSI-2020-003');assert.equal(pp.economic_event_category,'NON_EQUITY_CONTRACT_PPA');
});
test('linked events remain linked and Greenlink date conflict retained',()=>{
assert.equal(find('GSI-2020-NOV-004').linked_event_master_id,'GSI-2020-AUG-003');
assert.ok(find('V1.6_CANDIDATES-006').source_issue.includes('June 16'));
});
test('classification counts match actual 50 records',()=>{
for(const [k,n] of Object.entries(batch.qa_summary.classification_counts))
 assert.equal(batch.records.filter(x=>x.economic_event_category===k).length,n);
assert.equal(Object.values(batch.qa_summary.classification_counts).reduce((s,v)=>s+v,0),50);
});
