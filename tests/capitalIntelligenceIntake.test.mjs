import test from 'node:test';
import assert from 'node:assert/strict';
import {validateCapitalIntake,validateHistoricalInvesteeSnapshot} from '../lib/capitalIntelligenceIntake.mjs';
const metric=(value,periodEnd='2025-12-31')=>({state:'reported',value,currency:'EUR',periodEnd,sourceType:'management_accounts'});
const gap={state:'not_disclosed'};
const base=()=>({
 companyName:'Illustrative Company',companyId:'example-1',sector:'Infrastructure',subsector:'Data centres',businessModel:'contracted',stage:'growth',headquartersCountry:'DE',
 capitalPurpose:'Expansion',capitalInstrument:'Equity',transactionType:'minority',ownershipType:'Founder',ownershipSummary:'Founder-led',financialBasis:'management',fiscalYearEnd:'2025-12-31',fundraisingTimeline:'2027-Q1',
 operatingCountries:['DE'],targetMarkets:['FR'],existingInvestors:[],shareholders:[],capitalSought:{amount:150000000,currency:'EUR'},
 financials:{revenue:metric(100),revenueGrowth:metric(0.2),ebitda:metric(-10),ebitdaMargin:metric(-0.1),netIncome:metric(-15),netDebt:metric(25),cashBalance:metric(30),cashBurn:metric(5),valuation:gap},
 profitability:{status:'loss_making'},ownership:{verification:'estimated'},
 restrictions:{sanctionsReviewed:false,regulatoryConstraintsReviewed:false,existingCovenantsReviewed:false},
 riskFactors:{items:[]},evidenceSources:[{id:'s1',sourceType:'management_accounts',asOfDate:'2025-12-31'}]
});
test('negative EBITDA is a legitimate financial value; undisclosed valuation not zero',()=>{
 const r=validateCapitalIntake(base());assert.equal(r.valid,true);assert.equal(r.readiness,'conditional');assert.ok(r.unknowns.includes('financials.valuation'));
});
test('missing financial metric status blocks completeness',()=>{
 const b=base();delete b.financials.ebitda;const r=validateCapitalIntake(b);assert.equal(r.valid,false);assert.ok(r.issues.some(i=>i.path==='financials.ebitda'));
});
test('fabricated zero in undisclosed valuation rejected',()=>{
 const b=base();b.financials.valuation={state:'not_disclosed',value:0};const r=validateCapitalIntake(b);assert.equal(r.valid,false);
});
test('financial metric without period is rejected',()=>{
 const b=base();b.financials.revenue={...metric(100),periodEnd:null};assert.equal(validateCapitalIntake(b).valid,false);
});
const snapshot=()=>({
 snapshotId:'snap-1',masterRecordId:'GSI-1',investeeId:'company-1',investingVehicleId:'vehicle-1',
 eventType:'direct_equity',announcementDate:'2022-10-01',asOfDate:'2021-12-31',sourcePublishedAt:'2022-02-15',
 sourceId:'src-1',disclosureState:'public_partial',reviewState:'UNREVIEWED',
 financials:{revenue:metric(50,'2021-12-31'),ebitda:metric(-2,'2021-12-31'),netDebt:gap,enterpriseValue:gap,equityValue:gap},ownership:{type:'founder'}
});
test('valid historical pre-announcement snapshot',()=>assert.equal(validateHistoricalInvesteeSnapshot(snapshot()).valid,true));
test('post-announcement data not accepted as historical',()=>{
 const x=snapshot();x.asOfDate='2023-01-01';assert.equal(validateHistoricalInvesteeSnapshot(x).valid,false);
});
test('sources published after announcement do not count',()=>{
 const x=snapshot();x.sourcePublishedAt='2023-01-01';assert.equal(validateHistoricalInvesteeSnapshot(x).valid,false);
});
