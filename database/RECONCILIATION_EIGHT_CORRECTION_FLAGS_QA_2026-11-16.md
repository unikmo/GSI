# GSI v9.8 — eight correction-flag crosswalk QA (2026-11-16)

Scope: existing GitHub reconciliation matrices and canonical tables only. This is an **internal source-to-record mapping**, not primary-source certification. No new market research.

Read the current status, source inventory, audit index, founder leads, candidate dispositions, coverage status, and current master/ledger before performing this check. Current documented canonical sizes are 651 master / 371 ledger / 206 syndicate / 651 crosswalk, superseding the original 616 baseline.

| Candidate | Proposed correction | Canonical cross-check | Disposition / outstanding evidence |
|---|---|---|---|
| R01 (historical) | PIF POSCO E&C reported Feb 2015 vs June | Master and ledger `GSI15M06-001` exist, June 15 SPA and October closing stated | **EXISTING_EVENT; DATE_DISPUTE HOLD**. February preliminary press not proof of binding SPA or new deal; retain June until primary issuer evidence |
| S01 | Mumtalakat/Fajr/Blackstone GEMS dated 2014 not 2015 | Master/ledger `GSI14M10-001` already present, 15 Oct 2014 announcement | **EXISTING_EVENT LINK**. No new row; issuer evidence/consortium roles still require claim QA |
| W01 | QIA/BRF Banvit Dec 2016 vs Jan 2017 SPA | Master/ledger `GSI16M12-001` present; canonical notes Dec SPA / Jan announcement | **EXISTING_EVENT; STAGE/DATE HOLD**. Need original SPA/disclosure before redating; no double count |
| Y04 | Mubadala Hyperoptic 2018 vs 2017 | Master/ledger `GSI18M11-001` present | **EXISTING_EVENT LINK**; no 2017 addition. November 7/8 reporting difference unresolved |
| B03 | PIF ACWA 15.2% July 2018 vs June | Domestic/ledger-only per founder source classification | **DATE/SCOPE HOLD**. Do not add outbound master row or infer cash; check issuer source |
| B05 | Mubadala Hyperoptic 2018 | Master/ledger `GSI18M11-001` already present | **EXISTING_EVENT LINK**, same economic event as Y04, not a second transaction |
| E01 | Mubadala Investcorp 20% July 2016 vs 2019 | Master/ledger `GSI16M07-001` present, July 28 2016; 9.99% initial / remainder regulatory stage | **EXISTING_EVENT LINK**. Do not create a 2019 acquisition or treat entire stake as one completed July cash flow |
| R06 (Apr 2026 package) | OIA Escribano 32.2% repurchase allegedly Mar 2026 | Master `GSI22F02-004` records 2022 exit; ledger `GSI26M03-006` records **unconfirmed** 2026 page date | **POTENTIAL SAME-EVENT CHRONOLOGY DUPLICATE — HOLD**. Source chronology unresolved; ledger row must not be counted as separate 2026 exit without primary dated evidence |

QA counts: **8/8 correction flags reviewed**; **6 have directly identified master/ledger event IDs** (R01, S01, W01, Y04, B05, E01), with Y04/B05 sharing one canonical ID; **1 domestic date/scope hold** (B03); **1 cross-table potential duplicate** (R06, master 2022 vs ledger 2026). **5 distinct canonical master IDs linked for those six flags**. These are analyst cross-references, **not new primary-source-verified links**. Zero new canonical records, zero source-proven exclusions, zero claimed investor-specific amounts, zero chronology overwrites. Preserve founder rulings and existing candidate matrix until source-level evidence justifies edits.

The 10 direct evidence-blocked cases from the preceding ten-hold QA remain held. The historical coverage matrix remains incomplete and all 66 audit reports uncertified. No canonical-table edits, no PR merge, no publication, no Supabase, no paid services.
