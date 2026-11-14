import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const data=JSON.parse(readFileSync(new URL('../research/investee_snapshots/mubadala_batch_20_2026-11-14_UNREVIEWED.json',import.meta.url),'utf8'));
const rec=id=>data.records.find(x=>x.master_record_id===id);
test('20 distinct Mubadala master-linked entries, unreviewed',()=>{
 assert.equal(data.records.length,20);
 assert.equal(new Set(data.records.map(r=>r.master_record_id)).size,20);
 assert.equal(data.status,'UNREVIEWED_NOT_DECISION_GRADE');
 assert.ok(data.records.every(r=>r.investor_group==='Mubadala'));
 assert.ok(data.records.every(r=>r.source_primary_master?.startsWith('https://')));
});
test('financial metrics remain explicitly incomplete rather than imputed',()=>{
 for(const r of data.records){
 assert.equal(r.financial_snapshot.disclosure_state,'PARTIAL_ONLY_NO_COMPLETE_FINANCIALS');
 assert.equal(r.financial_snapshot.ebitda,null);
 assert.equal(r.financial_snapshot.revenue,null);
 assert.equal(r.research_state,'UNREVIEWED');
 assert.ok(r.qa_flags.length>=2);
 }
});
test('consortium commitment not passed off as investor cheque',()=>{
 const t=rec('GSI22A04-006');
 assert.equal(t.observations.consortium_commitment_usd_m,525);
 assert.equal(t.observations.combined_equity_stake_pct,10.53);
 assert.match(t.interpretation,/Mubadala share.*not disclosed/);
 const b=rec('GSI23M07-001');assert.equal(b.observations.aggregate_jv_equity_commitments_usd_bn,5.9);assert.match(b.interpretation,/no individual Mubadala/);
});
test('sale entry, partial divestment and capital commitments distinguish scope',()=>{
 const omv=rec('GSI22D12-004');assert.equal(omv.observations.stake_divested_pct,24.9);assert.equal(omv.observations.reported_sale_proceeds,null);
 const blue=rec('GSI23M09-001');assert.match(blue.interpretation,/not acquisition of operating-company equity/);
 const truist=rec('GSI23F02-006');assert.match(truist.interpretation,/BOTH 2023\/2024 tranches/);
});
test('CI financial values retain Q3 scope and no false IFRS EBITDA assertion',()=>{
 const ci=rec('GSI24N11-005');assert.equal(ci.observations.q3_2024_reported_ebitda_cad_m,124.8);assert.equal(ci.observations.ifrs_q3_2024_ebitda_cad_m,undefined);
});
