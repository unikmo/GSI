# GSI v9.8 — 651-record source and minimum-profile seed checkpoint
Date: 2026-11-16
Status: **FULL SOURCE SEED PREPARED IN GITHUB; NOT IMPORTED INTO POSTGRESQL; NOT FULLY ENRICHED OR CERTIFIED**.

## Canonical versioned source files in feature branch
- Original global master **651 rows, 67 columns**; research ledger **371 rows, 21 columns**; syndicate map **206 rows, 19 columns**; crosswalk **651 rows, 10 columns**; held cases **200 rows, 14 columns**. Five original Git blob SHAs match the research review branch and are enforced by the private SQL generator.
- Master unique IDs **651**; exact crosswalk 1:1; syndicate references orphaned **0**; generic evidence-blocked held cases **10**; provisional held links **50**. Historical investment certification remains incomplete.
- Full source staging consists of **2,079 source rows** (five tables), not 2,079 transactions. SQL version `v9.8_WORKING_2026_11_15` never overwrites the 445-row v9.6 baseline.

## Uniform minimum enrichment seed
- Four manageable JSON batches `research/enrichment/v98_all_651_minimum_profiles_part_01..04_UNREVIEWED.json`: **163 + 163 + 163 + 162 = 651 unique canonical profiles**, independently parsed and read back.
- Each carries canonical investor group/entity, target/event label, geography, economic event type, transaction stage, amount scope, sources, completion/announcement dates where stated, evidence flags and unresolved source gaps. **No null or unknown values imputed as zero.**
- PE syndicate historical relationship references preserved: **155** linked occurrences across master IDs. The remaining **51 of 206** map references point to research-ledger IDs rather than master rows; they remain in the copied full syndicate source table, not silently associated with nonexistent master IDs.
- Legal investing-vehicle identity, exact ownership, contemporaneous audited revenue/EBITDA, cap table, deal adviser/law-firm identities, investor-specific divestment proceeds, IRR/MOIC remain **null/empty in this minimum uniform seed**, pending independently supported enrichment. Richer existing pilot research and 445-source-linked enrichment material are preserved separately for later versioned join.
- The profiles represent **all master research rows**, not necessarily 651 completed equity transactions. Holds, duplicates and non-investment events have their native original event/status fields preserved.

## Implementation artifacts
- `supabase/gsi_v98_versioned_source_staging_private.sql`: versioned, RLS-enabled, unexposed source and manifest tables.
- `scripts/build-gsi-v98-private-staging.mjs`: deterministic `--check` and `--output` generator for all 2,079 source claims, fixed blob-SHA guard, ID/crosswalk/syndicate/hold verification, idempotent no-overwrite insertion, SQL row-count assertions.
- `tests/gsiV98FullSeed.test.mjs` and `tests/gsiV98FullEnrichmentSeed.test.mjs`: assertions for raw source counts, 651 profile identity coverage, zero financial/law-firm fabrication, private migration and preserved partner links.
- CI workflow path filters updated.

## Verification boundary
**Passed:** GitHub file readbacks; real-data quote-aware CSV structural checks; profile batch JSON readback; 651 unique profile IDs; no master/syndicate orphan links; crosswalk parity; 10 / 50 exception state counts. **Not yet verified:** Node test runner result on CI, migration application in PostgreSQL staging, RLS/grant audits in running Supabase, complete legal/financial/exit enrichment for all investee-eligible rows, production deployment. No production write or public release in this checkpoint.

## Next actions
Execute Node tests in a checked-out repository and repair any failures; run the versioned migration plus generated SQL only in verified private staging after access/backups, and validate all 2,079 inserts. Join existing 445 enriched IDs without corrupting original research evidence, classify the remaining 206 source rows by investee eligibility, and enrich verified private Gulf fund/law firm/consortium and divestment claims. Keep any unknown economics null. Release requires sign-off.
