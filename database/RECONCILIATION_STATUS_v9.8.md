# GSI v9.8 backlog reconciliation — in progress

Date: 2026-11-15
Status: **INCOMPLETE — do not merge PR #1 as a comprehensive consolidation.**
Scope: **Existing research only. No new external deal research until all proposal packages are reconciled.**

## Authoritative data (review branch)

- `database/GSI_Global_Research_Master_v9.8_WORKING.csv`: 616 records, 67 fields. Includes 12 held historical development-loan screening records added since the 604-row v9.8 baseline.
- `database/GSI_Research_Ledger_v9.8_WORKING.csv`: 322 records.
- `database/GSI_PE_Syndicate_Map_v9.8_WORKING.csv`: 193 relationships.
- `database/GSI_Label_Crosswalk_v9.8_WORKING.csv`: 616 records.
- Keep historical v9.5 and v9.6 unchanged. The 41 subsequently researched candidates are **not** the complete backlog.

## Repository inventory

The `proposals/` directory has 340 items, including 63 candidate research files, 66 research-ledger files, 66 PE syndicate-map files, 66 coverage files, and supplementary audits, founder rulings and verification logs. These are **file counts, not transaction counts**.

The `proposals/GSI_Merged_1950_2019_Candidates_UNVERIFIED.csv` file has **281 candidate/lead rows**, overlapping the period-specific source packages. It must NOT be imported wholesale or added to the source package totals. Example statuses include 63 `UNVERIFIED_LEAD_MONTH_UNKNOWN`, 34 `LEDGER_ONLY_DIVESTMENT_NOT_ADDED`, 28 `LEDGER_ONLY_CANDIDATE`, and 16 `NOT_A_RECORD_NO_TARGET`.

Exact-normalised target-title equality found zero matches between these 281 lead descriptions and the master `target_or_event`; this is **not evidence that they are unique** because one is a narrative lead description and the other may have a short target name. Use investor/entity, transaction economics, dates, instrument and staged deal links to reconcile.

## Required reconciliation pass

1. Build a source-package inventory, preserve existing IDs and provenance, and identify source packages superseded by the merged 1950–2019 proposal.
2. Compare every proposed ledger, candidate, syndicated-party and coverage entry against the canonical 616-record v9.8 master and companion tables.
3. Classify each as already covered, genuinely new verified, provisional, ledger-only, hold, excluded/out-of-scope, duplicate/stage of existing event, or needs verification.
4. Observe founder rulings (`proposals/GSI_Founder_Rulings_2026-11-14.md`): founding milestones are not investments; state operating companies are ledger-only; no amount derivation without source; private royal capital outside scope; divestments ledger-only; Yinson/Kimmeridge backfills approved; Aramex domestic ledger-only.
5. Update the **same four v9.8 files** with tested, sourced changes only, maintaining 67-column master schema, stable IDs, crosswalk 1:1 coverage, and valid syndicate references.
6. QA total rows, economic duplicates, transaction stage classifications, primary-source integrity and true date coverage; publish reconciliation counts by result and remaining uncertainties.

## Completion gate

Backlog consolidation is complete only when all 340 proposal assets have a documented disposition or relationship to a superseding source; all accepted additions are in the existing tables; there are no unexplained duplicate economic deals or orphan syndicate/crosswalk references. New research may resume only thereafter. Data remains **unreviewed and not decision-grade** until evidence QA sign-off.

## Reconciliation execution — 2026-11-15 (confirmed GitHub readbacks)

### Research-ledger ID reconciliation — all 66 proposal ledger files screened

| Source group | Files | Proposed row occurrences | IDs absent from v9.8 ledger |
|---|---:|---:|---:|
| Individual historical packages, 1950–2019 | 47 | 103 | 0 |
| Merged 1950–2019 historical proposal (overlaps the 47 files) | 1 | 103 | 0 |
| Monthly packages, June–December 2025 | 7 | 56 | 0 |
| Monthly packages, January–November 2026 | 11 | 93 | 0 |
| **Total** | **66** | **355 (includes 103 overlapping)** | **0** |

This establishes that **all proposed research-ledger IDs in 66 source files already occur in the 322-row v9.8 ledger**. It does NOT establish that their fields are identical or that the economic transactions are verified. No new ledger rows were imported in this pass.

### PE syndicate proposal reconciliation — partially screened

- Merged 1950–2019 syndicate map: **102/102** rows match existing v9.8 map by linked ID + Gulf investor + partner + role.
- June–December 2025 syndicate proposals: **28/28** rows match by the same composite key.
- January–November 2026 syndicate proposals: **27/27** rows match by the same composite key.
- All **47 period-specific historical syndicate files** individually checked: 102/102 proposed links match v9.8 by composite key. These 102 overlap the merged 1950–2019 map.
- Status: **all 66 syndicate proposal files screened**: 259 proposed map-row occurrences (102 historical + 102 overlapping merged + 55 recent), **0 unmatched composite keys**. These are 157 source-package references after excluding the duplicated merged 102; they are not necessarily 157 distinct canonical map rows.

### Still required before completion

- Compare **field values**, status changes, provenance, amount and stage caveats for already matched ledger and syndicate IDs.
- Classify all **63 candidate lead files**, including the merged 1950–2019 file with 281 rows, using economic-event matching rather than exact narrative strings; check supersession/overlap.
- Reconcile **66 coverage registers**, supporting audits and founder ruling logs, without copying coverage assertions or equating a research attempt with a proven zero-deal result.
- Completed composite-key presence checks for all 47 period-specific historical syndicate maps; full field-level and economic-role QA remains.
- Record defensible additions/corrections only after evidence/ruling checks; preserve canonical four files and avoid duplicate economic transactions.

**No further external research, no Supabase writes, no merge or release.**

## Candidate screening — all 63 candidate files now inventoried

- 47 historical period-specific candidate files (1950–2019): **281 lead rows**; they overlap the separate merged 1950–2019 file, also **281 rows**. Count historical leads once, not twice.
- 15 candidate files (September–December 2025 and January–November 2026): **108 additional lead rows**.
- Together: **389 source leads** needing dispositions. All **63 candidate files** have been read for record/status inventory, including the merged file.
- A 389-row, source-linked screening matrix was committed to `database/RECONCILIATION_CANDIDATE_DISPOSITION_v9.8.csv` (not a transaction master or accepted-deal ledger).

| Initial classification from source status | Count |
|---|---:|
| Linked to an existing record (link still needs independent verification) | 32 |
| Ledger-only candidate (not yet automatically admitted) | 72 |
| Not a record / out of transaction-master scope | 76 |
| Unverified lead; held pending evidence | 200 |
| Correction requiring review | 8 |
| Parked/other | 1 |
| **Total** | **389** |

These are classifications inherited from proposal statuses, NOT an independent check of all 389 economic events. None of the 200 held leads should be imported as a verified deal without supporting evidence. The 72 ledger-only candidates require admissibility/evidence review before any new ledger row.

## Coverage-register work started

- Read and inspected representative registers: pre-1979, 2019 and November 2026.
- The 1950–1978 source register has 3,480 month-by-source-group rows, many `NOT_SCREENED`; a coverage row is not a verified transaction nor a completed exhaustive search.
- Coverage register aggregation and 66-file exception audit remain outstanding. Preserve `NOT_SCREENED`, `PARTIAL_TARGETED_SCREEN` and unknown statuses; do not infer empty months.

## Full source-table checks completed in this execution

**Ledger:** All 66 proposal ledger CSVs have been read. The 47 historical source packages' 103 entries are reproduced in the 103-row merged historical file. The 18 newer monthly packages contain 149 entries (56 in 2025; 93 in 2026). After eliminating the historical repeated source copy, **252 existing proposal-ledger rows** were compared with the canonical v9.8 ledger by record ID. Field-level comparison of all 103 merged historical and all 149 recent proposal rows found **zero differing values in common fields**. The historical 47 period files were checked for ID presence, not independently for every field against the merged copy.

**Syndicate map:** All 66 proposal maps were screened. The merged 1950–2019 102 rows match v9.8 by composite key and **by all common field values**. All 55 recent rows (28 from 2025 and 27 from 2026) also match the existing v9.8 map by composite key and all common field values. The 47 historical source-period map files have 102 rows and match by composite key; their common field values against the merged source file have not been separately rechecked.

**Candidate leads:** All 63 candidate files screened; see the separate 389-row initial disposition CSV. The source packages' original 281 historical candidate rows are duplicated by the merged historical candidate file, so count them once. The 108 additional 2025–2026 leads give a total of **389 non-duplicated source-lead rows**, of which 200 remain held as unverified.

**Coverage:** All 65 individual period/monthly coverage-register files read: **8,580 month-by-source-group rows** (8,198 NOT_SCREENED, 377 PARTIAL_TARGETED_SCREEN, 5 NOT_SYSTEMATICALLY_SCREENED). The separate merged 1950–2019 coverage file is 1.89 MB and its content reader returned empty; the merged audit says it contains 8,400 rows, consistent with the individual historical packages. See `database/RECONCILIATION_COVERAGE_STATUS_v9.8.md` for the limitations and status guardrails. **Do not mark historical periods as fully screened.**

**Auxiliary proposals:** Identified 66 proposed audit Markdown files, 8 founder/overview leads files, 3 special backfill proposals, the founder rulings and the verification log. Sampled audit files; all observed are uncertified and not decision-grade. Founder-ruling-approved Yinson/Kimmeridge backfills already appear in the v9.8 master and ledger; the Aramex domestic 2025 backfill is ledger-only under the founder ruling and should NOT be auto-inserted as a completed outbound-equity deal. Additional founder/overview leads still require economic-event reconciliation to the 389 candidate lead rows and master.

**Other research:** The previously generated 2021/2022 incremental research workbook is outside the repository's 340-item proposal folder and still requires explicit case-by-case comparison against canonical v9.8. Do not treat its records as merged merely because they exist as a local research workbook.

**QA gate is NOT met:** Evidence for 200 held leads, 72 ledger-only leads, 8 correction rows, 66 audit conclusions, founder lead overlap, and the remaining source/economic-transaction checks is unresolved. No new master rows were added from these source packages; this is an accounting/reconciliation pass, not a claim of comprehensive evidence sign-off.
