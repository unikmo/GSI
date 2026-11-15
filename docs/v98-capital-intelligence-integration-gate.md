# GSI capital intelligence — integration gate (2026-11-15)

**Status:** implementation workstream active; not released; no production or Supabase writes. Feature branch `feature/natural-vertical-fit-foundation`, canonical research branch `research/v9-8-historical-and-consortium-2026-11-15`.

## Canonical reconciliation snapshot
Latest verified research-branch counts: **651 master records (67 columns), 371 ledger, 206 syndicate links, 651 crosswalk, 200 held-case dispositions**. Exact master/crosswalk ID parity, unique IDs, no orphan syndicate links, and structurally valid CSV were verified independently. The 200 cases include **10** still labeled `SOURCE_VERIFICATION_PENDING`, plus **50** existing-record links still provisional. These are open research exceptions, not a reason to invent data or to label 190 cases investor-grade.

**Close the historical backlog as an initial source-disposition pass, not as evidence-certified historical completeness.** Retain old scope decisions and hold statuses; do not restart general backward deal discovery until the investor/investee enrichment is adequately built. Historical months marked `NOT_SCREENED` stay unscreened.

## Source-of-truth boundary

- **Research branch:** latest v9.8 working CSV tables and original research exception registers; never overwrite them using 445-row v9.6 import scripts.
- **Feature branch:** private investee snapshots, investor vehicles, source records, strategy and divestment lifecycle SQL, consortium graph and staged JSON dossiers.
- **Bridge:** `lib/gsiEnrichmentBridge.mjs` is a read-only linkage and duplication guard. It accepts the canonical CSV strings and research JSON objects; run it against real files after an authenticated checkout or controlled merge. Its output cannot certify economic claims.
- **Existing `scripts/build-gsi-private-import.mjs`:** explicitly locked to 445 v9.6 records. **Do not run it as a v9.8 production importer**, and do not silently replace its 445 integrity assertion. Build a distinct v9.8 import after reconciling record identities and versioned evidence.
- **Private SQL:** `supabase/capital_intelligence_snapshots_private.sql`, `supabase/capital_intelligence_strategy_lifecycle_private.sql`, and `supabase/capital_intelligence_consortium_members_private.sql`. Apply in that dependency order only after checking schema visibility, RLS, backups and permissions. They are not yet deployed.

## Evidence-first operating priorities

1. Link each existing snapshot/dossier to its **v9.8 master ID and version**, logging missing IDs, repeated records, contradictory sources and vintage mismatches. Do not treat research batch rows as fresh investments.
2. Review investor parent/vehicle attribution. A group-affiliate mention is not proof of direct sovereign capital.
3. Capture dated investee revenue, EBITDA, financial period, cash flow, leverage, valuation and cap table, including **NOT_DISCLOSED** instead of imputation. Segment-level revenue and adjusted/non-IFRS metrics are not interchangeable.
4. Capture every actual consortium member and its role (GP, LP, arranger, seller, co-investor, sovereign participant), signed versus funded investment, ownership percentage, currency, evidence publication date and changing membership.
5. Capture divestments as lifecycle events, not additions to the original investment deal count: partial/full exit, buyer, shares sold, stakes before/after, proceeds versus whole-deal consideration, cost basis, IRR/MOIC only if evidenced. Link entry and exit, preserve after-the-fact sources as retrospective.
6. Model fund strategy changes with dated documentary claims and separately labeled hypotheses; do not infer geopolitical causal motives.

## Release gates

- Maintain the 67-column master unchanged and the ledger/syndicate/crosswalk relationships intact.
- Every imported financial datum must have date, currency, measurement basis and cited source.
- No inferred investor-specific capital from financing round size or consortium valuation.
- No duplicate economic deals due to multiple source batches or signing/closing.
- No fabricated current investor appetite, investment returns, or time-travel financial facts.
- Test the real snapshot-to-v9.8 coverage; unit tests with synthetic fixtures alone are not end-to-end QA.
- Verify private deployment security, RLS, and no anonymous access before any data migration.
- Production changes and public publication require separate release approval.

## Work completed this continuation

- Private consortium member, commitment, funded amount, stage and evidence schema committed.
- New read-only v9.8 enrichment linkage bridge committed with a synthetic regression suite (CSV parsing, unresolved cases, overlap and non-promotion).
- No data seeded into the live database; branch histories have **not** yet been integrated into one tested branch.
