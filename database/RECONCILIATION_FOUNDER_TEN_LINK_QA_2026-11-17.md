# Founder-lead economic-event matching QA — 2026-11-17

Scope: existing GitHub branch source files only. No new external research, no Supabase, no canonical table edits. This is **source-to-canonical linkage QA**, not investment certification. Baseline read first: `RECONCILIATION_STATUS_v9.8.md`, source inventory, audit index, founder leads, candidate dispositions, and coverage status.

## Row-level findings

| Founder lead | Claimed event | Existing canonical record | QA outcome | Unresolved issue |
|---|---|---|---|---|
| R11 | Mumtalakat / PRO Unlimited, 2014-10-30 | `GSI14M10-098` | **Strong existing-event link**, distinct from misleading suggested `GSI16M07-001` (Mubadala/Investcorp). | Founder date 30 Oct vs canonical acquired 16 Oct; reconcile event stage before editing source lead. |
| P16 | Mumtalakat / Nobel Learning, 2015 | `GSI15M03-099` | **Strong existing-event link**, not suggested `GSI21J07-013`. | Canonical agreement 30 March and subsequent 22 April acquisition date; no individual ticket. |
| L07 | MGX / Silver Lake / Altera, 2025 | `GSI25M09-008` | **Strong existing-event link**; suggested `GSI-2020-SEP-002` is chronologically implausible. | Agreement 14 April, closing 12 September, announcement 15–16 September; 51% buyer-group stake is not MGX-specific. |
| M07 | MGX / OpenAI financing, 2026 | `GSI26M03-099` | **Target and investor match; chronology hold**. | Founder lead says May 2026, canonical issuer-confirmed March 31; $122bn is total round, not MGX allocation. |
| V01 | PIF / Uber, 2016 | `GSI16M06-001` | **Strong existing-event link**; suggested canonical ID is correct. | Existing source quality provisional; avoid upgrading to certified from this crosswalk alone. |
| V05 | PIF / Lucid, 2018 | `GSI18M09-001` | **Strong existing-event link**; suggested ID is correct. | PIF amount is stated as more than $1bn, a lower bound not an exact point amount. |
| P09 | SGRF / Escribano, 2016 | `GSI22F02-004` | **Not same stage**: canonical row is a 2022 exit; founder lead is a claimed 2016 acquisition. | Do not collapse acquisition into divestment or infer that 2016 acquisition is separately verified. |
| R09 | Mumtalakat / McLaren, 2013 | `GSI21J07-002` | **False suggested match**: canonical row is PIF's 2021 preference-equity commitment, not Mumtalakat's 2013 stake increase. | 2013 investment requires distinct evidence and economic-event search. |
| R10 | Mumtalakat / GEMS, October 2014 | `GSI14M10-001` | **Existing-event link**, correct institution/target/year. | Verify founder consortium role and precise date before source certification. |
| P17 | Mumtalakat / GEMS, October 2015 | `GSI14M10-001` | **Potential same deal, year conflict**; do not duplicate. | 2015 founder date conflicts with canonical 2014 announcement. |

## Control totals

- Ten founder-lead rows examined against actual canonical row descriptions.
- Six strong existing-event links (R11, P16, L07, V01, V05, R10); one target/investor match with date conflict (M07); one possible repeated deal with year conflict (P17); two false/unsafe suggested matches (P09, R09).
- **No new canonical transaction, no new deployed-capital attribution, no source-proven exclusion.**
- Four particularly actionable existing-event links for future founder matrix corrections: R11→GSI14M10-098, P16→GSI15M03-099, L07→GSI25M09-008, M07→GSI26M03-099 (last requires chronology resolution). These are QA proposals, **not yet edits to the founder register**.
- Original founder rulings, 340-file source inventory, 66 uncertified audits and 8,580 coverage status rows remain unchanged. The merged historical coverage source must not be counted again.
- The prior ten directly evidence-blocked candidate cases remain held; no evidence is supplied here to clear them.

## Tests and release gate

Readback of ten canonical record IDs and their fund/target/stage/amount caveats: **PASS**. Semantic chronology consistency: **FAIL/HOLD** for M07, P09, R09, P17. Structural schema and ID uniqueness were **not rerun** because no canonical files changed. Draft PR #1 remains unmerged and historical coverage uncertified.
