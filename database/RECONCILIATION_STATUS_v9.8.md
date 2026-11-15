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
