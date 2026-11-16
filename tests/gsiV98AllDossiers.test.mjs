import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseCsv} from '../lib/gsiEnrichmentBridge.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFileSync(resolve(root,p),'utf8');
const dossierFiles=Array.from({length:8},(_,i)=>
 'research/enrichment/v98_case_dossiers_part_'+String(i+1).padStart(2,'0')+'_2026-11-16_UNREVIEWED.json');
const parts=dossierFiles.map(file=>JSON.parse(read(file)));
const dossiers=parts.flatMap(p=>p.dossiers);
const profileFiles=Array.from({length:4},(_,i)=>
 'research/enrichment/v98_all_651_minimum_profiles_part_'+String(i+1).padStart(2,'0')+'_UNREVIEWED.json');
const profiles=profileFiles.flatMap(p=>JSON.parse(read(p)).profiles);
const ids=profiles.map(x=>x.master_record_id);

test('all 651 master IDs have exactly one substantive source-populated dossier',()=>{
 assert.equal(parts.length,8);
 assert.deepEqual(parts.map(p=>p.record_count),[82,82,82,82,82,82,82,77]);
 assert.equal(dossiers.length,651);
 assert.equal(new Set(dossiers.map(d=>d.record_id)).size,651);
 assert.deepEqual(new Set(dossiers.map(d=>d.record_id)),new Set(ids));
 assert.deepEqual(new Set(ids),new Set(parseCsv(read('database/GSI_Global_Research_Master_v9.8_WORKING.csv')).map(x=>x.master_record_id)));
});

test('445 dossiers carry source-linked supplemental research with no duplicated source event',()=>{
 const linked=dossiers.filter(d=>d.coverage.existing_source_research_count>0);
 assert.equal(linked.length,445);
 assert.equal(linked.reduce((n,d)=>n+d.coverage.existing_source_research_count,0),651);
 assert.equal(dossiers.filter(d=>d.evidence.underlying_dossier).length,12);
 for(const d of linked){
  assert.equal(d.coverage.existing_source_research_count,d.evidence.source_claim_blocks.length);
  for(const c of d.evidence.source_claim_blocks){
   assert.ok(c.source_file.startsWith('research/'));
   assert.ok(Number.isInteger(c.source_record_position)&&c.source_record_position>0);
   assert.equal(c.claim_status,'CARRIED_FROM_EXISTING_RESEARCH_NOT_INDEPENDENTLY_RECERTIFIED');
  }
 }
});

test('no records accidentally promoted to decision grade or assigned fabricated returns',()=>{
 const old=new Map(profiles.map(p=>[p.master_record_id,p]));
 for(const d of dossiers){
  assert.equal(d.dossier_certification,'NOT_CERTIFIED_NOT_DECISION_GRADE');
  assert.ok(d.analyst_classification_status==='PROVISIONAL_RULE_BASED'||d.evidence.reopened_primary_claims.length>0,'Reviewed classification requires reopened primary-source claims');
  assert.equal(d.coverage.requires_further_primary_research,true);
  assert.ok(d.coverage.completeness_gaps.length>0);
  const profile=old.get(d.record_id);
  assert.equal(d.returns.irr,profile.realised_irr);
  assert.equal(d.returns.moic,profile.realised_moic);
  assert.equal(d.returns.investor_specific_proceeds,profile.verified_divestment_proceeds);
  assert.equal(d.investor.legal_vehicle_verified,profile.investor_vehicle_legal_identity);
  for(const [field,baseline] of [['revenue',profile.pre_entry_revenue],['ebitda',profile.pre_entry_ebitda]]) {
   const current=d.investee.previous_financials[field];
   if(JSON.stringify(current)!==JSON.stringify(baseline)){
    assert.ok(d.evidence.reopened_primary_claims.some(c=>c.classification==='AUDITED_PRE_ENTRY_ISSUER_ANNUAL_REPORT'));
    assert.ok(current?.source_url?.startsWith('https://'));
    assert.ok(current?.period_end);
    assert.ok(current?.audit_status);
   }
  }
  assert.equal(d.service_providers.verified_issuer_disclosed_adviser_engagements.length,(profile.verified_by_issuer_adviser_engagements||[]).length);
 }
});
