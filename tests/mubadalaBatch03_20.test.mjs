import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const load=n=>JSON.parse(readFileSync(new URL('../research/investee_snapshots/'+n,import.meta.url),'utf8'));
const batch=load('mubadala_batch_03_20_2026-11-15_UNREVIEWED.json');
const prior=[load('mubadala_batch_20_2026-11-14_UNREVIEWED.json'),load('mubadala_batch_02_20_2026-11-14_UNREVIEWED.json')];
const get=id=>batch.records.find(x=>x.master_record_id===id);
test('third batch contains 20 distinct IDs not in first 40',()=>{
 const old=new Set(prior.flatMap(b=>b.records.map(r=>r.master_record_id)));
 const ids=batch.records.map(r=>r.master_record_id);
 assert.equal(ids.length,20);assert.equal(new Set(ids).size,20);
 assert.ok(ids.every(x=>!old.has(x)));
 assert.equal(batch.status,'UNREVIEWED_NOT_DECISION_GRADE');
});
test('sources and unresolved financial state on every record',()=>{
 for(const r of batch.records){
 assert.ok(r.source_master.startsWith('https://'));
 assert.ok(r.additional_source_urls.length>=1);
 assert.ok(r.additional_source_urls.every(x=>x.startsWith('https://')));
 assert.equal(r.financial_dossier.complete,false);
 assert.equal(r.financial_dossier.pre_announcement_audited_ebitda,null);
 assert.equal(r.research_status,'UNREVIEWED');
 }
});
test('Flipkart is held for direct investor identity discrepancy',()=>{
 const x=get('GSI21J07-005');
 assert.equal(x.quantitative_findings.direct_mubadala_attribution,'NOT_VERIFIED_FROM_ISSUER_RELEASE');
 assert.equal(x.classification_status,'SOURCE_REVIEW_REQUIRED');
 assert.ok(batch.quality_summary.critical_attribution_hold_ids.includes(x.master_record_id));
});
test('company disclosed financials not confused with whole deal or stake',()=>{
 const x=get('GSI21J06-001');
 assert.equal(x.quantitative_findings.fy2020_revenue_usd_m,143);
 assert.equal(x.quantitative_findings.round_total_usd_m,650);
 assert.equal(x.financial_dossier.complete,false);
 const s=get('GSI22M05-003');
 assert.equal(s.quantitative_findings.annual_recurring_revenue_usd_m_more_than,100);
 assert.equal(s.quantitative_findings.vista_majority_transaction_usd_bn,2.3);
});
test('exits and group-owned subsidiaries retain accurate scope',()=>{
 const yah=get('GSI21J07-009');
 assert.equal(yah.quantitative_findings.stake_sold_pct,40);
 assert.equal(yah.quantitative_findings.retained_stake_pct,60);
 const d=get('GSI23M04-002');
 assert.equal(d.quantitative_findings.acquirer,'M42');
 assert.match(d.verification_caveat,/NOT a directly identified Mubadala cash cheque/);
 const m=get('GSI23M04-004');
 assert.equal(m.quantitative_findings.mubadala_health_ownership_in_m42_pct,45);
});
test('fund formation is not direct investee EBITDA cohort',()=>{
 assert.equal(get('GSI23M11-006').investment_family,'SPECIAL_SITUATIONS_FUND_ANCHOR_COMMITMENT');
 assert.match(batch.quality_summary.classification_policy,/excluded from direct investee/);
});
