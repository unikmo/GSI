# GSI — divestments, strategy evolution and macro-political context

**Status:** Private research model, not yet deployed. Do not infer political motives, fund intentions, causal explanations, or investment returns without dated evidence. Continue sovereign Gulf-first coverage; private Gulf fund coverage is a separate future cohort.

## Core research questions
1. Did the vehicle invest, follow on, reduce a stake, exit, realise a return, or only announce a proposed transaction? At what legally or financially evidenced stage?
2. What was its **contemporaneously published** strategy at that point? What had changed relative to the preceding mandate or annual report?
3. How did the observed deal or exit compare with disclosed sector, geography, risk/return, ownership, duration and instrument priorities?
4. What macroeconomic or political conditions were observable at the decision date, including interest rates, credit conditions, FX, oil prices, public finances, sector cycles, sanctions, regulation, geopolitics, market valuations and domestic policy?
5. Do documents **directly link** such conditions to the transaction? If not, record possible influences as hypotheses, not explanations.
6. What happened after entry—follow-ons, write-downs, IPOs, private sales, transfers, returns? Distinguish realised proceeds from headline enterprise values and allocations.
7. If an apparent strategy departure cannot be explained using public evidence, create a **precise, internal** question for fund investor relations and seek confirmation before attributing motive.

## Data capture structure
- `fund_strategy_versions`: original language, source and dates of mandates. A published strategy is not proof it was implemented.
- `strategy_change_events`: what changed and why **according to sources**, with alternative explanations distinct.
- `macro_political_observations`: dated statistics and events, original units, source, known-by date, review level.
- `transaction_lifecycle_events`: entry, follow-on, partial/full exit, IPO sell-down, secondary sale, write-down, recapitalisation; capital paid, proceeds, stake before/after, return metrics **only when substantiated**.
- `transaction_strategy_assessments`: observed consistency with the strategy applicable **as of the deal date**, contrary evidence, macro observations, analyst hypotheses and explicit uncertainty.
- `fund_clarification_questions`: source-specific questions; no outreach sent without authorised review.

## Rules
- No inference of policy/political motivation from coincidence in time. Political or macro developments are **context**, not automatic cause.
- Annual-report strategy published **after** the transaction cannot be presented as known at the transaction date. Retrospective statements may inform later interpretation with that limitation explicitly marked.
- A fund moving capital into a new sector may reflect portfolio diversification, a subsidiary's own mandate, market conditions, financing constraints, changing policy, or incomplete research. Examine alternatives.
- **Divestment ≠ loss, exit ≠ completed cash settlement**. Use a precise lifecycle state and distinguish gross sale price, investor-specific proceeds, cost basis, realised gain, IRR and MOIC; do not derive IRR from incomplete cash flows.
- A strategy 'fit' should describe **consistency of observed action with dated statements**, not rate a political institution, infer intent, or imply that a fund should have invested.
- Every time-series chart must state coverage, denominator, inclusion rules, source gaps and unreviewed status; absence of evidence is not absence of events.
- Private fund outreach requests public factual clarification, not confidential pipelines or politically sensitive nonpublic information.
- Public website, user-facing reports and decision-grade labels remain unchanged pending QA and founder release approval.

## Sequencing
1. Apply the new private schema only after database access/backups and RLS verification; migration depends on `capital_intelligence_snapshots_private.sql`.
2. Pilot with two or more historical **exit and entry pairs**, alongside original dated strategy documents and macro series; verify each fact from contemporaneous sources.
3. Roll out one source-backed fund evolution timeline at a time (Mubadala first, then PIF, ADIA, ADQ, QIA, KIA, OIA).
4. Where a fund's stated mandate and observed behaviour diverge, record the gap and draft precise clarification questions. No invented causal attribution.
5. Add private Gulf fund profiles as a separate investor class after the sovereign vehicle map and evaluation methods are stable.

**Existing automation:** the sovereign announcements watch tracks new releases; the historical research automation works backward through uncovered periods. Neither can substitute for the manual source/evidence review required for strategy, political context or returns.
