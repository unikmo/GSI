# GSI founder rulings, 14 Nov 2026

Applies to the merged 1950 to 2019 proposal and later packages. Nothing is in 09-Database.

1. State entities: named state investment vehicles (Aabar, Delta Two, Abu Dhabi Investment Council, KIO) go in the ledger under their fund group with an entity flag. State-owned operating companies (Kuwait Petroleum Corporation, Qatar Telecom) stay ledger-only.
2. Fund group: rows keep the group they carried at the time (IPIC, Aabar and the Council under Other Gulf). A successor-group note records the later Mubadala link.
3. Instruments: convertibles, options, memoranda and threshold filings are recorded, with the stake shown as a ceiling and the status question marked.
4. Month placeholders: rows stay as proposed, flagged for verification, and are fixed when primary sources are opened.

Standing from earlier: file multi-step deals at signing; divestments, aircraft orders, commercial paper, FIFA sponsorship, and domestic, intra-Gulf and intra-group targets are ledger-only.

Still open: v9.5 versus locked v4.9 schema for pre-2020 rows; private royals and Dubai holdings; derived investor amounts; Jan and Apr 2025 backfill approval.

## Second set (same day)
5. Schema: pre-2020 rows follow the locked v4.9 columns. Extra v9.5 fields stay in a separate note file. (The merged ledger adds one working column, source_package, for tracking only; to drop before any database load.)
6. Scope: private royals (Prince Alwaleed) and Dubai holdings (Borse Dubai, Istithmar) are out of scope and stay in the candidates files.
7. Derived amounts: the investor amount stays blank until a source states it. The derivation goes in the amount-scope note. Applied to GSI05M06-001 (Borealis).
8. Jan and Apr 2025 backfills: held as proposals until primary sources are checked.

## Backfill decisions (same day)
9. Yinson (ADIA, Jan 2025) and Kimmeridge (Mubadala Energy, Apr 2025): approved as backfills. Not loaded: nothing is written to 09-Database from here.
10. Aramex (ADQ, Jan 2025): ledger-only, domestic UAE target.
