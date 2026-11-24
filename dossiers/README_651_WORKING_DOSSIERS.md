# GSI v9.8 — 651 working dossiers: verified batch index
Date: 2026-11-16

**Authoritative dossier snapshot:** `3ad274ddedf259a6728e541f235a04e0533c6cfe` (651 rows, 67 columns). The original monolithic dossier export predates the four first-party enrichments and should be treated as **superseded** by these seven smaller files. These files contain **source-derived working dossiers**; each entry has not been independently verified or editorially approved.

## Dossier batches

- [Dossiers 1–100](batches/GSI_Dossiers_001_100_v9.8.md)
- [Dossiers 101–200](batches/GSI_Dossiers_101_200_v9.8.md)
- [Dossiers 201–300](batches/GSI_Dossiers_201_300_v9.8.md)
- [Dossiers 301–400](batches/GSI_Dossiers_301_400_v9.8.md)
- [Dossiers 401–500](batches/GSI_Dossiers_401_500_v9.8.md)
- [Dossiers 501–600](batches/GSI_Dossiers_501_600_v9.8.md)
- [Dossiers 601–651](batches/GSI_Dossiers_601_651_v9.8.md)

## QA
- Seven batches independently fetched and verified: **100 + 100 + 100 + 100 + 100 + 100 + 51 = 651** dossier sections.
- Master: **651 unique IDs**. Crosswalk: **651 unique IDs**, exact same set.
- Ledger: **371 unique IDs**. Syndicate map: **206** records, **0** orphaned linked IDs.
- First-party case-level evidence upgraded for `V1.5_HOLDS-007`, `GSI25M07-011`, `GSI25M08-001` and `GSI25M10-001` in the master without changing inclusion decisions or transaction status.
- [Refreshed evidence-gap QA table](GSI_651_Dossier_Evidence_QA_v9.8.csv) is bound to this exact master SHA.

## Outstanding evidence gaps (field-presence diagnostics; not a URL-content audit)

| Field not adequately recorded | Dossiers |
|---|---:|
| Primary-source URL | 95 |
| Independent-source URL | 172 |
| Claim-specific evidence URL | 261 |
| Verified-claim scope | 248 |
| Outstanding-material-claims statement | 245 |
| Capital-deployment evidence field | 313 |

There are no invented investor-specific cash tickets. Missing amounts are **unknown**, not zero; consortium values and total fund commitments are not investor-specific deployed cash. Founder scope / eligibility decisions remain outstanding where marked. Historical coverage is incomplete; no claims of comprehensive 1950–2026 deal capture or 651 completed equity investments.

## Evidence-updated records
1. **Mubadala / Stonepeak / Textainer–Seaco:** Mubadala 5 May 2026 first-party announcement of **US$300m announced co-investment**; geography and funded settlement unresolved. https://www.mubadala.com/en/news/mubadala-partners-with-stonepeak-to-invest-in-container-leasing-platforms-supporting-global-trade
2. **FFO / Templewater:** Templewater 9 July 2025 first-party statement of **US$100m FFO fund commitment** matched by US$100m Templewater. Oman-centred domestic mandate, not outbound deployed portfolio equity. https://www.templewater.com/news/templewater-and-future-fund-oman-launch-the-sultanates-first-energy-transition-fund
3. **Lunate / Brevan Howard:** 26 August 2025 first-party release confirms proposed minority holding and **US$2bn platform commitment**, but sovereign owner and stake price unresolved. https://lunate.com/en/news-insights/announcements/brevan-howard-and-lunate-announce-long-term-strategic-partnership
4. **MGX / Aligned:** 21 July 2026 first-party closing notice confirms consortium acquisition, **US$40bn enterprise value** and **US$5bn consortium growth commitment**, not MGX-specific cash. https://www.mgx.ae/news-insights/aip-mgx-and-blackrocks-gip-close-acquisition-aligned-data-centers

**Release gate:** Remains open. PR #1 stays draft; no Supabase or main-branch changes, no external publication, no authorisation of proposed sovereign classification from this evidence audit alone.
