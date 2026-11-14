import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const sql=readFileSync(new URL('../supabase/capital_intelligence_snapshots_private.sql',import.meta.url),'utf8');
const names=['investee_entities','investor_vehicles','master_record_links','evidence_sources','investee_snapshots','snapshot_metrics','snapshot_ownership','snapshot_markets','snapshot_transaction_terms','entity_variant_reviews','research_review_events'];
test('all private investee research tables are defined',()=>{
 for(const t of names)assert.match(sql,new RegExp('CREATE TABLE IF NOT EXISTS gsi_cap_private\\.'+t+'\\s*\\(','i'));
});
test('private access controls and RLS are present',()=>{
 assert.match(sql,/REVOKE ALL ON SCHEMA gsi_cap_private FROM PUBLIC, anon, authenticated/i);
 assert.match(sql,/REVOKE ALL ON ALL TABLES IN SCHEMA gsi_cap_private FROM PUBLIC, anon, authenticated/i);
 assert.match(sql,/ENABLE ROW LEVEL SECURITY/i);
 assert.doesNotMatch(sql,/CREATE POLICY/i);
});
test('master remains read only and no fictitious research seed',()=>{
 assert.doesNotMatch(sql,/(?:ALTER|UPDATE|DELETE FROM|TRUNCATE|DROP TABLE)\s+(?:TABLE\s+)?(?:public\.)?gsi_master_full/i);
 assert.doesNotMatch(sql,/INSERT INTO\s+gsi_cap_private/i);
});
test('company metrics cannot zero-fill unknown facts',()=>{
 assert.match(sql,/state NOT IN \('REPORTED','ESTIMATED'\) AND metric_value IS NULL/);
 assert.match(sql,/evidence_id IS NOT NULL AND period_end IS NOT NULL/);
});
test('group-variant reviews and point-in-time checks exist',()=>{
 assert.match(sql,/entity_variant_reviews/);
 assert.match(sql,/financial_as_of IS NULL OR financial_as_of <= announcement_date/);
});
