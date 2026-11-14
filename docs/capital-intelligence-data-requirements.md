# Capital Intelligence — C-suite evidence requirements (internal draft v1)

**Status:** Data contract and verification gate, not a live intake form, database migration or public capability. Private only. Applies to the separate Capital Intelligence product; **do not edit the locked GSI v4.9 master schema**.

## Decision to support

Determine whether a company's requested funding **may align** with a named Gulf sovereign investor *vehicle*; evaluate credible financing routes and material disqualifiers; identify what management must validate before approaching capital providers. The report must be actionable even when its conclusion is **no defensible fit**. The engine must never imply access, investor interest, investment advice, or probability of funding.

## 1. Company input — evidence required before any C-suite recommendation

| Group | Minimum dataset | Analytical purpose |
|---|---|---|
| Identity / operating footprint | Legal company, stable ID, headquarters, operating countries, target markets, sector/subsector, business model, stage | Actual economic exposures, not just domicile |
| Transaction intent | Amount and currency, minority/control/JV/debt etc., use of proceeds, project vs corporate, transaction type, timeline, expected equity dilution/control and potential exit path | Financing feasibility and route selection |
| Historical & current financials | Revenue (annual & latest), growth and periods, EBITDA and margin (negative permitted), operating income, net income, free cash flow, cash burn/runway, net debt, cash and liquidity, capex, leverage, valuation and basis | Financial maturity, capital structure, risk and ticket plausibility |
| Ownership / governance | Ownership categories, cap table/shareholders and percentages when available, beneficial ownership verification status, existing investors, shareholder consent rights, governance constraints, change-of-control rights | Investability, influence, exit/approval obstacles |
| Strategy / commercial | Markets, customers and concentration, pipeline, order backlog/ARR or contractual revenue where relevant, unit economics, revenue quality, strategic partnerships, moat and deployment plan | Strategic rationale and sustainable returns |
| Risk / eligibility | Sanctions and jurisdiction review status, regulatory/licensing, foreign ownership restrictions, debt covenants, litigation, ESG/sustainability materiality, reputational or political constraints, country risk | Hard exclusions before ranking |
| Documentation | Reporting period, currency, accounting basis, audited/reviewed/management status, source/date for each figure, confidentiality classification | No unsupported financial or legal claims |
| Opportunity-specific metrics | Infrastructure: contracted revenue, utilisation, project IRR/capex; early stage: burn/runway, ARR, cohort/unit economics; real estate: NOI, occupancy, LTV; financials: AUM/capital ratios | Avoid imposing EBITDA on pre-revenue/project-finance opportunities |

**Technical minimum vs analyst minimum:** A schema-valid intake is **not** a CFO-ready recommendation. All key metrics must be answered with a value **or an explicit disclosure state** (reported/estimated/not disclosed/not applicable/not available). Missing facts trigger a **conditional or blocked** outcome. For recommendations require an analyst to verify appropriate current mandate, investment vehicle, financing instrument, jurisdiction, valuation basis, real transaction precedents, investor-specific investment amounts, key risks and evidence quality.

## 2. Historical investee snapshot — at announcement

For each applicable transaction, capture `master_record_id`, actual investing vehicle, investee identity, event family, announced date, pre-announcement as-of date, contemporaneously **publicly available** source publication date, financial period and accounting basis. Record revenue, growth, EBITDA/margin, profitability, valuation, leverage, ownership/cap table, previous investors, operating and target markets, deal instrument, economic stake and disclosed investor-specific ticket; separate company financials from headline transaction value.

- **Temporal firewall:** data known *after* an announcement may be used as hindsight analysis only; never present it as known to the investor at announcement.
- **Source certainty:** an investee's audited statements are not necessarily proof the sovereign fund used them; say “publicly evidenced as of date”, not “investment committee considered”.
- **Event type:** not every one of the existing master rows is an equity entry; fund subscriptions, debt, partnerships and policy announcements need differentiated profiles.
- **Disclosure gaps:** private-company EBITDA and cap tables frequently unavailable. Do not invent; store explicit missingness.
- **Auditability:** source URL/title, publisher, effective date, source publication date, retrieval date, original currency, conversion method, estimate method, analyst approval, correction history and source ID.

## 3. C-suite output gates

1. Executive judgement and conditionality (fit / investigation / no defensible route).
2. Top 3–5 **vehicle-level** financing routes; no public-investor “matches” without substantiation.
3. Deal comparables shown at the time of announcement: range, median, *sample size*, selection logic, disclosure coverage and outliers.
4. Investor vehicle, instrument, investment amount vs headline deal size, ownership patterns, current publicly evidenced mandate and verification freshness.
5. Company financial compatibility including margins, growth, ownership and valuation; state all incompatible/inconclusive criteria.
6. Risks and vetoes: sector, regulatory, country, sanctions, governance, leverage and ticket size.
7. Actionable management checklist: missing documents, gating decisions, questions for potential capital partners.
8. Evidence appendix: citations, as-of dates, contradictory signals, source reliability, analyst sign-off.

**Never equate closeness to historical median with propensity to invest.** If comparables are sparse, the report must say so rather than manufacture a score. Any numerical criteria coverage is internal triage, not a probability.

## 4. Security and boundaries

- Proprietary financials and cap tables require a private application, authenticated least-privilege access, encrypted storage, retention/deletion policy, and audit logs before collecting real company data.
- The proposed `gsi_fit_private` migration is **not applied**; there is no live collection interface.
- All historical data stays `UNREVIEWED` until research QA. No export or public output without founder approval.
