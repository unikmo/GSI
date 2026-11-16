# Gulf private capital enrichment — implementation and source QA, 16 Nov 2026

**State: private working research; unreviewed; NOT deployed.**

This pass expands GSI beyond Gulf sovereign investment vehicles with a separate research seed for Gulf private managers, manager/fund links, investee/ownership facts, consortium members, exits and transaction advisers (including involved law firms).

## Implemented on `feature/natural-vertical-fit-foundation`

- Manager registry: **8** source-linked Gulf-focused managers; **4** named fund/platform entries. Manager beneficial ownership and exact investing legal entity remain **UNVERIFIED** until supported; private-markets activity is not evidence of private beneficial ownership.
- Transaction/lifecycle research: **8** event records, of which **5** target-company transactions, **2** historic exits and **1** fund LP subscription. These are not additions to sovereign master count and not 8 fully verified investments.
- Adviser coverage: **12** source-linked advisory engagements, including **9 distinct law firms**. Lawyer firm identity and client-side role are separate from any investee company operating in legal services. Adviser names are sourced to deal announcements or law-firm engagement releases.
- Member relationships: Investcorp + PSP Investments / PKFOD; Shorooq-led FMSi investor and Emirates Growth Fund plus unnamed others; fund commitment by SAB Invest to STV Emerging Tech & AI Fund. Unknown members/amounts remain expressly unknown.
- Retrospective exits: Jadwa GEMS (industrial waste) and UEMedical with historical reported fund/stake/exit route but no exact validated day or investor-specific sale proceeds.
- No fabricated investor cheque, cash settlement, return, IRR or MOIC. Financial indicators without validated financial period/accounting basis remain issuer operating claims rather than certified financial metrics.

## Sovereign master collision control

Compared the 8 pilot event investee labels against all **651** canonical master `target_or_event` values in `database/GSI_Global_Research_Master_v9.8_WORKING.csv` on the independent research branch. The search was **name-based screening only**, NOT a transaction identity verification.

- Seven of eight pilot names had no simple text/name-token candidate in the sovereign master.
- The short name **GEMS** yields one **false-positive** sovereign master candidate: `GSI14M10-001` is **GEMS Education** with **Mumtalakat**, whereas `PRIV-JAD-GEMS-EXIT-2019` is Jadwa's **industrial-waste-management GEMS**. **DO NOT LINK OR MERGE THESE ENTITIES**. Source: issuer and manager respective descriptions.
- Absence of an exact text match is NOT proof that no economic event overlaps: expand reconciliation by investors, vehicles, dates and legal identities before any canonical merge.

## Code and staging

1. `supabase/capital_intelligence_transaction_advisers_private.sql`: professional service firms + client-side engagement roles, evidence, RLS; separate from investment participants.
2. `supabase/capital_intelligence_private_research_staging.sql`: batch and record intake with review status and no public grants.
3. `scripts/validate-gsi-private-fund-pilot.mjs`: provenance, fund-to-manager links, unknown tickets, role separation and no uncertified promotion.
4. `scripts/build-gsi-private-fund-staging.mjs`: `--check` or `--output` generates private **unapplied** SQL for 20 rows (8 managers, 4 funds, 5 transactions, 2 exits, 1 fund commitment). `ON CONFLICT DO NOTHING` and explicitly `UNREVIEWED`.
5. Unit tests in `tests/gsiPrivateFundPilot.test.mjs` and `tests/gsiPrivateFundStaging.test.mjs`; CI push trigger updated.

## Verified and not verified

- **Verified:** GitHub commit/file readbacks, JSON parsing, 20 distinct intake IDs, source IDs/manager links, adviser role coverage and RLS/CI source presence by independent readback. Zero broken relationships in this pilot.
- **Not yet verified:** Node test-suite execution in GitHub Actions, SQL execution against PostgreSQL, true RLS permissions in Supabase staging, normalized table ingestion, complete private-fund population, all historic company financial statements and returns, all legal participants.
- **Not done:** Merge to main, publish, production deployment, import of private research into live database.

## Next QA and research priorities

1. Expand the Gulf private manager universe country by country, distinguishing legal regulated manager, PE/VC/debt fund, SPV, ownership and LP identities.
2. Add source-backed individual investee financials, cap tables, legal deal vehicles, consortium and adviser data; track independent court/regulatory filings and contemporaneous financial period.
3. Create an analyst-reviewed identity crosswalk before normalizing any private event against existing sovereign record IDs.
4. Test this staged import in a private PostgreSQL environment with no exposed Data API and verify actual RLS/permissions; normalize only approved evidence.
5. Preserve **10 direct evidence-blocked historical sovereign cases** in separate review backlog. Do not claim comprehensive 1950–2026 coverage.

Sources are explicit per record in the two research JSON files; current publication/portfolio pages are retrospective where flagged. No paid third-party research or database release was performed.
