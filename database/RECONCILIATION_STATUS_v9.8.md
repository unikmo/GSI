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
- Remaining **47 period-specific historical syndicate files**: not yet individually checked against v9.8; may duplicate the merged map.
- Status: 157 proposed map-row references checked; **0 unmatched in this subset**. These are not necessarily 157 distinct relationships.

### Still required before completion

- Compare **field values**, status changes, provenance, amount and stage caveats for already matched ledger and syndicate IDs.
- Classify all **63 candidate lead files**, including the merged 1950–2019 file with 281 rows, using economic-event matching rather than exact narrative strings; check supersession/overlap.
- Reconcile **66 coverage registers**, supporting audits and founder ruling logs, without copying coverage assertions or equating a research attempt with a proven zero-deal result.
- Complete checks for 47 period-specific historical syndicate maps.
- Record defensible additions/corrections only after evidence/ruling checks; preserve canonical four files and avoid duplicate economic transactions.

**No further external research, no Supabase writes, no merge or release.**
