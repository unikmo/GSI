# GSI v9.8 coverage reconciliation audit (existing sources only)

Date: 2026-11-15
Source: `proposals/*_Coverage_Register_PROPOSED.csv` in the GSI repository. These are **proposed historical source-coverage checks**, not completed transaction records or new market research.

## Results

All **65 individual period/monthly coverage-register files** were read and parsed. They contain **8,580 month-by-source-group rows**.

| Source coverage status | Rows |
|---|---:|
| NOT_SCREENED | 8,198 |
| PARTIAL_TARGETED_SCREEN | 377 |
| NOT_SYSTEMATICALLY_SCREENED | 5 |
| **TOTAL** | **8,580** |

The merged `GSI_Merged_1950_2019_Coverage_Register_PROPOSED.csv` is **1,890,659 bytes** in GitHub, but the connected GitHub file-content reader returned an empty text body, so it was **not independently parsed**. Its overlapping date range must not be counted a second time. The 65 individual source files remain available as coverage provenance.

This audit does **not** imply that 8,198 months have never been searched; the unit here is a month-by-source-group row, and the labels represent the files' stated coverage status. Neither a NOT_SCREENED row nor a targeted screen proves zero investment activity. Consequently, claiming comprehensive coverage from 1950 through 2026 would be unsupported.

## Source grouping and QA observations

- Individual period registers cover 1950–2019 in 47 historical source files; 2025 June–December and 2026 January–November account for 18 further individual monthly files.
- Normalised statuses: only the three values above were encountered in the 65 files.
- Some status descriptions mention source groups that were not yet established during older periods; treat these as context for future coverage checks, not historical transactions.
- Leave source URL and review-date history intact in the original proposal files. A coverage row should never be inserted as an equity investment master row.

## Next actions before research may resume

1. Validate any discrepancies with the unreadable merged coverage register using a different authenticated file download route.
2. Reconcile the 66 proposal audits, 11 founder/overview lead files and 3 2025 backfills against candidate, ledger, syndicate and master dispositions.
3. Recheck source evidence and economic-event uniqueness for 200 held candidate leads, 72 ledger-only candidates, and 8 proposed corrections.
4. Preserve source status and chronology. Do not relabel NOT_SCREENED / PARTIAL_TARGETED_SCREEN as complete.
5. Obtain evidence QA approval before claiming comprehensive historical coverage or merging the final dataset.

**Research status: CONSOLIDATION IN PROGRESS; no new external deal research.**
