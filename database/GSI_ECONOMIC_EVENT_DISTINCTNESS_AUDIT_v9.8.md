# GSI v9.8 — economic-investment distinctness audit (first pass)
Date: 2026-11-16
Source master SHA: `3ad274ddedf259a6728e541f235a04e0533c6cfe`
**Scope:** 651 working records. This is an **event-level triage** of existing metadata, not a claim that all 651 cases are independently verified sovereign-equity transactions. **No definitive distinct-deal number is yet warranted**, because narrative descriptions, nonuniform status categories, transaction stages and investor-entity relationships still require case review.

## Result: conservative one-to-one disposition of all 651 source IDs

| Initial category | Rows | What it means |
|---|---:|---|
| CANDIDATE_DISTINCTNESS_PENDING_ECONOMIC_REVIEW | 265 | Needs case-level disposition before a distinct verified equity-deal count |
| CANDIDATE_PENDING_EVENT_VERIFICATION | 202 | Needs case-level disposition before a distinct verified equity-deal count |
| NON_CORE_OR_NON_TRANSACTION_REVIEW | 52 | Needs case-level disposition before a distinct verified equity-deal count |
| EXPLICIT_DUPLICATE_LINKED | 2 | Two explicitly linked duplicates, not separate economic acquisitions |
| DOMESTIC_OR_INTRA_GULF_SCOPE_REVIEW | 116 | Needs case-level disposition before a distinct verified equity-deal count |
| DUPLICATE_STAGE_REVIEW | 2 | Needs case-level disposition before a distinct verified equity-deal count |
| NON_EQUITY_DEVELOPMENT_LOAN | 12 | Needs case-level disposition before a distinct verified equity-deal count |
| **Total** | **651** | Every original ID preserved |

## Deduplication decisions that are already defensible
- `GSI26B03-001` PIF/SALIC Olam Agri closing-stage is a known duplicate of `GSI25F02-001` signed-stage. **One economic acquisition**, not two. The database retains both stages for provenance.
- `V1.6_HOLDS-008` Apollo/Mubadala Capital is described as duplicate of `V1.5_HOLDS-006`. This is a **duplicate hold** pair, not a new sovereign outbound equity investment.
- Other possible same-event mentions, investor-entity synonyms, initial and follow-on purchases, announcement/closing, holding disclosures and fund/portfolio-company look-through are intentionally **not silently merged**.
- **Exact normalised investor + exact target-description equality produces zero duplicate groups**, but this is a weak signal: long narrative descriptions obscure economically identical events.

## Counting boundary for the final distinct-deals dataset
A counted unit is a **distinct, sourced economic investment event**, with named eligible Gulf sovereign investor/vehicle, underlying asset or fund interest, admissible geographic scope, economic instrument and explicit transaction stage. Count verified completed acquisitions / subscriptions separately from **announced-only** commitments and **signed but not closed** agreements. A follow-on acquisition or genuine separate tranche may be distinct if supported by separate cash/contract evidence. Exclude or separately report non-equity development loans, MOU-only cases, monitoring-only disclosures, domestic/intra-Gulf cases when measuring outbound equity, divestments, and stage duplicates. **Unknown funding is not zero.**

### Required independent verification before publishing any definitive number
1. Resolve investor entity identity, fund eligibility, and target aliases across all candidate rows.
2. Reconcile economic-event duplicates based on event chronology, target, instrument and stage, not title equality.
3. Separate capital commitment vs funded amount; do not use combined financing round/enterprise value as investor capital.
4. Review ambiguous programme/fund commitments and side vehicles; retain founder rulings.
5. Assign one persistent economic-event ID per admitted event and map every original record to it; keep excluded/held records separately.
6. Recompute both **distinct announced transactions** and **distinct completed equity transactions** after source review and ID mappings.

**QA:** input 651 unique IDs; output 651 unique IDs; no master alteration; explicit linked duplicates refer to IDs in source master; machine category is a *review queue*, not independent evidence approval.
