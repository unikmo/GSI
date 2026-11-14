import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const file=JSON.parse(readFileSync(new URL('../research/investee_snapshots/mubadala_pilot_2026-11-14.json',import.meta.url),'utf8'));
const date=x=>typeof x==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x);
test('pilot includes real master records, source register and unreviewed label',()=>{
 assert.equal(file.research_status,'UNREVIEWED');
 assert.equal(file.records.length,2);
 assert.equal(new Set(file.records.map(x=>x.master_record_id)).size,2);
 assert.ok(file.sources.length>=4);
});
test('metrics cite dated sources no later than announcement and distinguish missing fields',()=>{
 for(const r of file.records){
  assert.ok(date(r.announcement_date));
  assert.ok(Array.isArray(r.company_snapshot.unknown));
  assert.ok(r.company_snapshot.unknown.length>0);
  assert.ok(r.company_snapshot.as_of_date<=r.announcement_date);
  for(const d of r.company_snapshot.disclosures){
   assert.ok(typeof d.basis==='string'&&d.basis.length>10);
   const s=file.sources.find(x=>x.id===d.source_id);
   assert.ok(s, d.source_id+' not in sources');
   assert.ok(date(s.published_on));
   assert.ok(s.published_on<=r.announcement_date);
   assert.ok(typeof s.url==='string'&&s.url.startsWith('https://'));
  }
 }
});
test('headline values cannot be misrepresented as Gulf investor cheque',()=>{
 for(const r of file.records) for(const t of r.announced_terms){
  if(t.field.includes('valuation')||t.field.includes('round')||t.field==='enterprise_value')
   assert.match(t.basis,/NOT investor cheque|NOT Mubadala-specific cheque|valuation without/i);
 }
});
test('later CI closing cannot leak into 2024 entry snapshot',()=>{
 const ci=file.records.find(x=>x.master_record_id==='GSI24N11-005');
 assert.ok(ci);
 assert.ok(ci.later_status.effective_date>ci.announcement_date);
 assert.equal(ci.later_status.used_as_contemporaneous_input,false);
});
