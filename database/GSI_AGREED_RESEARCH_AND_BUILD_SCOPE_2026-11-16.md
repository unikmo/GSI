# Gulf Sovereign Intelligence (GSI) — Agreed Research Scope, Product Direction and Build Plan

**Status:** Scope-and-decision record, not evidence of completed research or approval to publish.  
**Updated:** 16 November 2026  
**Repository / branch:** `unikmo/GSI` / `research/v9-8-historical-and-consortium-2026-11-15`

This consolidates decisions reflected in our GSI discussions, `CLAUDE.md`, the founder rulings, the v9.8 reconciliation files and the currently committed Next.js test application. Items identified as **agreed**, **conditional / proposed**, and **already implemented** have different statuses. Where scope decisions remain unresolved, this document preserves the uncertainty instead of inventing consensus.

## 1. Mission, users and research positioning — AGREED

**GSI is evidence-backed Gulf sovereign investment intelligence for institutional decisions**, not a generic investor marketplace, investor-introduction service or source of investment advice. The analytical question is not merely *which fund invested?* but **which legal vehicle invested, through what instrument and partners, at what economic stage, with what verified ticket and what this may reveal for strategy and eligibility**.

Target readers discussed: investment committees; CEOs/CFOs; corporate-development and strategy teams; institutional investors and fund managers; advisers; government investment agencies. Companies and advisers may use evidence-backed eligibility assessments and shortlists to determine which Gulf investment routes merit further research. A research-led assessment is **not** a promise of introduction, investment availability or current mandate.

**Geography:** the investment universe is Gulf sovereign capital investing **globally**. Target geography is a descriptive field, **not** an admission gate. Domestic and intra-Gulf transactions may be preserved in ledgers or separate analytical categories but should not inflate counts of **outbound cross-border** equity investment. Eligible state investment vehicles must be distinguished from ordinary state-owned operating companies, private royals and unsupported successor-group attributions.

## 2. Agreed research programme

### 2.1 Transaction history and coverage

- **Immediate priority agreed:** chronological, month-by-month research from **January 2020 through November 2026**, with no unverified month treated as zero activity; original announcement/signing dates and subsequent closings must be reconciled.
- **Parallel historical backfill:** 1950–2019, using dated first-party and contemporary source evidence where available. Historical source-group coverage is **incomplete** and must be labelled as such.
- Reconcile proposal packages, historical founder leads, holdings/legacy stages, candidate and held-case registers, fund-mandate documentation, original source identities and any later corrections into **one versioned evidence base**.
- **One canonical economic-event ID per distinct investment**, with many-to-one raw source-record links. Never conflate an announcement, signing and closing with separate economic investments; a separately financed follow-on tranche may count separately if evidence establishes an independent economic event.
- Identify the **exact count of distinct eligible investment events** before treating research-record summaries as definitive investment dossiers or removing any legacy files. Report separately: completed investments, announced/signed but not completed, provisional/under-source-review, and excluded/noninvestment or non-outbound events.
- Track **chronological coverage by source family** and what has been screened; report missing periods honestly rather than claiming exhaustive coverage.

### 2.2 Who and what to map

- Primary sovereign fund profiles: **PIF, Mubadala, ADIA, ADQ, QIA, KIA, OIA**, relevant affiliates, predecessors and named legally investing vehicles.
- Where verified: the sovereign's **actual SPV/subsidiary**, programme or platform; investment instrument; beneficial ownership and successor relationship; source-to-source independence; target company and underlying operating asset; geography; sector; economic ownership and investment stage.
- Separate but linked **PE/syndicate/consortium map**: global and Gulf PE firms, alternative capital providers, co-investors, fund-of-funds managers, strategic partners, lenders and advisers when they help explain Gulf capital routes. **Do not expand into a general-purpose global PE database.**
- Research fund mandates and current deployment signals as **publicly disclosed facts versus inferred historical patterns**, with contrary evidence and limitations. Historic investments alone do not prove a fund currently seeks an analogous deal.
- Capture fund commitment, total syndicate value, enterprise valuation, investor-specific consideration, drawn/deployed cash and ownership percentages **as distinct concepts**. If an investor-specific amount is undisclosed, do not derive it from headline size or fund ownership.

### 2.3 Source and audit standard

- Follow the **locked v4.9 classification/schema rules** and retain the existing v9.8 67-column working master; do not silently alter schema. Additional product attributes require founder ruling; track supplemental interpretation in linked research files until authorised.
- Primary and independent sources, retrieval/as-of dates, individual claim support and unresolved contradictions are needed for publication-grade claims. Preserve original assertions, subsequent corrections, audit trails, withheld cases and rejected duplicate links.
- Distinguish **confirmed fact / inference / hypothesis** and **announced / committed / signed / completed / deployed / exited**. A public deal announcement is not certification of capital transfer.
- Historical developer/corporate loans, divestments, MOUs, sponsorships, aircraft orders, government intra-group transfers and other excluded categories remain traceable but **are not silently counted as sovereign equity transactions**.
- Apply existing founder rulings recorded in [GSI_Founder_Rulings_2026-11-14.md](../proposals/GSI_Founder_Rulings_2026-11-14.md): historical group identity at investment time; private royals and specified Dubai holdings outside scope; state-owned operating companies ledger-only; no fabricated month or derived ticket; specific approved Yinson/Kimmeridge backfills and Aramex domestic ledger-only treatment.
- **Independent QA** covers full row-to-event reconciliation, idempotence/duplicate control, source integrity, amount-stage classification, valid link references, founder decisions and publication eligibility.

## 3. Intelligence outputs and dossier/report architecture — AGREED DIRECTION

For every **validated unique investment event**, provide one substantive, source-linked economic dossier with all original research rows and transaction stages attached. A 651-row source register is **not** 651 confirmed deals.

Six-part analytical report structure (set in `CLAUDE.md`):
1. **Executive judgement** — decision relevance and limitations.
2. **Verified developments** — dates, entities, transaction economics and evidence.
3. **Strategic interpretation** — supported implications and alternative explanations.
4. **Implications** — who may benefit, face risks or need to revise assumptions.
5. **Forward indicators** — what corroboration and changes to monitor.
6. **Evidence audit** — source reliability, contradictions, caveats and outstanding claims.

Further outputs agreed in principle:
- **Fund/vehicle profiles**, beginning with a Mubadala pilot and then expanding across the named Gulf institutions; compare observed sector/geography behaviour, co-investor networks, vehicles, conditional capital routes, statuses and evidence gaps.
- **Cross-fund comparative intelligence**: portfolio themes, investment partners, sector exposure, geographic shifts, divergence and observed capital activity, without inventing aggregate deployment totals.
- **Citable executive briefings and individual research dossiers** tailored to investment committee and CEO/CFO decisions.
- **Eligibility / capital-route research** for companies and advisers: defensible candidate shortlists with disclosed mandate fit, transaction precedents, ticket-size evidence and reasons to research further, **not investor matching, brokering, placement or an introduction guarantee**.
- Accessible, **free searchable and citable verified data for journalists** was discussed as an audience-building and credibility channel; this is a **publication concept**, not consent to make unreviewed data public.

## 4. Planned build and product architecture

### 4.1 Agreed technical approach / controls

- **GitHub** holds code, research versioning, reproducible import/QA scripts, migration plans and supporting audit material.
- **Supabase/PostgreSQL** is the proposed application data, source and evidence store; publication-grade data must be staged and QA-checked. Preserve existing working schemas and do not interpret SQL files as confirmation that a migration ran.
- **Next.js/Vercel** application structure already exists for testing. Any public production deployment must pass release approval and independent QA.
- One connected intelligence core serves research, profiles, briefings and future capital/eligibility analysis, keeping source-level provenance visible.

### 4.2 Existing implemented *test* surfaces (NOT the finished product)

The branch contains a basic Next.js app with:
- Database status and sample research records (`app/page.js`);
- Record detail route (`app/record/[id]/page.js`);
- Coverage, label-crosswalk and proposed event-type review pages;
- A **pilot** Mubadala profile page and the independent Markdown pilot analysis;
- A database health endpoint, Supabase client code, SQL schema/load scripts and deployment configuration.

Their existence does **not** establish database synchronisation, real-time working connections, completed UI design, authenticated customer workflows, a production deployment, paid features or fully verified data.

### 4.3 Proposed product surfaces and commercial modules — NOT YET COMMITTED / BUILT

- **Research workspace:** searchable investment events (rather than unfiltered source rows), configurable filters for fund, entity, geography, date, sector, instrument, partner and economic stage; source and audit views; corrections.
- **Entity and relationship intelligence:** drilldown from fund to SPV, portfolio asset, private-equity manager, consortium participant and original claims; comparison pages and vehicle-network views.
- **Decision Intelligence:** source-traceable six-part executive reports, comparative dashboards, emerging themes and monitoring of material developments.
- **Capital Intelligence:** evidence-backed eligibility analysis, current-mandate verification, capital route research, company profiles, adviser review workflow and justified shortlists.
- **Briefing/distribution:** citable journalist-facing research and curated executive briefs, subject to data QA and founder approval.
- **Subscriptions/paid access:** conditional on willingness-to-pay validation with institutional readers. No subscription or pricing model is already founder-approved simply because an app could support one.

The repository's own `CLAUDE.md` expressly calls the **Decision Intelligence** and **Capital Intelligence** products a *proposed, unvalidated two-product direction*. They should **not** be described as already released or financially validated.

## 5. Current recorded implementation and gaps (16 November 2026)

| Work item | What is actually recorded | Status |
|---|---|---|
| v9.8 working research master | **651** individual raw source/research records, not unique economic events | Implemented; unverified distinctness |
| Research ledger | **371** rows | Implemented; ledger context, not additional unique deals |
| PE/syndicate relationship map | **206** rows | Implemented; relationship units, not deals |
| Label crosswalk | **651** rows | Implemented; aligned row IDs |
| Historical held cases | **200** recorded candidate dispositions | Source QA still open |
| Preliminary transaction triage | **467** potential investment candidate rows, **not unique** | Incomplete; cannot be used as a distinct count |
| Dossier outputs | 651 raw-record summaries in a large file and 7 batches, plus separate source reviews | Preservation required; NOT certified economic-investment dossiers |
| Coverage audit | 8,580 month-by-source-group rows; 8,198 labelled NOT_SCREENED | Incomplete source screening |
| Source reviews | Select individual primary/contemporary cases and duplicate-pair findings | Partial; not full population |
| Basic web test application | Code exists in branch | Runtime/production readiness not established |
| Canonical distinct investment count | Not yet established | **Critical blocker** |
| Verified fund-profile and commercial product suite | Mubadala pilot exists, broader modules proposed | Not completed |

**The historical 651-count, 467-triage and working dossier files are preserved. No deletions, file relocations or wholesale renaming until the exact transaction count and source-to-event mapping have been independently certified.**

## 6. Execution order and release gates

1. **Complete 651 → unique-event reconciliation first.** Inspect every source record, resolve economic stages, legitimate independent follow-ons, aliases, consortium overlap and non-investment categories. Produce a stable event-ID → raw-ID mapping and separate exclusion/held lists. Certify the exact distinct transaction count, with completed versus committed/signed/announced numbers separately.
2. **Verify each admitted event's claims.** Prioritise primary sources, independent corroboration, date/status, true legal investor and instrument. Retain uncertainty and undisclosed amounts; do not invent historical evidence.
3. **Reconcile all proposal packages and coverage status** against v9.8; preserve founder rulings and the append-only research history.
4. **Only once 1–3 pass:** rebuild/merge source-row dossier material into one dossier per approved distinct economic transaction; review redundancies **before proposing any deletion**.
5. **Then build/revise product surfaces** around unique event IDs, fund/vehicle relationships, rigorous reports, evidence search and comparative analysis; validate data integration and full user journeys.
6. **Pilot with institutional readers**, validate willingness to pay and target user workflows; finalise Decision / Capital Intelligence priorities, distribution and possible subscription scope accordingly.
7. **Founder-controlled release:** independent QA, publish/paid-product approval, verified production deployment and post-release checks. Do not claim decision-grade completeness while source coverage or critical data classification remains unresolved.

## 7. Explicit unresolved decisions and non-claims

- No exact unique deal count is yet certified, and **neither 651 nor 467 is it**.
- The broad world investment universe, historical research and first-party-source standard are agreed; unresolved founder entity/instrument rulings remain open where identified in the research registers.
- The two commercial product lines remain conditional pending willingness-to-pay evidence.
- Neither free journalist access nor paid subscriptions are presently authorised for public launch.
- No deal sourcing, introductions, capital raising/placement, generic PE marketplace or guarantee that a fund will invest.
- Do not assume README test app, Supabase SQL, Vercel configuration or GitHub commits demonstrate running production software.

## Supporting source of truth

- [Project strategy / editorial rules](../CLAUDE.md)
- [Founder rulings and exclusions](../proposals/GSI_Founder_Rulings_2026-11-14.md)
- [v9.8 research status](../database/RECONCILIATION_STATUS_v9.8.md)
- [Distinct-event audit](../database/GSI_ECONOMIC_EVENT_DISTINCTNESS_AUDIT_v9.8.md)
- [Distinct-event pair review](../database/GSI_DISTINCT_EVENT_PAIR_REVIEW_BATCH01_2026-11-16.md)
- [Coverage audit](../database/RECONCILIATION_COVERAGE_STATUS_v9.8.md)
- [Complete work-product inventory](../database/GSI_v9.8_COMPLETE_WORK_PRODUCT_MANIFEST_2026-11-16.md)
- [Mubadala profile pilot](../fund-profiles/GSI_Fund_Profile_Mubadala_PILOT.md)
- [Test application](../app/page.js)

**Maintainer's rule:** A planning summary cannot upgrade an unverified source row into a fact, a future product idea into an authorised release, or a proposed subscription into an approved business model.
