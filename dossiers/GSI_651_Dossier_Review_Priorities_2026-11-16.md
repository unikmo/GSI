# GSI 651-dossier evidence-completeness QA — 16 November 2026

**Status: STRUCTURAL / DESK-REVIEW ONLY. Not decision-grade.** This report checks whether source-master *fields* have usable entries; it does not prove the URL resolves, the source supports the claim, the deal closed, or the investor paid cash.

- Master SHA: `b746ea81d96675250e3150d2d8715f98b0f9618d`. Exactly **651** unique records.
- Dossiers with a syntactically recorded primary URL: **553** / 651.
- With a syntactically recorded independent URL: **479** / 651.
- With a claim-specific URL: **386** / 651.
- With a documented verified-claim scope: **399** / 651 (unverified as to accuracy).
- With an investor-specific amount field populated: **66** / 651. A populated number is not proof of settlement or deployed cash.
- With explicit open-claims text: **402** / 651.
- With explicit deployment-evidence text: **334** / 651.

## Highest-priority desk-review queue

Priority is a **data-gap heuristic**, not deal value, significance, or evidence grade. A missing *open claims* note is itself a documentation gap; missing amount does not imply an error or zero.

| ID | Investor | Target/event | Gap score | Next review target |
|---|---|---|---:|---|
| V1.5_HOLDS-007 | Mubadala | Textainer / Seaco container leasing platform | 14 | INDEPENDENT_URL, CLAIM_EVIDENCE_URL, VERIFIED_CLAIM_SCOPE |
| GSI25M07-011 | OIA | Energy Transition Fund with Templewater, USD 200m ini | 14 | PRIMARY_URL, CLAIM_EVIDENCE_URL, VERIFIED_CLAIM_SCOPE |
| GSI25M08-001 | ADQ-linked (to rule) | Minority stake in Brevan Howard Asset Management plus | 14 | PRIMARY_URL, CLAIM_EVIDENCE_URL, VERIFIED_CLAIM_SCOPE |
| GSI25M10-001 | MGX (with AIP; KIA is a reported AIP backer) | Aligned Data Centers 100% equity from Macquarie Asset | 14 | PRIMARY_URL, CLAIM_EVIDENCE_URL, VERIFIED_CLAIM_SCOPE |
| GSI25M11-002 | PIF (via HUMAIN, a PIF portfolio company; to rule) | Luma AI: financing of USD 900m led by HUMAIN, with AM | 14 | PRIMARY_URL, CLAIM_EVIDENCE_URL, VERIFIED_CLAIM_SCOPE |
| GSI25M12-001 | QIA | Mujin Series D, Tokyo robotics and warehouse automati | 14 | PRIMARY_URL, CLAIM_EVIDENCE_URL, VERIFIED_CLAIM_SCOPE |
| GSI25M12-003 | PIF / QIA / L'imad (Abu Dhabi); to rule | Paramount Skydance bid for Warner Bros. Discovery: ab | 14 | PRIMARY_URL, CLAIM_EVIDENCE_URL, VERIFIED_CLAIM_SCOPE |
| GSI25M12-004 | MGX | TikTok USDS Joint Venture LLC: MGX 15% as one of thre | 14 | PRIMARY_URL, CLAIM_EVIDENCE_URL, VERIFIED_CLAIM_SCOPE |
| GSI25M12-006 | Mubadala | Real estate debt partnership with Barings, USD 500m,  | 14 | PRIMARY_URL, CLAIM_EVIDENCE_URL, VERIFIED_CLAIM_SCOPE |
| GSI26M01-001 | QIA | xAI Series E: QIA named as participant (upsized round | 14 | PRIMARY_URL, CLAIM_EVIDENCE_URL, VERIFIED_CLAIM_SCOPE |
| GSI26M01-002 | MGX | xAI Series E: MGX named as participant (same round as | 14 | PRIMARY_URL, CLAIM_EVIDENCE_URL, VERIFIED_CLAIM_SCOPE |
| GSI26M01-003 | Mubadala | L-Nutra Series D extension (Los Angeles nutrition tec | 14 | PRIMARY_URL, CLAIM_EVIDENCE_URL, VERIFIED_CLAIM_SCOPE |
| GSI26M02-001 | Mubadala | Waymo Series D (USD 16bn at USD 126bn post-money): Mu | 14 | PRIMARY_URL, CLAIM_EVIDENCE_URL, VERIFIED_CLAIM_SCOPE |
| GSI26M02-002 | MGX | Anthropic Series G (USD 30bn): MGX named among the in | 14 | PRIMARY_URL, CLAIM_EVIDENCE_URL, VERIFIED_CLAIM_SCOPE |
| GSI26M02-003 | PIF | xAI Series E: HUMAIN USD 3bn for a significant minori | 14 | PRIMARY_URL, CLAIM_EVIDENCE_URL, VERIFIED_CLAIM_SCOPE |
| GSI26M02-005 | QIA | Shorooq GCC late-stage growth fund (USD 200m): QIA as | 14 | PRIMARY_URL, CLAIM_EVIDENCE_URL, VERIFIED_CLAIM_SCOPE |
| GSI26M05-001 | MGX | Isomorphic Labs Series B (USD 2.1bn) | 14 | PRIMARY_URL, CLAIM_EVIDENCE_URL, VERIFIED_CLAIM_SCOPE |
| GSI26M05-004 | Mubadala | Hornsea 3 offshore wind: USD 325m alongside Apollo-le | 14 | PRIMARY_URL, CLAIM_EVIDENCE_URL, VERIFIED_CLAIM_SCOPE |
| GSI26M06-008 | QIA | RWE AG equity capital raise (about EUR 4bn): stake ra | 14 | PRIMARY_URL, CLAIM_EVIDENCE_URL, VERIFIED_CLAIM_SCOPE |
| GSI26M06-009 | QIA | Nearfield Instruments Series D (USD 380m, Fidelity le | 14 | PRIMARY_URL, CLAIM_EVIDENCE_URL, VERIFIED_CLAIM_SCOPE |
| GSI26M08-001 | MGX | Databricks strategic funding round (USD 5bn at USD 19 | 14 | PRIMARY_URL, CLAIM_EVIDENCE_URL, VERIFIED_CLAIM_SCOPE |
| GSI26M10-001 | ADIA | QIAGEN: EQT-led take-private offer at EUR 46.50 per s | 14 | PRIMARY_URL, CLAIM_EVIDENCE_URL, VERIFIED_CLAIM_SCOPE |
| GSI26M11-001 | ADIA | Vermeg: acquisition by Advent International with ADIA | 14 | INDEPENDENT_URL, CLAIM_EVIDENCE_URL, VERIFIED_CLAIM_SCOPE |
| GSI94M05-001 | Other Gulf (IPIC) | OMV (Austria, listed oil and gas group): stake bought | 14 | PRIMARY_URL, CLAIM_EVIDENCE_URL, VERIFIED_CLAIM_SCOPE |
| GSI07M09-001 | Mubadala | The Carlyle Group (US, private equity manager): 7.5%  | 14 | PRIMARY_URL, CLAIM_EVIDENCE_URL, VERIFIED_CLAIM_SCOPE |

## Workflow

1. Open source page and capture publisher, publication date, retrieval date, precise supported claim and archived link when possible.
2. Verify the sovereign investing *legal vehicle*, target, geography and instrument; resolve transaction-stage duplicates.
3. Distinguish transaction value, fund-level commitment, investor-specific paid amount and deployment. Never populate an undisclosed ticket by arithmetic.
4. Record corroboration and adverse/contradictory evidence; distinguish primary issuers from syndication of the same announcement.
5. Update the canonical v9.8 master only after evidence QA; regenerate dossiers and QA matrix from the new master SHA, retaining historical versions.

**No source page was independently opened during generation of this matrix. No false completeness claims.**