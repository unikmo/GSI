# GSI v9.8 — Independent structural QA checkpoint

Date: 2026-11-15
Scope: Existing-research consolidation only, draft PR #1, branch `research/v9-8-historical-and-consortium-2026-11-15`.
Status: **STRUCTURAL QA PASS; EVIDENCE QA / RESEARCH COMPLETENESS NOT CERTIFIED**.

## Reproducible checks on GitHub source content

The five CSV files below were fetched from the review branch and parsed with quote-aware CSV parsing, including embedded commas, escaped double quotes and quoted newlines. Counts exclude headers.

| File | Rows | Columns | Malformed-width rows |
|---|---:|---:|---:|
| `GSI_Global_Research_Master_v9.8_WORKING.csv` | 651 | 67 | 0 |
| `GSI_Research_Ledger_v9.8_WORKING.csv` | 371 | 21 | 0 |
| `GSI_PE_Syndicate_Map_v9.8_WORKING.csv` | 206 | 19 | 0 |
| `GSI_Label_Crosswalk_v9.8_WORKING.csv` | 651 | 10 | 0 |
| `RECONCILIATION_200_HELD_CASES_v9.8.csv` | 200 | 14 | 0 |

- Master `master_record_id` duplicates: **0**.
- Ledger `record_id` duplicates: **0**.
- Crosswalk `master_record_id` duplicates: **0**.
- Held case `resolution_case_id` duplicates: **0**.
- Master IDs without crosswalk IDs: **0**.
- Crosswalk IDs without master IDs: **0**.
- Syndicate `linked_master_id` values absent from BOTH master and ledger: **0**.

## Remaining ten generic evidence-pending cases

Exactly **10** of 200 held cases have `resolution_outcome=SOURCE_VERIFICATION_PENDING`:
`GSI-HOLD-007`, `GSI-HOLD-019`, `GSI-HOLD-038`, `GSI-HOLD-063`, `GSI-HOLD-068`, `GSI-HOLD-070`, `GSI-HOLD-111`, `GSI-HOLD-115`, `GSI-HOLD-120`, `GSI-HOLD-121`.

The remaining **190** have another recorded *disposition*. This means **neither 190 verified transactions nor 190 independently source-certified claims**. `EXISTING_RECORD_LINK_STILL_PROVISIONAL` alone accounts for **50** of the dispositions.

## QA limitations and gate

This checkpoint verifies **structure and reference integrity only**, not economic-event deduplication, source authenticity, legal investor eligibility, dates, investor-specific cash, classifications, or period-level research coverage.

- The 651 master records are heterogeneous: provisional/held and noncounted stage records may be included.
- Preserve the founder's scope rulings, original statuses, audit trails and source uncertainty.
- The historical coverage registers contain overwhelmingly unscreened or only partially screened entries; no 1950–2026 completeness claim.
- All outstanding evidence exceptions and other founder/ledger chronology issues still require source-level QA.
- No external research sweep, Supabase writes, main-branch merge, publication or deployment has been performed by this checkpoint.
- The review PR must remain draft until independent domain/evidence review is complete.

## Source snapshots at time of QA

| File | Git blob SHA |
|---|---|
| Master | `b746ea81d96675250e3150d2d8715f98b0f9618d` |
| Ledger | `6fbd325a0f99da4318e25d5df39994d3d77980fd` |
| Syndicate map | `6675c2775c7a51c9502b32601d1da64018dbb261` |
| Crosswalk | `0df804b943b32700f523a22407ccc39ff97052b1` |
| 200 held cases | `93994d82f4662df0f8fddebf907d335d5402994f` |

If subsequent commits change any of these source blobs, rerun the structural checks before relying on this checkpoint.
