import test from 'node:test';
import assert from 'node:assert/strict';
import {parseCsv,reconcileEnrichment} from '../lib/gsiEnrichmentBridge.mjs';
test('CSV preserves embedded commas, newlines and escaped quotes',()=>{
 assert.deepEqual(parseCsv('id,name\n1,"A, B"\n2,"C ""D""\nE"\n'),[{id:'1',name:'A, B'},{id:'2',name:'C "D"\nE'}]);
 assert.throws(()=>parseCsv('a,b\n1\n'),/width mismatch/);
});
test('unreviewed research cannot auto-certify, and overlaps and holds remain visible',()=>{
 const r=reconcileEnrichment({
  masterCsv:'master_record_id,target_or_event\nA,Alpha\nB,Beta\n',
  ledgerCsv:'record_id\nL\n',
  crosswalkCsv:'master_record_id\nA\nB\n',
  syndicateCsv:'linked_master_id,private_equity_counterparty\nA,Fund1\nL,Fund2\n',
  heldCasesCsv:'resolution_case_id,resolution_outcome\nH1,SOURCE_VERIFICATION_PENDING\nH2,EXISTING_RECORD_LINK_STILL_PROVISIONAL\n',
  researchFiles:[{path:'one.json',data:{status:'UNREVIEWED',records:[{master_record_id:'A',master_version:'v9.6_WORKING'},{master_record_id:'UNKNOWN'}]}},{path:'two.json',data:{records:[{master_record_id:'A'},{investee:'No link'}]}}]
 });
 assert.equal(r.canonical.master,2);
 assert.equal(r.research.linked_occurrences,2);
 assert.equal(r.research.distinct_linked_records,1);
 assert.equal(r.research.overlapping_sources.length,1);
 assert.deepEqual(r.research.unmatched.map(x=>x.issue),['NOT_IN_V98_MASTER','NO_MASTER_ID']);
 assert.deepEqual(r.evidence_exceptions.source_verification_pending_ids,['H1']);
 assert.equal(r.integrity.crosswalk_exact,true);
 assert.equal(r.integrity.syndicate_orphans.length,0);
 assert.equal(r.admissibility,'NO_AUTO_PROMOTION_TO_VERIFIED_OR_FUNDED');
});

test('legacy case and id formats are linked without text-only guessing',()=>{
 const r=reconcileEnrichment({masterCsv:'master_record_id\nA\n',ledgerCsv:'record_id\nL\n',crosswalkCsv:'master_record_id\nA\n',syndicateCsv:'linked_master_id\nL\n',heldCasesCsv:'resolution_case_id,resolution_outcome\nH,SOURCE_VERIFICATION_PENDING\n',researchFiles:[{path:'legacy.json',data:{cases:[{id:'A'},{investee:'Unlinked'}]}}]});
 assert.equal(r.research.linked_occurrences,1);
 assert.equal(r.research.unmatched.length,1);
 assert.equal(r.research.unmatched[0].issue,'NO_MASTER_ID');
});
