import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const data=JSON.parse(readFileSync(new URL('../research/verified_dossiers/gsi_three_transaction_dossiers_2026-11-15_batch02.json',import.meta.url),'utf8'));
const rec=id=>data.dossiers.find(x=>x.master_record_id===id);
test('three distinct researched transactions and evidence register resolves',()=>{
 assert.equal(data.dossiers.length,3);
 assert.equal(new Set(data.dossiers.map(x=>x.master_record_id)).size,3);
 for(const d of data.dossiers)for(const x of [...d.economics,...d.historical_company_financials])assert.ok(data.sources.some(s=>s.id===x.source_id),d.master_record_id+' '+x.source_id);
});
test('RRVL issuer completion receipt follows signed announcement, and segment financials are not issuer standalone',()=>{
 const r=rec('GSI23M08-002');
 assert.equal(r.event_timeline[0].date,'2023-08-23');
 assert.equal(r.event_timeline[1].date,'2023-09-06');
 assert.equal(r.economics.find(x=>x.metric==='investor_cash_received').value,8278);
 assert.equal(r.economics.find(x=>x.metric==='new_shares_allotted').value,68635010);
 assert.ok(r.historical_company_financials.every(x=>x.company_scope.includes('retail segment, not legal entity standalone')));
 assert.ok(r.uncertainties.some(x=>x.includes('posting date')));
});
test('Capital Bank conditional agreement and later completion are different states; contradictory stake preserved',()=>{
 const c=rec('GSI22J06-001');
 assert.equal(c.event_timeline[0].status,'CONDITIONAL_AGREEMENT_SIGNED');
 assert.equal(c.event_timeline[1].date,null);
 assert.equal(c.event_timeline[1].status,'COMPLETION_CONFIRMED_EXACT_DATE_NOT_FOUND');
 assert.equal(c.economics.find(x=>x.metric==='ownership_at_signing_anticipated').value,23.97);
 assert.equal(c.economics.find(x=>x.metric==='alternate_stake_claim').value,23.79);
 assert.ok(c.uncertainties.some(x=>x.includes('23.79%')));
});
test('Lucid May 2023 announced subscription only settled June; 2022 financial figures preannounce',()=>{
 const l=rec('GSI23M05-004');
 assert.equal(l.event_timeline[0].date,'2023-05-31');
 assert.equal(l.event_timeline[1].date,'2023-06');
 assert.equal(l.economics.find(x=>x.metric==='issued_common_shares').value,265693703);
 assert.equal(l.economics.find(x=>x.metric==='company_issuance_net_proceeds').value,1800);
 assert.ok(l.historical_company_financials.every(x=>x.pre_announcement_public===true&&x.publication_date<'2023-05-31'));
 assert.equal(l.historical_company_financials.find(x=>x.metric==='GAAP_operating_loss').value,-2593.991);
});
