import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const sql=readFileSync(new URL('../supabase/capital_intelligence_strategy_lifecycle_private.sql',import.meta.url),'utf8');
for(const name of ['fund_strategy_versions','strategy_change_events','macro_political_observations','transaction_lifecycle_events','transaction_strategy_assessments','fund_clarification_questions']){
  test('private strategy schema includes '+name,()=>assert.match(sql,new RegExp('CREATE TABLE IF NOT EXISTS gsi_cap_private\\.'+name+'\\s*\\(','i')));
}
test('private access and RLS without open policies',()=>{
 assert.match(sql,/REVOKE ALL ON SCHEMA gsi_cap_private FROM PUBLIC, anon, authenticated/i);
 assert.match(sql,/REVOKE ALL ON ALL TABLES IN SCHEMA gsi_cap_private FROM PUBLIC, anon, authenticated/i);
 assert.doesNotMatch(sql,/CREATE POLICY/i);
 assert.equal((sql.match(/ENABLE ROW LEVEL SECURITY/g)||[]).length,6);
});
test('separates exit proceeds from headline and allows unknowns',()=>{
 assert.match(sql,/investor_specific_proceeds numeric/);
 assert.match(sql,/gross_proceeds numeric/);
 assert.match(sql,/realised_irr_percent numeric/);
 assert.match(sql,/effective_date date/);
 assert.match(sql,/status IN \('ANNOUNCED','SIGNED','REGULATORY_APPROVED','COMPLETED','CASH_SETTLED','UNVERIFIED'\)/);
});
test('strategy divergence supports uncertainty and alternate explanations',()=>{
 assert.match(sql,/alternative_explanations text\[\]/);
 assert.match(sql,/driver_confidence IN \('DIRECTLY_STATED','INFERRED','UNKNOWN'\)/);
 assert.match(sql,/NOT_ASSESSABLE/);
});
test('historical master remains untouched and no fabricated seed is inserted',()=>{
 assert.doesNotMatch(sql,/(?:ALTER|UPDATE|DELETE FROM|TRUNCATE|DROP TABLE)\s+(?:TABLE\s+)?(?:public\.)?gsi_master_full/i);
 assert.doesNotMatch(sql,/INSERT INTO gsi_cap_private/i);
});
