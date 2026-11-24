# GSI founder-source cross-check: GEMS and PRO Unlimited (2026-11-23)

Scope: Existing GitHub evidence only. No external market research. This is row-level reconciliation QA, **not** certification of original claims.

## Original source rows and canonical checks

| Founder lead | Original source | Claimed event/date | Existing canonical record | Evidence and economic-event determination | Disposition |
|---|---|---|---|---|---|
| P17 | `proposals/GSI_2015_2018_Founder_Leads_UNVERIFIED.csv` | Mumtalakat / Blackstone / Fajr GEMS consortium, October **2015** | `GSI14M10-001` (master and ledger) | Same named consortium and target as founder R10. Canonical record dates **15 October 2014** announcement, with issuer Blackstone release URL *listed but not opened* in canonical evidence. No evidence here for an additional 2015 investment or closing. UAE target and consortium role require intra-Gulf classification review. | **Existing-event candidate cross-reference, chronology conflict; do not import a second record or overwrite founder date without source review.** |
| R10 | `proposals/GSI_2010_2014_Founder_Leads_UNVERIFIED.csv` | Same GEMS consortium, October 2014 | `GSI14M10-001` | Earlier founder lead already points to the same canonical transaction. Canonical notes explicitly address R10. | **Previously identified link; no new deal.** |
| P33 | `proposals/GSI_2015_2018_Founder_Leads_UNVERIFIED.csv` | Mumtalakat / PRO Unlimited stake, **2017** | `GSI14M10-098` (master and ledger) | Canonical record describes **16 October 2014 acquisition** with Investcorp, and notes a **2017 partial exit**. Existing Mumtalakat issuer URL is retained in canonical record. P33's 2017 stake wording may concern retention or partial divestment, **not proof of another 2017 purchase**. | **Stage-related existing-event cross-reference only; 2017 action requires original-source confirmation and, if eligible, ledger-only divestment treatment.** |
| R11 | `proposals/GSI_2010_2014_Founder_Leads_UNVERIFIED.csv` | Mumtalakat / PRO Unlimited with Investcorp, October 2014 | `GSI14M10-098` | Already documented in prior founder QA; canonical investor-specific amount remains undisclosed. | **Previously identified link; no new deal.** |

## Claim-specific safeguards

- **Dates:** 2014 GEMS announcement must not be silently replaced by founder P17's 2015 date; acquisition/closing not established from the reviewed text. PRO Unlimited 2014 purchase and possible 2017 partial exit are different transaction stages, not interchangeable purchase dates.
- **Amounts:** No investor-specific GEMS or PRO Unlimited cheque is evidenced in these reviewed rows. A later GEMS consortium valuation must not be attributed to Mumtalakat; no deal valuation is treated as PRO Unlimited investor cash.
- **Roles and flows:** GEMS: Mumtalakat alongside Blackstone/Fajr, UAE target, intra-Gulf question remains. PRO Unlimited: Mumtalakat alongside Investcorp, US target, outbound purchase; a 2017 divestment would be opposite flow and ledger-only under founder ruling.
- **Original evidence:** GEMS Blackstone issuer URL is only **listed, not opened** in canonical master; PRO Unlimited Mumtalakat URL is recorded in canonical source field and prior QA. This pass inspected existing source text, not external pages.
- **Preservation:** No edits to founder rulings, founder register, 389-lead matrix, canonical master, ledger, syndicate map or crosswalk.

## Per-row QA and outcome

Four original founder rows examined; two additional *analytical* cross-references (P17, P33) to already existing canonical IDs; two previously documented links (R10, R11); **zero new independently verified links**, zero source-proven exclusions, zero admitted master/ledger transactions. P17 chronology and P33 stage/flow remain held. Existing canonical IDs read back in master and ledger; targeted existence check passed. Full structural QA not rerun because no canonical data changed. All historical coverage audits remain uncertified. PR #1 must remain draft.

Sources (repository only): `proposals/GSI_2010_2014_Founder_Leads_UNVERIFIED.csv`; `proposals/GSI_2015_2018_Founder_Leads_UNVERIFIED.csv`; `database/RECONCILIATION_FOUNDER_LEADS_v9.8.csv`; `database/GSI_Global_Research_Master_v9.8_WORKING.csv`; `database/GSI_Research_Ledger_v9.8_WORKING.csv`; `database/RECONCILIATION_STATUS_v9.8.md`.

No publication, Supabase operations, paid research or main merge.
