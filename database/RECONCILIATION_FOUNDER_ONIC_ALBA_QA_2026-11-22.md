# Founder source QA — ONIC and Alba — 2026-11-22

Scope: repository-only consolidation, no external research. Read latest reconciliation status, source inventory, audit index, founder matrix, candidate disposition, coverage status, original founder source and canonical master/ledger. These are source-level reconciliation findings, not evidence certification.

| Founder lead | Source claim | Canonical readback | Disposition | Remaining verification |
|---|---|---|---|---|
| R07 | OIF bought 41.13% of ONIC Holding from Dubai Insurance Group; founder date 2013-03-04; 71,323,988 shares | Master and ledger both contain `GSI13M02-001`, describing the same investor, seller, target, percentage and share count; announcement recorded 2013-02-28 | EXISTING_EVENT_LINK_PROVISIONAL; no new record | Founder date 4 March versus 28 February announcement: do not overwrite or treat as separate closing. Primary joint statement/exchange notice not opened. Omani target is domestic; investor entity and scope need ruling. No investor-specific amount verified. |
| S10 | Mumtalakat's 2010 Alba IPO/partial listing on Bahrain Bourse and LSE | No Alba/Aluminium Bahrain event found by target-name search of the current 371-row research ledger; unrelated GlobalFoundries IPO suggested by text similarity must be rejected | LEDGER_ONLY_HOLD; no canonical link | Original exchange/issuer evidence and divested share attribution missing. IPO/divestment is not a new outbound equity investment; do not create master row. |

## QA controls

- Original founder package read: `proposals/GSI_2010_2014_Founder_Leads_UNVERIFIED.csv`; S10 read from `database/RECONCILIATION_FOUNDER_LEADS_v9.8.csv` reflecting its original founder source. R07's canonical master and ledger rows read back under the same stable ID.
- 2 founder leads examined; **1 existing canonical economic-event link confirmed at source-description level** (R07, already mentioned in canonical notes, so not counted as a newly discovered transaction); 1 ledger-only evidence hold; 0 source-proven exclusions; 0 new master/ledger/syndicate rows.
- Do not conflate founder's 4 March date with a confirmed closing, headline valuation with sovereign capital, or a domestic disposal with outbound deployment.
- Four canonical files unchanged. No structural suite executed because no canonical writes; readback identity and target-name ledger search performed.
- All historical audit reports remain uncertified and coverage incomplete. PR #1 must remain draft; no publishing or main merge.
