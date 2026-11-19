# Founder 2007–2010 false-positive matching QA — 2026-11-19

Scope: existing GitHub branch files only. Read latest status, inventory, audit index, founder register, candidate disposition and coverage status first. Compared original `proposals/GSI_1979_2010_Founder_Leads_UNVERIFIED.csv` against the canonical working master. No new external research.

| Founder lead | Original claim | Suggested text match in founder matrix | QA finding | Controlled disposition |
|---|---|---|---|---|
| S03 | Mumtalakat purchased 30% of McLaren in Jan 2007 | GSI17M06-001 | **REJECT AS SAME EVENT**: canonical row describes a June 2017 increase after Ron Dennis's exit, not initial 2007 purchase. Same fund and target are insufficient to equate separate stakes. Founder claim has no cited URL. | HOLD_2007_PRIMARY_SOURCE; do not link or add |
| S07 | SGRF 30% Corporate Commercial Bank Bulgaria, Jan 2009 | GSI22A04-001 | **REJECT**: canonical is ADQ's 2022 Commercial International Bank (Egypt) stake; different investor, bank, country and year. Similar banking terminology is not a link. | HOLD_2009_PRIMARY_SOURCE; do not link or add |
| S08 | OIF Becton Property Group retirement alliance and 9.9% placement, Apr 14 2009 | GSI-2021-JAN-004 | **REJECT**: canonical is Mubadala/Thoughtworks 2021 US consortium secondary placement; different investor, target, date and instrument. Founder asserts USD160m alliance and USD3.1m placement, neither source-verified here; do not combine or attribute USD160m as investor ticket. | HOLD_TWO_POSSIBLE_STAGES_PRIMARY_SOURCE; do not link or add |
| S11 | Mumtalakat McLaren 42% after Daimler buyback, 2009–2010 | GSI17M06-001 | **REJECT AS SAME EVENT**: 2017 post-Dennis stake increase is not evidence of a 2009–2010 Daimler-related change. Could be a separate earlier stage but no original supporting URL. | HOLD_EARLIER_STAKE_STAGE; do not link or add |

## QA and boundaries

- Four original founder rows checked; **four unsafe suggested text matches** identified. Two founder leads (S03/S11) point to the same later McLaren canonical row, but neither validates the earlier stage.
- **Zero verified new canonical links, zero source-proven exclusions, zero accepted deals, zero canonical mutations.** Four evidence holds remain. Do not count these as additions to the global open-hold total without deduplicating founder case IDs.
- The canonical master readback confirmed all three referenced IDs exist; this test verifies presence, **not economic identity**. Direct inspection of canonical descriptions and fund/year/target established the mismatches. No full structural test was rerun because canonical files were unchanged.
- Source matrix remains unmodified: this QA document is the auditable evidence against accepting the current `best_text_match_id` fields. Preserve founder rulings and source statuses. Original source notes explicitly state no URL.
- Current master/ledger/syndicate/crosswalk baseline is **651/371/206/651** per latest status checkpoint, not independently recounted. Existing coverage is uncertified; draft PR #1 must remain unmerged.
