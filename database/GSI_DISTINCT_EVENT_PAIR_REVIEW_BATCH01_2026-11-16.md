# GSI distinct-event reconciliation — source-checked batch 01
Date: 2026-11-16
Scope: original 651-row master SHA `3ad274ddedf259a6728e541f235a04e0533c6cfe`.
**CONTROL:** Preserve every raw row and dossier file until the complete distinct transaction count has been established and independently QA-reviewed. No deletions, archival relabelling, or publication from this checkpoint. The preliminary 467 figure is NOT unique. This note is a case review, not a completed 651-case certification.

## Source-supported same-event groups (one economic event represented by multiple source rows)
| Canonical event anchor (proposed) | Other raw record | Decision | Reason | Evidence |
|---|---|---|---|---|
| `GSI90M02-099` | `GSI90M02-001` | ONE_EVENT_SOURCE_SUPPORTED | Both describe KIO February 1990 Grupo Torras takeover from 39.7% to 72.9%, following December 1989 bid; do not count twice | https://archives.mees.com/issues/1115/articles/39986 |
| `GSI-2020-03-002` | `GSI-2020-OCT-006` | ONE_EVENT_SOURCE_SUPPORTED | March 2020 Mubadala-to-OMV Borealis 39% agreement and 29 October 2020 completion of the **same divestment** (not outbound new investment) | https://www.mubadala.com/en/news/39-share-purchase-mubadala-omv-acquire-majority-stake-borealis-us468-billion-largest ; https://www.omv.com/en/media/press-releases/2020/201029-omv-and-mubadala-complete-borealis-transaction |
| `GSI-2021-MAR-005` | `GSI-2021-APR-003` | ONE_EVENT_SOURCE_SUPPORTED | ADES take-private March offer and April unconditional acceptance; Innovative Energy co-owned by PIF, ADES and Zamil, not two purchases | https://www.pif.gov.sa/en/news-and-insights/press-releases/2021/ades-international-holding/ |
| `GSI-2020-AUG-003` | `GSI-2020-NOV-004` | ONE_EVENT_SOURCE_SUPPORTED | Envision Pharma acquisition process, August notification / 5 Nov announcement / 10 Nov company-controlled-close evidence; single GHO-led consortium acquisition involving Mubadala | https://www.mubadala.com/en/news/gho-capital-and-management-acquire-ardian-majority-stake ; https://ghocapital.com/updates/gho-capital-and-management-acquire-ardian-majority-stake-in-envision-pharma-group-to-accelerate-continued-growth/ |
| `V1.6_CANDIDATES-008` | `GSI26M06-010` | SAME_ANNOUNCEMENT_PENDING_STAGE_QA | Same 22 June 2026 Pierre & Vacances business combination/tender offer; closure not established and must never be counted twice. Need review of subsequent 20 July stage. | Current master record chronology; primary offer evidence still to check |
| `GSI-2020-SEP-014` | `GSI-2020-DEC-003` | SAME_PROJECT_CLAIM_PENDING_STAGE_QA | Nur Navoi project September financing-close claim superseded by 23 December financial-close date, not two independent financing closes | Current master source notes; confirm borrower, lender and project financing first-party |
| `V1.6_CANDIDATES-007` | `GSI26M05-004` | SAME_ANNOUNCEMENT_PENDING_ECONOMIC_QA | Both 12 May 2026 Hornsea 3 investment announcement; same underlying project/tranche must be checked before merging | Current master chronology; obtain investor-specific original transaction releases |

## Distinct events that MUST NOT be merged simply for matching target names
- `GSI23F02-006` vs `GSI24F02-004`: Truist Insurance first consortium stake vs subsequent remaining stake — potentially **two different economic purchases**, check completion and buyer structure.
- `GSI-2020-03-001` vs `GSI21J06-005`: Waymo March 2020 and June 2021 separate financings.
- `GSI-2020-AUG-002` vs `GSI25M07-005`: PCI Pharma 2020 purchase vs 2025 reinvestment.
- `GSI24A08-002` vs `GSI26M04-001`: Lucid 2024 Series B vs 2026 Series C — distinct capital rounds, not duplicates.
- `GSI23M06-004` vs `GSI25M12-099`: Monumental Sports initial 2023 stake vs disclosed 2025 increase.
- `GSI08M01-001` vs `GSI08M01-002`: Citigroup and Merrill Lynch are distinct targets even though jointly referenced in a single announcement.

## Process check
- Starting source records: **651**.
- Already cross-linked explicit duplicate/disclosure rows in triage: **4** (preserved).
- This pass identifies **four additional source-supported same-event pairs** and **three additional likely same-event review pairs**; some are sales or non-core.
- These are pair-level findings, **not seven deductions from the final distinct outbound investment total**. Do not subtract non-core pairs blindly or mix signed/closed events.
- **Exact final count remains unverified.** Additional alias, participant and transaction-stage checks are necessary across the complete 651 master, not merely the provisional 467 candidate subset.

Next required action: record one economic_event_id per proven economic event, map source IDs, keep signed/closed stages, separately classify outbound completed / outbound announced / domestic / non-equity / divestment / not-a-transaction / unresolved. Finish full cross-record and primary-source QA, then compute exact distinct transaction count. **Only then review dossier redundancy and obtain approval for deletions.**
