# GSI — Individual primary-evidence verification, historical holds (batch 02)
**Research date:** 16 November 2026. **Scope:** six existing held leads; case-level source verification, NOT six approved new canonical investments. The v9.8 master and founder classification rules remain authoritative. Original hold file: `database/RECONCILIATION_200_HELD_CASES_v9.8.csv`.

## GSI-HOLD-063 — Qatar Holding / EDP
**Outcome: PRIMARY_SOURCE_SUPPORTED_TRANSACTION, CANONICAL_ADMISSION_NOT_YET_REVIEWED.**
EDP's original 25 August 2011 notification identifies **Qatar Holding LLC**, wholly owned by **QIA**, holding **73,800,000 EDP shares (2.018%)** after an off-exchange purchase of 1,800,000 shares on 18 August, **settled 23 August 2011**. These are *total shares held* versus *incremental shares purchased*, not 73.8m shares bought on 18 August. Settlement of the incremental tranche is confirmed, but the investor-specific cash price and dates of prior purchases are not.
- First-party EDP: https://edp.com/en/investors/investor-information/market-notifications/qatar-notifies-qualifying-holding-edp
- EDP follow-on May 2012 intra-group transfer to Luxembourg QIA-controlled vehicle: https://edp.com/en/investors/investor-information/market-notifications/qatar-holding-notifies-about-transfer
- **Economic-event safeguard:** intra-group Luxembourg transfer is not a separate new external acquisition. Verify any existing 2011/12 stage or investor reference before creating canonical row.
- **Decision implication [INFERENCE]:** Historic direct public-market utility exposure; no current QIA utility mandate can be inferred.
- **Open:** valuation and price, prior acquisition chronology, matching to secondary transaction records.

## GSI-HOLD-068 — Credit Suisse One Cabot Square London HQ
**Outcome: PRIMARY_ISSUER_SEC_FILING_SUPPORTED_CLOSED_PROPERTY_TRANSACTION; AMOUNT UNDISCLOSED IN PRIMARY.**
Credit Suisse's SEC filing for 2012 identifies a **first-quarter 2012 sale-and-leaseback of One Cabot Square, London**, to **OCS Investment S.à r.l.**, expressly described as **wholly owned by QIA**, with 22-year lease and two optional five-year extensions. This is a verified fund-vehicle relationship; different from QIA's separate Credit Suisse equity position.
- Issuer SEC filing: https://www.sec.gov/Archives/edgar/data/1159510/000137036815000028/R39.htm
- Cross-reference issuer SEC exhibit: https://www.sec.gov/Archives/edgar/data/1053092/000137036813000020/R155.htm
- Contemporary Reuters reporting via Gulf Business says completion reported 20 February 2012 but **consideration undisclosed**; an earlier £330m estimate was prospective press sourcing and is **NOT settled purchase price**: https://gulfbusiness.com/en/2012/02/qia-buys-credit-suisse-london-hq/
- **Decision implication [INFERENCE]:** London commercial-property leaseback exposure, not proof of new current appetite.
- **Open:** contractual consideration, exact close day and financing.

## GSI-HOLD-070 — Veolia 5% ownership
**Outcome: PRIMARY_ISSUER_CONFIRMS_2010_QATARI_DIAR_INVESTMENT; 2012 NEW PURCHASE NOT SUPPORTED.**
Veolia's 16 April 2010 announcement confirms **Qatari Diar**, via wholly owned **Velo Investissement**, crossed the **5% Veolia shareholding** threshold on **15 April 2010**, with **24,681,519 shares**; issuer reports the strategic partnership and board appointment. The 2012 issuer disclosure describes the already-existing stake. The original hold's 2012 date must not be interpreted as a fresh 2012 equity acquisition. Investor vehicle is **Qatari Diar / Velo Investissement**, not directly a QIA transaction without beneficial ownership and founder eligibility ruling.
- First-party Veolia announcement filed with SEC: https://www.sec.gov/Archives/edgar/data/1160110/000090342310000224/veolia-6k_0416.htm
- Veolia later issuer ownership detail: https://www.sec.gov/Archives/edgar/data/1160110/000090342310000597/veolia6k-ex991_1026.htm
- **Open:** investor's exact price and legal sovereign ownership chain; avoid stage duplication, decide inclusion for real-estate state vehicles.

## GSI-HOLD-111 — Bahrain Mumtalakat / Envirogen Group
**Outcome: PRIMARY_FUND_ISSUER_CONFIRMS_2016_OUTBOUND_INVESTMENT; MONTH_AND_TICKET_UNKNOWN.**
Mumtalakat's **14 June 2017** financial-results release expressly says Mumtalakat completed an international investment during **2016** by acquiring a **significant equity stake in UK-based Envirogen Group**. This confirms investor, year, destination and completed stake, but not the month, percentage, legal vehicle or ticket. Do **not** file a fictitious exact month for this 2016 acquisition.
- Fund primary statement: https://www.mumtalakat.bh/ar/news-media/press-releases/mumtalakat-announces-solid-profits-for-the-fourth-consecutive-year
- **Open:** contemporaneous 2016 signing/closing, UK vehicle and stake percentage, price, founder treatment when month unknown.

## GSI-HOLD-120 — QIA / HK Electric Investments
**Outcome: EXCHANGE_DISCLOSURE_SUPPORTS_JUNE_2015_EQUITY_EVENT; NO SECOND 2017 DEAL INFERRED.**
HKEX corporate substantial-shareholder disclosure lists **Qatar Investment Authority**, an event date **9 June 2015**, listed security **HK Electric Investments and HK Electric Investments Ltd. share-stapled units (02638)**. Contemporary industry reporting describes **1.46 billion units / 16.5%** acquired for **HK$7,681m** and a subsequent total direct/indirect interest **19.9%**; independently distinguish purchase from prior 3.4% indirect holding. The reported consideration is not treated as verified paid QIA cash without reconciling the exchange filing's consideration field.
- HKEX first-party disclosure: https://di.hkex.com.hk/filing/di/NSForm2.aspx?corpn=HK+Electric+Investments+and+HK+Electric+Investments+Ltd.+-SS&ed=25%2F08%2F2015&fn=269468&lang=EN&sa1=cl&sa2=as&sc=2638&sced=29%2F12%2F2019&scsd=29%2F12%2F2009&sd=29%2F01%2F2014&sid=50000900&src=MAIN
- Contemporary secondary account: https://www.meed.com/qatar-buys-hongkong-electric-stake/
- **Open:** individual purchase terms and legal holding entity, whether record exists under HK Electric alias, confirm purchase consideration on HKEX.
- **Caveat:** HKEX result surfaced its corporate form, but a subsequent direct page fetch was unavailable; do not claim all form fields were manually reviewed.

## GSI-HOLD-019 — IPIC / Oil Search (Papua New Guinea)
**Outcome: CONTEMPORARY_SECONDARY_SUPPORTS_MARCH_2009_EXCHANGEABLE_BOND, NOT A 2009 DIRECT_17.6%_SHARE_PURCHASE.**
Energy Intelligence's contemporary **4 March 2009** report documents IPIC's **A$1.68bn (~US$1.1bn) five-year exchangeable bond** involving PNG government interests in **17.6% Oil Search**. Source describes bond purchase, *not* immediate equity title in 2009. PNG public inquiry testimony describes conversion and IPIC obtaining shares in **2014**, a later ownership stage and not automatically a second external capital deployment.
- Contemporary transaction reporting: https://www.energyintel.com/0000017b-a7b6-de4c-a17b-e7f657a30000
- PNG inquiry testimony source: https://downloads.pngiportal.org.s3.amazonaws.com/UBSCOI_Transcript_Volume_8_Part_B/UBSCOI_Transcript_Volume_8_Part_B.pdf
- **Open:** issuer or government original executed exchangeable-bond terms; exact payment/settlement and conversion evidence, currency basis, date and economics, which legal entity held equity after conversion. Keep as **provisional source-backed instrument chronology** and do not treat the underlying shares as 2009 outright equity or 2014 second purchase.

## Remaining holds
`007`, `038`, `115`, `121`: remain held; original evidence and fund/entity contradictions not resolved by this batch. `121` retains false founder P36 corroboration flag. No unsupported exclusion or deal creation.

## Verification and correction policy
- These findings are **case-level**. A primary statement verifies only the stated transaction facts, not every economic claim.
- Never impute cash from combined deal/enterprise valuation. Separate *purchase transaction*, *fund-level commitment*, *ownership percentage*, and *paid/deployed cash*.
- Never silently convert `HOLD` to canonical admission. Cross-check master and ledger aliases, economic stages, underlying investor entities and founder scope before adding records.
- **Coverage 1950–2026 remains incomplete.** PR #1 is draft. No main merge, Supabase write or public publication authorised by this note.
