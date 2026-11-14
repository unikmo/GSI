# GSI research operations — evidence and time-series methodology v0.1

Status: INTERNAL RESEARCH / UNREVIEWED. No sources or figures are certified. Start with Gulf sovereign investors; add Gulf private-fund layer only after sovereign fund coverage is coherent. Do not promote research observations into certified decision-grade evidence.

## 1. Source hierarchy and collection cadence
Official investor websites, annual reports, filings and entity documents first: Mubadala and Mubadala Capital (including their distinct vehicles), PIF and subsidiaries, ADIA, ADQ, QIA, KIA, OIA. Then investee company investor relations, securities filings, regulator notices, company registries, government filings, and independently reported transaction records. Keep source publication date, event effective date, financial as-of date, retrieval date, source class and exact original wording. A press release is **evidence that a claim was made**, not necessarily independent evidence that funds were paid or deals closed. Record issuer-disclosed audited, unaudited and operational KPIs separately.

Monitor new official releases as ANNOUNCEMENT_CLAIM until counterparties or filings corroborate economic substance. Distinguish announced, signed, committed, regulatory approval, completed, funded/deployed, disposed and non-binding. Re-check later corrections.

## 2. Quantitative historical investee dataset

Capture all available point-in-time series **before or on** the announcement: company scale (revenue, revenue CAGR, ARR vs accounting revenue, EBITDA unadjusted and adjusted, EBITDA margin, EBIT, profit, gross margins, cash flow), balance sheet (net debt, leverage, liquidity, capex), valuation (equity and enterprise, currency, pre/post-money), ownership (cap table where available, existing investors, control, rollover, stake), strategic data (business model, markets, concentration, major clients, order book, asset base, footprint, sector-specific units) and deal terms (specific ticket vs whole round, instrument, co-investor shares, entry multiples if calculated, security seniority).

Data must be **stated, estimated with method, unavailable, or not applicable**. Capture confidence and disclosure coverage. Avoid false comparison of fund AuM, investee total assets, invested ticket and financing-round totals. Never mix period/Q3 EBITDA with annual EBITDA or financial statement revenue with ARR.

## 3. Evolutionary fund profiles
For each fund and vehicle produce a *historical timeline*, not only a current snapshot:
- Origin, statutory mandate, funding mechanism and governance changes (what changed, when, documentary basis)
- Investment vehicle map, subsidiaries, joint ventures, management structures, direct-vs-fund-vs-debt exposure
- Domestic vs foreign allocation, strategic sectors, geographies, ticket distribution, ownership/control preferences, development vs financial mandate
- Annual capital **committed**, deployed, realised and returned, assets under management where disclosed, portfolio change, risk and performance metrics (basis and comparability)
- Partnerships, repeat co-investors and investor-company repeat relationships, exit outcomes and changes in stated strategy
- Quantitative portfolio exposure evolution, including coverage denominator, sample bias, undisclosed percentages and statistical reliability.
- Splits by year, sector, geography, vehicle, stage, instrument, ownership stake, profitability, leverage, currency, ticket size, deal status, co-investor and evidence grade.

The first 445-record research baseline is not comprehensive. Display sample size and coverage bias alongside every distribution; no 'zero deals' where the research month is not systematically screened.

## 4. Outreach questions (prepare for founder review; no messages sent)

Request correction of factual particulars, not privileged deal flow. Ask Investor Relations / research contacts:
1. Can you confirm the investing legal vehicle and whether the named parent fund deployed balance-sheet capital or managed third-party capital?
2. Is the announced amount total round/enterprise value, or specifically the fund's commitment? Does the announcement refer to signed, funded or closed capital?
3. Is the investment mandate public and current? Which sectors, regions, transaction types and typical ticket bands are publicly confirmable, and which cannot be shared?
4. Are public annual reports, independently audited financial statements, transaction documents, or retrospective investment case studies available?
5. Can you confirm ownership/control, repeat-investor roles, investment date, exit or follow-on history from published records?
6. Are there approved channels for clarification/correction of public database research, and may we quote responses with attribution?
7. Are there public disclosures that better distinguish subsidiary investing entities, joint ventures and parent-group positions?

No request for confidential investor pipeline, privileged valuations or protected investee cap tables. Responses must have dates, names, attribution permissions and evidence-state labels; fund self-report remains self-report until corroborated.

## 5. Pilot results already researched

See `research/investee_snapshots/mubadala_pilot_2026-11-14.json` for CI Financial (2024 announcement) and Moove (2026 announcement): source-linked financial/operational measurements, equity/enterprise value separation, management ownership facts, later completion separated and gaps. These are **two partial snapshots**, not a completed 20-company pilot. No database import yet.

## 6. Research intake gates

- Exact master ID + source version + investing legal vehicle where known
- Event eligibility classification: operating-company investee, fund, partnership, debt, policy, disposal, intragroup (not all need EBITDA)
- Primary-source period, release date, data availability at deal time and amount scope
- Financial metric basis (GAAP/IFRS/non-IFRS, quarterly/annual/run-rate, currency and units) and input state
- Investor-specific capital vs headline transaction valuation
- Quantitative comparables with coverage rates and exclusion reasons
- Contrary evidence and outstanding claims
- Manual QA and separate approval for customer-facing recommendation

## 7. Operational status

Watch task runs separately as a daily condition check for material releases. Existing historical month-by-month research task remains untouched. Automated web monitoring and systematic investee historical enrichment are different workstreams; neither is deemed complete.
