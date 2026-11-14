# GSI Capital Intelligence — database capture plan

**Stage:** Implemented as an **unapplied private SQL migration**, not yet a live database change. Original 67-column `gsi_master_full` remains untouched; no master records moved or reclassified.

## What the existing application already stores

The current `gsi_master_full` schema has 67 textual research fields, including master ID, investor group, investing entity, target/event, event type, geography, investment amount and currency, source references, status and integrity review flags. It does **not** natively store historical investee EBITDA, revenue, ownership, valuation, existing investors or ownership-sensitive financing terms. Its 445-record v9.6 master seed is an unreviewed baseline; subsequent revisions/records may add rows. Do not assume every master row is an investee transaction.

## Private expansion: `gsi_cap_private`

- `investee_entities`: named legal investee and parent identity.
- `investor_vehicles`: actual legal investing vehicle, kept distinct from headline parent group.
- `master_record_links`: master record ID **and source version**, relationship type, analyst review state. Logical references protect against schema drift; no copying or reclassification of masters.
- `evidence_sources`: publisher, title, URL or confidential-document category, publication/retrieval dates and evidence grade.
- `investee_snapshots`: financial and ownership context as of announcement, financial period and reporting basis, investing vehicle, event type and review status.
- `snapshot_metrics`: time-specific revenue, growth, EBITDA, EBITDA margin, EBIT, net income, FCF, cash, net debt, debt/leverage, capex, ARR, runway, valuation, etc. Metric keys are extensible; no new columns are required for a new financial metric. Explicit `NOT_DISCLOSED` is distinct from zero; negative earnings are allowed. `period_end` and evidence references are required for reported/estimated values.
- `snapshot_ownership`: shareholder and prior-investor categories, stakes, governance/control evidence and confidentiality.
- `snapshot_markets`: HQ, operating markets, revenue exposure, target markets and asset location, with source references.
- `snapshot_transaction_terms`: instrument, **investor-specific** ticket vs transaction headline value, stake, proceeds and co-investors, without conflation.
- `entity_variant_reviews`: review queue for group-variant / joint investor mentions **without auto-merging**.
- `research_review_events`: review trail and human escalation notes.

## Applicable research rules

1. **Point-in-time firewall:** snapshot and source date must be no later than the announcement for contemporaneous evidence; late disclosures must be separately labelled. Analysts must check `availability_at_announcement` and source publication dates, because financial period-end alone is insufficient.
2. **Evidence coverage:** undocumented, unavailable, zero, estimated and irrelevant are different states. Missing values cannot be silently imputed; units, currency and reporting periods matter.
3. **Entity graph:** do not classify a Mubadala / Masdar variant or Lunate as wholly owned or as a direct Mubadala deal without vehicle-level primary evidence. Group variants should remain a separate pending-review dimension.
4. **Investment scope:** only investee-eligible transaction types require full operating-company data. Funds, partnerships, non-binding items and policy events use appropriate event-specific requirements; they are not fictitious EBITDA samples.
5. **C-suite gate:** no decision-grade recommendations from this schema alone. A separate reviewer must validate current mandate, ticket capacity, strategy, conflicts, jurisdiction, historical comparables and adverse evidence.
6. **Privacy:** both project schemas `gsi_fit_private` and `gsi_cap_private` are proposed as private and unexposed to the Data API, with RLS and revoked grants. No intake UI or public API is added.

## Mubadala pilot: preserve unresolved classifications

- 163 exact-name group records (28 proposed); 18 joint/variant mentions held out.
- Do not fold the 18 rows into the exact-name population; collect evidence for underlying investing vehicle, parent relationship and direct exposure first.
- Retain review flags for 2 fund-family and 22 minority-family records.
- Leave Lunate relationship, 5 unmapped statuses and 9 unmapped event types **unresolved** until source-backed classification, then review. No silent reassignment.
- Fund profile denominators, investor amounts and count of investee-eligible deals must be recomputed only after review; unknown amount is never zero.

## Deployment / verification requirements

1. Check the Supabase project's existing exposed-schema list and confirm `gsi_cap_private` is not included. Check schema permissions, backups and quota status.
2. Apply `supabase/capital_intelligence_snapshots_private.sql` in a controlled private environment **after migration review**; do not use the anonymous API key.
3. Run permissions, table count and unchanged master-count checks, then sample a real source-backed historic investee. Never seed invented data.
4. Verify record linkage, financial period and source date, confidential-document protections, auditability, and zero public exposure. Only then consider internal analyst interfaces.

All data remains **UNREVIEWED, NOT decision-grade** without QA signoff. No public release is authorised.
