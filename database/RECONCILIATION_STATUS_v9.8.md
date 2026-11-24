# GSI v9.8 backlog reconciliation — in progress

Date: 2026-11-15
Status: **INCOMPLETE — do not merge PR #1 as a comprehensive consolidation.**
Scope: **Existing research only. No new external deal research until all proposal packages are reconciled.**

## Authoritative data (review branch)

- `database/GSI_Global_Research_Master_v9.8_WORKING.csv`: 616 records, 67 fields. Includes 12 held historical development-loan screening records added since the 604-row v9.8 baseline.
- `database/GSI_Research_Ledger_v9.8_WORKING.csv`: 322 records.
- `database/GSI_PE_Syndicate_Map_v9.8_WORKING.csv`: 193 relationships.
- `database/GSI_Label_Crosswalk_v9.8_WORKING.csv`: 616 records.
- Keep historical v9.5 and v9.6 unchanged. The 41 subsequently researched candidates are **not** the complete backlog.

## Repository inventory

The `proposals/` directory has 340 items, including 63 candidate research files, 66 research-ledger files, 66 PE syndicate-map files, 66 coverage files, and supplementary audits, founder rulings and verification logs. These are **file counts, not transaction counts**.

The `proposals/GSI_Merged_1950_2019_Candidates_UNVERIFIED.csv` file has **281 candidate/lead rows**, overlapping the period-specific source packages. It must NOT be imported wholesale or added to the source package totals. Example statuses include 63 `UNVERIFIED_LEAD_MONTH_UNKNOWN`, 34 `LEDGER_ONLY_DIVESTMENT_NOT_ADDED`, 28 `LEDGER_ONLY_CANDIDATE`, and 16 `NOT_A_RECORD_NO_TARGET`.

Exact-normalised target-title equality found zero matches between these 281 lead descriptions and the master `target_or_event`; this is **not evidence that they are unique** because one is a narrative lead description and the other may have a short target name. Use investor/entity, transaction economics, dates, instrument and staged deal links to reconcile.

## Required reconciliation pass

1. Build a source-package inventory, preserve existing IDs and provenance, and identify source packages superseded by the merged 1950–2019 proposal.
2. Compare every proposed ledger, candidate, syndicated-party and coverage entry against the canonical 616-record v9.8 master and companion tables.
3. Classify each as already covered, genuinely new verified, provisional, ledger-only, hold, excluded/out-of-scope, duplicate/stage of existing event, or needs verification.
4. Observe founder rulings (`proposals/GSI_Founder_Rulings_2026-11-14.md`): founding milestones are not investments; state operating companies are ledger-only; no amount derivation without source; private royal capital outside scope; divestments ledger-only; Yinson/Kimmeridge backfills approved; Aramex domestic ledger-only.
5. Update the **same four v9.8 files** with tested, sourced changes only, maintaining 67-column master schema, stable IDs, crosswalk 1:1 coverage, and valid syndicate references.
6. QA total rows, economic duplicates, transaction stage classifications, primary-source integrity and true date coverage; publish reconciliation counts by result and remaining uncertainties.

## Completion gate

Backlog consolidation is complete only when all 340 proposal assets have a documented disposition or relationship to a superseding source; all accepted additions are in the existing tables; there are no unexplained duplicate economic deals or orphan syndicate/crosswalk references. New research may resume only thereafter. Data remains **unreviewed and not decision-grade** until evidence QA sign-off.

## Reconciliation execution — 2026-11-15 (confirmed GitHub readbacks)

### Research-ledger ID reconciliation — all 66 proposal ledger files screened

| Source group | Files | Proposed row occurrences | IDs absent from v9.8 ledger |
|---|---:|---:|---:|
| Individual historical packages, 1950–2019 | 47 | 103 | 0 |
| Merged 1950–2019 historical proposal (overlaps the 47 files) | 1 | 103 | 0 |
| Monthly packages, June–December 2025 | 7 | 56 | 0 |
| Monthly packages, January–November 2026 | 11 | 93 | 0 |
| **Total** | **66** | **355 (includes 103 overlapping)** | **0** |

This establishes that **all proposed research-ledger IDs in 66 source files already occur in the 322-row v9.8 ledger**. It does NOT establish that their fields are identical or that the economic transactions are verified. No new ledger rows were imported in this pass.

### PE syndicate proposal reconciliation — partially screened

- Merged 1950–2019 syndicate map: **102/102** rows match existing v9.8 map by linked ID + Gulf investor + partner + role.
- June–December 2025 syndicate proposals: **28/28** rows match by the same composite key.
- January–November 2026 syndicate proposals: **27/27** rows match by the same composite key.
- All **47 period-specific historical syndicate files** individually checked: 102/102 proposed links match v9.8 by composite key. These 102 overlap the merged 1950–2019 map.
- Status: **all 66 syndicate proposal files screened**: 259 proposed map-row occurrences (102 historical + 102 overlapping merged + 55 recent), **0 unmatched composite keys**. These are 157 source-package references after excluding the duplicated merged 102; they are not necessarily 157 distinct canonical map rows.

### Still required before completion

- Compare **field values**, status changes, provenance, amount and stage caveats for already matched ledger and syndicate IDs.
- Classify all **63 candidate lead files**, including the merged 1950–2019 file with 281 rows, using economic-event matching rather than exact narrative strings; check supersession/overlap.
- Reconcile **66 coverage registers**, supporting audits and founder ruling logs, without copying coverage assertions or equating a research attempt with a proven zero-deal result.
- Completed composite-key presence checks for all 47 period-specific historical syndicate maps; full field-level and economic-role QA remains.
- Record defensible additions/corrections only after evidence/ruling checks; preserve canonical four files and avoid duplicate economic transactions.

**No further external research, no Supabase writes, no merge or release.**

## Candidate screening — all 63 candidate files now inventoried

- 47 historical period-specific candidate files (1950–2019): **281 lead rows**; they overlap the separate merged 1950–2019 file, also **281 rows**. Count historical leads once, not twice.
- 15 candidate files (September–December 2025 and January–November 2026): **108 additional lead rows**.
- Together: **389 source leads** needing dispositions. All **63 candidate files** have been read for record/status inventory, including the merged file.
- A 389-row, source-linked screening matrix was committed to `database/RECONCILIATION_CANDIDATE_DISPOSITION_v9.8.csv` (not a transaction master or accepted-deal ledger).

| Initial classification from source status | Count |
|---|---:|
| Linked to an existing record (link still needs independent verification) | 32 |
| Ledger-only candidate (not yet automatically admitted) | 72 |
| Not a record / out of transaction-master scope | 76 |
| Unverified lead; held pending evidence | 200 |
| Correction requiring review | 8 |
| Parked/other | 1 |
| **Total** | **389** |

These are classifications inherited from proposal statuses, NOT an independent check of all 389 economic events. None of the 200 held leads should be imported as a verified deal without supporting evidence. The 72 ledger-only candidates require admissibility/evidence review before any new ledger row.

## Coverage-register work started

- Read and inspected representative registers: pre-1979, 2019 and November 2026.
- The 1950–1978 source register has 3,480 month-by-source-group rows, many `NOT_SCREENED`; a coverage row is not a verified transaction nor a completed exhaustive search.
- Coverage register aggregation and 66-file exception audit remain outstanding. Preserve `NOT_SCREENED`, `PARTIAL_TARGETED_SCREEN` and unknown statuses; do not infer empty months.

## Full source-table checks completed in this execution

**Ledger:** All 66 proposal ledger CSVs have been read. The 47 historical source packages' 103 entries are reproduced in the 103-row merged historical file. The 18 newer monthly packages contain 149 entries (56 in 2025; 93 in 2026). After eliminating the historical repeated source copy, **252 existing proposal-ledger rows** were compared with the canonical v9.8 ledger by record ID. Field-level comparison of all 103 merged historical and all 149 recent proposal rows found **zero differing values in common fields**. The historical 47 period files were checked for ID presence, not independently for every field against the merged copy.

**Syndicate map:** All 66 proposal maps were screened. The merged 1950–2019 102 rows match v9.8 by composite key and **by all common field values**. All 55 recent rows (28 from 2025 and 27 from 2026) also match the existing v9.8 map by composite key and all common field values. The 47 historical source-period map files have 102 rows and match by composite key; their common field values against the merged source file have not been separately rechecked.

**Candidate leads:** All 63 candidate files screened; see the separate 389-row initial disposition CSV. The source packages' original 281 historical candidate rows are duplicated by the merged historical candidate file, so count them once. The 108 additional 2025–2026 leads give a total of **389 non-duplicated source-lead rows**, of which 200 remain held as unverified.

**Coverage:** All 65 individual period/monthly coverage-register files read: **8,580 month-by-source-group rows** (8,198 NOT_SCREENED, 377 PARTIAL_TARGETED_SCREEN, 5 NOT_SYSTEMATICALLY_SCREENED). The separate merged 1950–2019 coverage file is 1.89 MB and its content reader returned empty; the merged audit says it contains 8,400 rows, consistent with the individual historical packages. See `database/RECONCILIATION_COVERAGE_STATUS_v9.8.md` for the limitations and status guardrails. **Do not mark historical periods as fully screened.**

**Auxiliary proposals:** Identified 66 proposed audit Markdown files, 8 founder/overview leads files, 3 special backfill proposals, the founder rulings and the verification log. Sampled audit files; all observed are uncertified and not decision-grade. Founder-ruling-approved Yinson/Kimmeridge backfills already appear in the v9.8 master and ledger; the Aramex domestic 2025 backfill is ledger-only under the founder ruling and should NOT be auto-inserted as a completed outbound-equity deal. Additional founder/overview leads still require economic-event reconciliation to the 389 candidate lead rows and master.

**Other research:** The previously generated 2021/2022 incremental research workbook is outside the repository's 340-item proposal folder and still requires explicit case-by-case comparison against canonical v9.8. Do not treat its records as merged merely because they exist as a local research workbook.

**QA gate is NOT met:** Evidence for 200 held leads, 72 ledger-only leads, 8 correction rows, 66 audit conclusions, founder lead overlap, and the remaining source/economic-transaction checks is unresolved. No new master rows were added from these source packages; this is an accounting/reconciliation pass, not a claim of comprehensive evidence sign-off.

## Founder and correction reconciliation, current execution

- Read all eight founder/overview lead files: **147 source lead rows**. A new canonical-linking review matrix is committed in `database/RECONCILIATION_FOUNDER_LEADS_v9.8.csv`. It contains 18 explicitly examined links to existing v9.8 master/ledger record IDs (PIF Uber, POSCO, SoftBank Vision Fund and Virgin proposals; PIF/Lucid; 2025 EA, Databricks, TikTok, Aligned, McLaren and Templewater; 2026 HUMAIN, Isomorphic Labs, Aligned closing stage, Databricks, OIA fund term sheets). Linked does not imply primary-source verification.
- 147 founder leads remain individually traceable. The remaining **129** have not been independently linked or admitted; automatic text similarity was not treated as proof of a deal.
- All eight source correction flags were compared with canonical v9.8 and recorded in `database/RECONCILIATION_CORRECTIONS_v9.8.csv`. GEMS (2014), Hyperoptic (2018) and Investcorp (2016) already have correct-year records. POSCO and Banvit have existing records but unresolved announcement/SPA dating; ACWA Power domestic timing remains unverified; Escribano 2022 exit and possible misdated 2026 ledger note must not become two completed disposals.
- The three special backfill proposals were inspected. Yinson (`GSI25J01-005`) and Kimmeridge (`GSI25A04-006`) already appear in the v9.8 master; Aramex 2025 domestic tender offer remains a separate ledger-only/hold decision, not an outbound master transaction.
- All corrections and candidate links are staged in review-only auxiliary files; **the four original v9.8 tables remain unchanged in this execution**, since unresolved source evidence is insufficient to modify transaction dates/amounts or admit new master deals.

### Unresolved completion gate

The remaining 129 founder leads require substantive comparison to existing target/vehicle histories and source packages. The 200 candidate holds and 72 ledger-only candidates also require case-level evidence and eligibility review. The 1.89 MB merged coverage CSV and 2021/2022 incremental workbook remain outside full verified reconciliation. No claims of complete 1950–2026 coverage, deployed cash totals, or published/merged data are justified yet.

## Separate September 2021 – June 2022 research workbook checked

The attached `GSI_Research_Expanded_2021Sep_2022Jun_2026-11-15.xlsx` was opened directly (New Research Ledger sheet): **41 distinct GSI-RESEARCH record IDs**, all **41 already present** in the canonical v9.8 research ledger. No additional rows should be imported from this workbook by ID alone. The separate `GSI_2021_September_Incremental_Review_2026-11-15.xlsx` contains **6 targeted September 2021 research candidates** and partial source-coverage/audit context; these are not six independently verified new equity deals. Do not treat its older 257/443 running totals as canonical over the 616-record v9.8 master.

The founder-lead reconciliation matrix now has **18 explicit existing-event links**, preserving 129 still to be reconciled. The chronology-correction audit contains eight source flags, several mapping to correct-year entries already present (GEMS, Hyperoptic, Investcorp).

## Consolidation checkpoint — continued execution on 15 Nov 2026

**Provenance inventory:** All **340 proposal files** now have one file-level disposition in `database/RECONCILIATION_SOURCE_INVENTORY_v9.8.csv`: 66 audits, 66 research ledgers, 66 syndicate maps, 66 coverage registers, 63 candidate files, 8 founder/overview lead files, 3 special backfills, one founder ruling and one verification log. The original files remain unchanged. This is file-level accounting, **not** evidence certification of their contents.

**Audit index:** All **66 audit reports** directly read and indexed in `database/RECONCILIATION_AUDIT_INDEX_v9.8.csv`. All 66 state that they are **UNCERTIFIED**. 46 explicitly state that no primary source page was opened; 19 do not provide determinate primary-review status in the indexed text; one contains language claiming some primary-source review. Do not convert any of these into a certification claim without its source.

**Founder lead reconciliation:** Of the **147** inventoried source leads, **50 now have explicit canonical v9.8 event/ledger IDs**, checked for ID existence and broad institutional group consistency. The remaining **97** are classified (not silently dropped): 22 historical parked leads, 20 source exclusions, 11 ledger-only source cases and 44 still requiring transaction/evidence matching. `database/RECONCILIATION_FOUNDER_LEADS_v9.8.csv` holds every original description, prior suggested text matches, the manually reviewed canonical ID and disposition. This resolves 32 additional source-event links since the earlier 18-link checkpoint; **no new economic deal is implied**. Some links have a date, stake or stage caveat recorded for source review.

**Candidate link QA:** `database/RECONCILIATION_CANDIDATE_DISPOSITION_v9.8.csv` now contains all 389 original leads plus ID-level checks. All **32** source-asserted existing-record links resolve to canonical v9.8 IDs (one links to two records). The other initial classifications remain source-status-based: 200 unverified, 72 ledger-only candidates, 76 not transaction-master records, eight corrections and one parked. These statuses are not evidence approvals.

**Master economic duplication screen:** Reparsed all **616** master records; no pairs shared an **exact normalised target description together with the same investor group**. This is only a narrow duplicate indicator, **not proof of zero duplicate economic deals**; announcement and closing rows can have different descriptions. Stage-level checks remain required.

**Current release gate:** Historical v9.8 baselines remain intact; four canonical tables have not been changed by this checkpoint. The PR stays a draft; no Supabase use, new external research, publication or merge. Open evidence work includes institution-specific source checks, amount attribution, 97 founder-lead exceptions and 200 held candidate leads; the 1950–2026 period remains incompletely screened. The unreadable 1.89 MB merged historical coverage CSV is not treated as an additional independent row set, because 65 individual coverage registers were parsed and historical merger would double-count them.

## Focused primary-source verification of the original 117 pending leads — checkpoint, 2026-11-15

**Executed in GitHub review PR #1, branch only.** No general new-deal search, Supabase writes or main merge. The original set of **117 candidate cases requiring source checks** has been worked through in successive passes; **68 cases remain tagged SOURCE_VERIFICATION_PENDING** (after some existing-record links and primary-source resolutions). That does **not** mean the other 49 are fully certified as investor-specific capital. Each case retains its original source and disposition, primary evidence URLs where opened, and open caveats in `database/RECONCILIATION_CANDIDATE_DISPOSITION_v9.8.csv`.

**Current authoritative file row counts (heterogeneous research rows, NOT 639 verified deals):**

| Working table | Data rows |
|---|---:|
| Global master (including holds and noncounted economic duplicates) | **639** |
| Research ledger | **353** |
| Label crosswalk | **639** |
| PE syndicate/partner map | **204** |

**Source-backed GSI records added in this review:**
- 1987 KIO Torras Hostench 24%→37% rights issue (`GSI87M08-001`); Feb 1988 KIO additional BP shares (`GSI88M02-001`); 1990 Torras takeover 39.7%→72.9% (`GSI90M02-099`). Separate June 1990 remaining 2.27% bid is only a ledger proposal, not proof of acquisition.
- 2005 Mubadala Ferrari 5% for €114m (`GSI05M07-099`); 2006 Aabar Singapore Pearl Energy takeover (`GSI06M05-099`) and KIA $720m ICBC IPO stake (`GSI06M09-099`); 2007 Qatar Holding 20% LSE (`GSI07M09-099`); Dec 2008 Mubadala 24.9% US John Buck Company (`GSI08M12-001`); 2009 ATIC $2.1bn GlobalFoundries financing (`GSI09M03-099`) distinct from public AMD shares; 2010 Mubadala additional $500m Carlyle convertible/GP-equity **agreement** (`GSI10M12-099`).
- 2011 IPIC takeover of Cepsa 48.83% from Total €3.7bn (`GSI11M02-099`); 2011 IPIC OMV 20.4%→24.9% stake increase (`GSI11M10-099`); 2012 Qatar Holding 22.22% Citic Capital (`GSI12M08-099`); 2014 QIA Lifestyle International 19.9% agreed for $616m (`GSI14M10-099`); 2014 Mumtalakat PRO Unlimited with Investcorp (`GSI14M10-098`); 2015 Mumtalakat Nobel Learning with Investcorp (`GSI15M03-099`); 2015 Mubadala MATSA Trafigura JV (`GSI15M06-002`); 2015 ADIA Fenix Power 36% in consortium (`GSI15M12-002`); Jan 2016 Mubadala Vivalto Santé (`GSI16M01-001`).
- QIA d-Matrix 2025 Series C (`GSI25M11-005`), MGX/Silver Lake Altera 2025 (`GSI25M09-008`), QIA Skyryse 2026 financing (`GSI26M02-099`), MGX/OpenAI March 2026 $122bn whole round co-lead (`GSI26M03-099`). None has its investor amount imputed from the round or deal valuation.

**Ledger-only additions:** 1989 ADIA Trafalgar House existing-stake disclosure, 2011 ADIA Kemble Water holding with unknown purchase month, May 2008 Mubadala intra-Gulf Pearl transfer, June 1990 KIO Torras follow-on bid (not closed), ADQ/Energy Capital Partners $25bn prospective platform, QIA/Blue Owl digital infrastructure prospective platform, Mumtalakat/BlueFive intra-Gulf ownership, and others entered in-source with noncounted stage notes.

**Duplicates and corrections:** PIF/SALIC Olam Agri 44.58% signed Feb 2025 and completed Apr 2026 is ONE economic acquisition. `GSI25F02-001` now counted once at seller-reported $1.88bn completion consideration; `GSI26B03-001` is retained as explicit **duplicate closing-stage / NONCOUNTED**. Greenlink direct investor release body dateline June 16 2026 corrects May/June discrepancy. Hologic issuer confirmed Apr 7 2026 closing and ADIA minority participation. New records in ledger/crosswalk/syndicate maps were cross-linked to canonical source IDs.

**Important open exceptions** (do not auto-admit): historical KIO Royal Bank of Scotland and Hoechst operator exposure, ATIC 2009 Chartered acquisition separate from GlobalFoundries, OIA/SGRF Indus Teqsite date and amount, unnamed fund targets or mixed leads, private or corporate ownership ambiguity, pre-2020 unverified exact dates, and 2025/26 sovereign investor-specific round contributions where undisclosed. The remaining **68 pending source cases** are not certified; also leave previously linked-but-provisional cases explicitly provisional.

**Release QA:** Transaction stage, geography and amount caveats were retained. Separate source-case labels do not mean every historical year/month is comprehensively researched. Do not assert 1950–2026 completeness, do not merge draft PR yet. Final case-level source QA remains open.

## Latest 200-candidate disposition checkpoint — 2026-11-15

The original **200 held candidates** from the 389-row candidate register have been processed individually and isolated in `database/RECONCILIATION_200_HELD_CASES_v9.8.csv` (source filename, lead ID, full description, original status, current disposition, linked canonical record IDs, verification basis and open evidence gaps retained). The 389-row master candidate screening matrix is unchanged in structure and still preserves the other 189 source leads.

- **187/200** cases now have a disposition **other than generic `SOURCE_VERIFICATION_PENDING`**, including already-represented events, supported additions to canonical master/ledger, stage duplicates, ledger-only/intra-group events, non-deals, and source-deficient leads explicitly held or excluded.
- **13/200** still require primary-source verification to establish transaction identity, sovereign investor eligibility, correct date/amount, or whether a specific event occurred. Case IDs: `GSI-HOLD-001`, `007`, `019`, `038`, `063`, `068`, `070`, `111`, `112`, `115`, `120`, `121`, `171`. These must NOT be counted as verified or assumed nonexistent.
- The resolved cases include multiple references to a **single** economic deal (e.g. KIA/Associated British Ports 2015 and QIA/Positron financing) and genuine stage differences; do not add 187 transactions or aggregate amounts from this count.
- This checkpoint's canonical tables: **648 master rows**, **368 research-ledger rows**, **206 syndicate/partner-map rows**, and **648 label-crosswalk rows**. The master still contains heterogeneous rows (provisional, held and noncounted), not 648 confirmed investments.
- Independently performed structural readback QA: master IDs unique, ledger IDs unique, crosswalk IDs unique and 1:1 with master; every syndicate link refers to a master or ledger record. **This is structural QA, not primary-source certification for every economic claim.**
- Newer vetted additions from this reconciliation include ATIC's 2009 Chartered Semiconductor acquisition; KIA's 2015 Associated British Ports stake; ADIA subsidiary's participation in Waabi's 2026 Series C; OIJIF's August 2012 Indus Teqsite funding (fund-level amount, no invented SGRF cash allocation). State-internal Aabar/RHB and the unclosed Mubadala/JBI JV remain **ledger-only**.
- Separately verified QIA d-Matrix and MGX/Silver Lake Altera are **already present** on the review branch and were not duplicated. Additional concurrent source-backed commits were preserved. Given concurrent branch writes, always read the latest version before replacing any table.
- **Release gate remains OPEN:** 13 direct evidence-blocked candidate cases plus other outstanding founder/ledger scope and chronology exceptions, and large historical coverage marked NOT_SCREENED. No Supabase action, no new market research sweep, no main-branch merge. Existing PR #1 remains draft.

## Continued source verification — 15 November 2026, latest checked

- The 200 original source holds now have a fully populated, individually traceable disposition in `database/RECONCILIATION_200_HELD_CASES_v9.8.csv`, synchronised from the 389-lead matrix. **190/200** have outcomes other than generic `SOURCE_VERIFICATION_PENDING`; **10/200** remain directly source-blocked: `GSI-HOLD-007`, `019`, `038`, `063`, `068`, `070`, `111`, `115`, `120`, `121`. Explicit exclusion/hold or link does not mean its historical claim was proved or its investor's cash was identified.
- Source-verified transaction additions since the previous 648-row checkpoint: KIO's initial Torras Hostench equity stake **by September 1986** (`GSI86M09-001`), distinct from the 1987 rights issue; Mumtalakat/Sentinel **February 2018** Lenovo office-campus purchase (`GSI18M02-099`), not in 2016; QIA's **December 2025** additional Monumental Sports stake (`GSI25M12-099`), distinct from the initial 2023 holding. Investor-specific amounts left blank because the available sources do not state them. Data grounded in contemporaneous El País, Sentinel issuer statement, and Monumental Sports issuer statement respectively.
- Earlier additions include ATIC 2009 Chartered Semiconductor; KIA 2015 ABP stake; ADIA subsidiary 2026 Waabi Series C; OIJIF August 2012 Indus Teqsite. ADIA Waabi and other round totals are NOT investor-specific capital. Aabar/ADCB RHB and domestic Mubadala John Buck JV remain ledger-only.
- **Latest canonical table sizes after those writes:** Global Master **651**, Research Ledger **371**, PE Syndicate Map **206**, Label Crosswalk **651**. Heterogeneous records include holds and noncounted stages, so not all are verified economic deals.
- Latest writes performed only on GitHub draft PR #1; no Supabase, production release or main merge. ID uniqueness, crosswalk 1:1 coverage and syndicate reference integrity passed on the last 648-row checkpoint and 651-row write; recheck when next writing because another workflow may be modifying the same branch.
- The ten remaining evidence-blocked cases should not be converted to completed transactions without signed/issuer primary evidence, confirmed fund affiliation or reliable transaction chronology. Complete market research 1950–2026 is **not** claimed; coverage-register findings remain overwhelmingly NOT_SCREENED.
