# Founder bilateral-platform economic-match QA — 2026-11-20

Scope: existing GitHub evidence only; no external market research. Read latest RECONCILIATION_STATUS_v9.8.md, source inventory, audit index, founder register, candidate disposition, coverage status, master, ledger, and original founder source package before this review. Current status file records 651 master / 371 ledger / 206 syndicate / 651 crosswalk; no canonical table was modified in this pass.

| Founder source lead | Existing suggested record / related lead | Evidence and identity check | Disposition | Missing evidence |
|---|---|---|---|---|
| S04 — SGRF Oman Qatar Investment Company, claimed 2007, OMR 250m | Automated suggestion GSI26B02-006 | **Reject suggested match.** GSI26B02-006 is QIA's August 2026 Lesha Qatar Equity Fund seed subscription in Qatar; different investor, vehicle, date (19 years apart) and event. A textual Qatar/fund similarity is not economic identity. | Retain PARKED_HISTORICAL_UNVERIFIED; do not create canonical link or infer SGRF deployment | Original bilateral-platform formation agreement, ownership, funding drawdowns and recipient geography |
| S05 — SGRF Vietnam Oman Investment with SCIC, claimed 2008, USD 75m plus later USD 125m | No canonical match in founder register | Claimed initial and later capital must be separated by dates/stages; neither headline may be attributed to SGRF without ownership and drawdown evidence. Original founder source supplies no URL. | Retain PARKED_HISTORICAL_UNVERIFIED; no admission | Founding agreement, subsequent capitalization dates, investor-specific contributions and proof of actual deployment |
| S09 — SGRF Oman Brunei Investment Company, claimed 2009, USD 100m | Founder lead Q06, claimed 2019 capitalization from USD 100m to USD 200m | **Link leads conceptually as same named bilateral platform, not as the same transaction.** S09 refers to establishment/initial capital; Q06 refers to claimed later capital increase. Neither has original URL. Q06's automated suggestion GSI25M07-011 is a different FFO/Templewater Energy Transition Fund, not this platform. | Keep S09 parked and Q06 held; no canonical link, no new row, no inferred SGRF share | Primary formation/capital-increase evidence, actual payment dates, ownership percentages and recipient-country allocation |

QA rules applied: distinct investing entity, target legal vehicle, claimed chronology, event stage, capital flow, headline vs investor-specific amounts, and source provenance. No source-proven exclusions were made: false *matches* do not prove founder events nonexistent. The founder dispositions and founder rulings are preserved unchanged.

## Readback / outcome

- 4 source lead rows inspected (S04, S05, S09, Q06); 2 false suggested canonical matches rejected analytically (S04 and Q06); 1 cross-lead platform relationship identified (S09↔Q06), **not** a new verified transaction link.
- 0 new verified canonical links; 0 source-proven exclusions; 4 founder leads remain held/parked; 0 canonical master/ledger/syndicate/crosswalk writes.
- Original founder package `proposals/GSI_1979_2010_Founder_Leads_UNVERIFIED.csv` checked for S04/S05/S09: all cite founder note without source URL.
- Targeted master/ledger readback confirmed GSI26B02-006 and GSI26M08-004 refer to QIA/Lesha in 2026, not Oman Qatar Investment Company. The Q06 suggested GSI25M07-011 is textually a different named platform.
- No full-table structural tests run: canonical tables were not changed. Historical coverage remains uncertified; do not treat the 1.89 MB merged coverage file as additional independent coverage.
- PR #1 remains draft; no main merge, publishing, Supabase, or paid services.
