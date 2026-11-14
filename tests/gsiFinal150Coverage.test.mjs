import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const d=new URL('../research/investee_snapshots/',import.meta.url);
function load(filename){return JSON.parse(readFileSync(new URL(filename,d),'utf8'));}
const old=[
 'mubadala_batch_20_2026-11-14_UNREVIEWED.json',
 'mubadala_batch_02_20_2026-11-14_UNREVIEWED.json',
 'mubadala_batch_03_20_2026-11-15_UNREVIEWED.json',
 'mubadala_batch_04_50_2026-11-15_UNREVIEWED.json',
 'mubadala_final25_pif_first25_2026-11-15_UNREVIEWED.json',
 'pif_remaining_68_2026-11-15_UNREVIEWED.json',
 'qia_first_67_2026-11-15_UNREVIEWED.json'
].map(load);
const recent=[1,2,3].map(n=>load('gsi_final_150_part_0'+n+'_2026-11-15_UNREVIEWED.json'));
test('final 150 spans three sets of fifty with non-overlapping IDs',()=>{
 const ids=recent.flatMap(b=>b.records.map(r=>r.master_record_id));
 assert.equal(ids.length,150);assert.equal(new Set(ids).size,150);
 const prior=new Set(old.flatMap(b=>b.records.map(r=>r.master_record_id)));
 assert.equal(prior.size,295);
 assert.ok(ids.every(x=>!prior.has(x)));
 assert.equal(new Set([...prior,...ids]).size,445);
});
test('fund-group accounting preserves exact source labels and all 150 records',()=>{
 const all=recent.flatMap(b=>b.records);
 const count=group=>all.filter(x=>x.master_investor_group===group).length;
 assert.equal(count('QIA'),13);
 assert.equal(count('ADIA'),25);
 assert.equal(count('ADQ'),45);
 assert.equal(count('KIA'),12);
 assert.equal(count('OIA'),6);
 assert.equal(all.length-[13,25,45,12,6].reduce((a,b)=>a+b,0),49);
 for(const b of recent){
  assert.equal(b.quality.count,50);
  assert.equal(b.quality.distinct_ids,50);
 }
});
test('original master evidence is not promoted into financial certifications',()=>{
 for(const r of recent.flatMap(b=>b.records)){
  assert.equal(r.research_status,'UNREVIEWED_MASTER_TRIAGE');
  assert.equal(r.certified_financial_dossier,false);
  assert.equal(r.certified_investment,false);
  assert.equal(r.capital.aggregation_eligible,false);
  assert.equal(r.capital.investor_paid_capital_verified,null);
  assert.equal(r.investee_financials.ebitda,null);
  assert.equal(r.historical_context.causality,'NOT_ESTABLISHED');
  assert.equal(r.primary_evidence.status,'MASTER_SOURCE_NOT_REOPENED_FOR_THIS_BATCH');
  assert.ok(r.primary_evidence.url.startsWith('https://'));
 }
});
test('no fabricated sovereign strategy publication date or universal financial denominator',()=>{
 for(const r of recent.flatMap(b=>b.records)){
  assert.equal(r.historical_context.strategy_as_of,null);
  assert.equal(r.historical_context.macro_as_of,null);
  assert.equal(r.investee_financials.period_end,null);
  assert.equal(r.investor_attribution_status,'MASTER_LABEL_ONLY_UNVERIFIED');
 }
});
