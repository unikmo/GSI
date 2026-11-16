import fs from 'node:fs';
import assert from 'node:assert/strict';

const file = 'research/verified_dossiers/gsi_ten_source_linked_transaction_dossiers_2026-11-16_batch05_UNREVIEWED.json';
const batch = JSON.parse(fs.readFileSync(file, 'utf8'));
const master = [1, 2, 3, 4].flatMap(i => JSON.parse(fs.readFileSync(`research/enrichment/v98_all_651_minimum_profiles_part_${String(i).padStart(2, '0')}_UNREVIEWED.json`, 'utf8')).profiles);
const masterIds = new Set(master.map(x => x.master_record_id));
const ids = batch.dossiers.map(x => x.master_record_id);
assert.equal(masterIds.size, 651, 'Master must have 651 unique IDs');
assert.equal(batch.dossiers.length, 10, 'Batch must contain ten dossiers');
assert.equal(new Set(ids).size, ids.length, 'Duplicate dossier ID');
for (const d of batch.dossiers) {
  assert(masterIds.has(d.master_record_id), `Missing master ID: ${d.master_record_id}`);
  assert(['SOURCE_LINKED','PARTIAL','VERIFIED'].includes(d.dossier_status));
  assert(d.evidence.length > 0 && d.evidence.every(e => /^https:\/\//.test(e.url) && typeof e.checked_this_batch === 'boolean'), `Missing provenance: ${d.master_record_id}`);
  assert.equal(d.realized_returns.investor_specific_irr, null);
  assert.equal(d.realized_returns.investor_specific_moic, null);
  assert(d.not_publication_ready, 'Unreviewed batch must not be marked public');
  if (d.transaction.round_total_amount !== null) assert(d.transaction.round_total_not_investor_ticket === true, 'Round total confused with ticket');
}
console.log(JSON.stringify({master: masterIds.size, new_dossiers: ids.length, unique: true, provenance_present: true, publication_ready: false}));
