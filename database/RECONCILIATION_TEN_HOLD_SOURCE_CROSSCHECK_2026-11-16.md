# GSI v9.8 — source-only ten-hold cross-reference QA (2026-11-16)

Scope: existing repository sources only; no new market research, no source certification. Review branch PR #1. Canonical data must not be modified from this note.

Read current RECONCILIATION_STATUS, SOURCE_INVENTORY, AUDIT_INDEX, FOUNDER_LEADS, CANDIDATE_DISPOSITION, COVERAGE_STATUS, and 200_HELD_CASES before checking. The status document supersedes the original 616-row baseline: its latest documented checkpoint is 651 master / 371 ledger / 206 syndicate / 651 crosswalk, subject to concurrent changes. Do not use the 616-row number as current.

| Hold | Existing-source cross-check | QA disposition |
|---|---|---|
| 007 | Separate 14.06m RBS Lloyds trade lacks date/source; canonical 1985 18.5m trade is not proof of same event | HOLD; no duplicate or amount import |
| 019 | IPIC Oil Search 17.6%, date and primary source missing | HOLD |
| 038 | Alleged 2008 ATIC $700m and $314m tranches cannot be distinguished safely from March 2009 AMD/GlobalFoundries closing | HOLD; avoid double count |
| 063 | EDP notification lacks confirmed Qatari beneficial holder and stake size | HOLD |
| 068 | Credit Suisse London HQ Qatari buyer unverified as QIA vehicle | HOLD |
| 070 | Veolia ~5% QIA holding has no dated purchase evidence | HOLD |
| 111 | Candidate U02 corresponds to founder P22 (Mumtalakat/Envirogen); P22 has no URL or independently reviewed canonical link | HOLD; same lead, not two deals |
| 115 | Candidate V02 corresponds to founder P10 (SGRF/Bharat Mumbai Container Terminals); P10 has no URL or independently reviewed canonical link | HOLD; same lead, not two deals |
| 120 | Hongkong Electric acquisition year and investor structure missing | HOLD |
| 121 | Candidate Y06 asserts PIF/Guolian $560m, but referenced founder P36 actually describes **OIF (Oman) domestic aquaculture/fisheries funding, 2017–2018**, not PIF or Guolian. The founder cross-reference is therefore **inconsistent** and cannot support the candidate | HOLD; reject P36 as corroboration of Y06, not proof Y06 is false |

This is a source-relationship QA finding, not a primary-source exclusion. Preserve founder P36's domestic/outbound distinction and do not relabel it as PIF. All ten remain evidence-blocked, with no new economic link accepted. No changes to master, ledger, syndicate, crosswalk or the original founder ruling.

QA: 10 unique hold IDs reviewed; 3 explicit founder-source references checked (P10/P22/P36); 1 material fund/entity mismatch found; 0 new links, 0 primary-source exclusions, 0 canonical additions. Historical coverage remains incomplete and the 66 audits uncertified. Draft PR only; no merge, publication, Supabase or paid service.
