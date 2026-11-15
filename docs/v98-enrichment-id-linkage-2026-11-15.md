# GSI v9.8 — Cross-branch enrichment linkage report
Date: 2026-11-15
Status: **READ-ONLY ID LINKAGE QA PASSED; FINANCIAL CLAIMS AND EVIDENCE REMAIN UNREVIEWED**.

## Source scope
Compared **19** existing research JSON files on `feature/natural-vertical-fit-foundation` with the **651-row canonical master** on `research/v9-8-historical-and-consortium-2026-11-15`, at its checked source state (master blob `b746ea81d96675250e3150d2d8715f98b0f9618d`). Included `records`, `dossiers`, `cases` and explicitly identified legacy `id` fields. No external search or production database import was made.

## ID coverage

| Metric | Count |
|---|---:|
| Canonical v9.8 master records | 651 |
| Research file record occurrences | 653 |
| Explicitly linkable occurrences | **651** |
| Distinct existing master IDs linked | **445** |
| Additional canonical IDs not present in inspected enrichment files | **206** |
| Distinct master IDs occurring in multiple research records | **115** |
| Explicit-ID values not found in v9.8 master | **0** |
| Research records lacking an explicit master ID | **2** |

The two no-ID entries originate from `mubadala_energy_infrastructure_followons_2026-11-14.json` (third record) and `gsi_three_lifecycle_cases_2026-11-15_batch03.json` (third dossier). Those require **manual economic-event reconciliation** rather than inferred string matching.

**Interpretation:** the older **445 v9.6 master IDs** remain linkable in v9.8. Repeated appearances are source/batch overlaps, not new investments or unique financial dossiers. The **206 v9.8 rows without inspected enrichment** require event-family eligibility triage: some may be investments, some ledger/hold/stage or other non-operating-company records. **Do not assume 206 financial dossiers are required.**

## Critical safeguards

1. Do **not** run the existing `scripts/build-gsi-private-import.mjs` against v9.8: it is explicitly locked to the 445-row v9.6 seed and would not import the newest 206 records.
2. Preserve original `v9.6_WORKING` provenance even when linking an existing ID into v9.8; do not silently mark old sources as fresh v9.8 diligence.
3. Link each distinct economic event once, retain multiple research-source records and signing/closing stages.
4. Keep the **10 source-verification-pending held cases** and provisional existing-record links on the review backlog, never auto-promote them.
5. Distinguish investor-specific paid capital, commitments, whole-round amounts and total acquisition value.
6. Divestment records must link back to holdings, with buyer/seller, entry, follow-on, stake before/after, cost basis and investor-specific proceeds if actually evidenced.
7. Consortium memberships are many-to-many and time-specific; include sponsor, GP, sovereign, other PE, arranger, investor and seller roles without assuming all participants funded the same amount.

## Next execution gate

Use `lib/gsiEnrichmentBridge.mjs` against an authenticated local checkout of both branches, export a review-only manifest, and investigate the 2 no-ID cases and 115 overlapping ID groups. Then classify all 206 newly unprofiled canonical records by event family, determine which need genuine investee financial snapshots, and prepare a new v9.8-aware **private** import. Migration and live application QA require environment, backup, RLS and protected-data review before authorised deployment.

**This is a coverage/linkage measurement, not 445 independently certified investor-investee profiles or 651 source-verified investments.**
