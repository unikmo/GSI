import test from 'node:test';
import assert from 'node:assert/strict';
import { assessNaturalVerticalFit, rankNaturalVerticalFits } from '../lib/naturalVerticalFit.mjs';
const opportunity = {id:'op-1',sector:'Digital infrastructure',geography:'Germany',stage:'Growth',instrument:'Equity',ticketAmount:150};
const investor = {
 id:'fund-1',sectors:['Digital infrastructure'],geographys:['Germany'],stages:['Growth'],
 instruments:['Equity'],ticketMin:100,ticketMax:200,
 mandate:{status:'active_verified',verifiedAt:'2026-09-01',validUntil:'2026-12-31',sourceEvidenceId:'ev1'},
 evidence:[{id:'ev1',sourceUrl:'https://example.org/source',asOfDate:'2026-09-01',grade:'verified_primary'}]
};
test('verified criteria, not a probability',()=> {
 const r=assessNaturalVerticalFit(opportunity,investor);
 assert.equal(r.matchedWeight,100);
 assert.equal(r.currentMandateVerified,true);
 assert.equal(r.eligibility,'criteria_evidenced_check_with_investor');
 assert.equal('probability' in r,false);
});
test('historical activity cannot imply a current mandate',()=> {
 const r=assessNaturalVerticalFit(opportunity,{...investor,mandate:{status:'inferred'}});
 assert.equal(r.currentMandateVerified,false);
 assert.equal(r.eligibility,'unverified_research_further');
});
test('expired mandates are not current',()=> {
 const r=assessNaturalVerticalFit(opportunity,{...investor,mandate:{...investor.mandate,validUntil:'2026-10-01'}});
 assert.equal(r.currentMandateVerified,false);
});
test('missing evidence cannot manufacture fit',()=> {
 const r=assessNaturalVerticalFit(opportunity,{...investor,evidence:[]});
 assert.equal(r.historicalFit,false);
 assert.equal(r.currentMandateVerified,false);
 assert.equal(r.missingEvidence,true);
});
test('explicit mismatch blocks eligibility',()=> {
 const r=assessNaturalVerticalFit({...opportunity,ticketAmount:500},investor);
 assert.deepEqual(r.contradictions,['ticket']);
 assert.equal(r.eligibility,'contradicted');
});
test('rank is deterministic and penalises contradictions',()=> {
 const r=rankNaturalVerticalFits(opportunity,[{...investor,id:'bad',ticketMax:10},investor]);
 assert.deepEqual(r.map(x=>x.investorId),['fund-1','bad']);
});
test('invalid IDs rejected',()=> assert.throws(()=>assessNaturalVerticalFit({},investor),/Stable/));
