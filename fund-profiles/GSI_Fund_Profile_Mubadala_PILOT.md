# Mubadala: fund profile (PILOT, UNCERTIFIED)

Status: working draft from master v9.6 (445 rows). Not QA signed. Not decision-grade. Built only from GSI records; no outside claims added. Retrieval date 14 Nov 2026. Coverage: Jan 2020 to Nov 2026, targeted and not exhaustive.

## 1. Executive judgment
The database supports a profile of *what Mubadala announced*, not of *what it deployed*. Of 146 Mubadala-group rows, only 11 carry an investor-specific amount, in mixed currencies. A total, an average ticket or a "capital deployed" figure would therefore mislead, and none is given. The strongest signal is geographic: the United States is the largest foreign destination in the records.

## 2. Verified developments (record counts, not capital)
- Rows: 146 (group "Mubadala" and variants; Masdar-only rows are separate groups and not counted).
- Announcements by year: 2020 35; 2021 28; 2022 9; 2023 16; 2024 20; 2025 6; 2026 31; one undated. The dips in 2022 and 2025 reflect uneven research depth as much as activity (see section 6).
- Destinations, excluding the UAE (37 rows): United States 39; United Kingdom 9; Germany 6; India 5; Egypt 4; France, China, Canada 3 each. United States rows by year: 2020 6; 2021 9; 2022 2; 2023 6; 2024 7; 2025 3; 2026 6.
- Vehicles named: Mubadala Investment Company 63; Mubadala Capital 18; generic "Mubadala" 6; special-purpose vehicles such as MIC Redwood 1 RSC Limited and MIC TI Holding Company 2 RSC Limited (Jio Platforms and Rio Grande LNG); Mubadala Disruptive Investment (Telegram); Masdar as a Mubadala affiliate.
- Investor-specific amounts present (11): Greenlink USD 200m (May 2026); Hornsea 3 USD 325m (May 2026); Together AI USD 100m (Jul 2026); Jio Platforms INR 90,936m (Jun 2020); Telegram bonds USD 75m (Mar 2021); Certara USD 250m (Jul 2021); UAE-UK partnership GBP 800m (Mar 2021, a partnership ceiling); Princeton Digital USD 350m (Feb 2022); Rio Grande LNG USD 500m (Jul 2023); Nord Anglia USD 600m (Apr 2025). The Aldar AED 3.5bn row is disposal proceeds, not deployment. Amounts are not summed: currencies differ and some are ceilings.

## 3. Strategic interpretation (hypotheses, not findings)
- US weighting may reflect real preference, or may reflect that US deals are better reported. Competing explanation: research depth varies by month.
- Vehicle spread (Mubadala Investment Company, Mubadala Capital, SPVs) suggests the investing vehicle matters more than the group name. This is the point of the Capital Intelligence note in CLAUDE.md.
- 37 UAE rows (domestic or intra-Gulf) show the group is also a domestic allocator, so outbound counts should not be read as total activity.

## 4. Implications
Readers should not use these records for ticket-size benchmarking until amounts, status and vehicle fields are completed. Counts by destination are usable as direction-of-travel evidence only.

## 5. Forward indicators
Nov 2026 is screened only to 13 Nov. Watch: new US and UK infrastructure and credit deals; further Mubadala Capital fund activity; platform commitments converting to funded deals.

## 6. Evidence audit
- Evidence grades: A 68; B 31; C 8; 11 blank; several non-standard labels (for example "A_ANNOUNCEMENT_ONLY") that need normalising.
- Status vocabulary is not normalised: for example MOU, MOU_ONLY and NON_BINDING_MOU; event_type has mixed styles.
- 54 rows have a blank amount_basis. Undisclosed amounts are unknown, not zero.
- 146 rows against 135 under the exact group name: variants such as "Mubadala / Masdar" need a founder rule on grouping.
- Mubadala Energy / Kimmeridge (Apr 2025) is in v9.6; its primary release is unread.
- Jun 2025 to Nov 2026 proposals and the 1950 to 2019 proposals are not loaded, so this profile excludes them.
- Deployment: the schema has no "deployed" field; none is asserted here.

## Open decisions for the founder
1. Label crosswalk v9.7 now exists in 09-Database (evidence grade and status family; event type not yet). Review the flagged rows, then re-run this profile on normalised labels.
2. Rule on group variants (Mubadala / Masdar, joint rows).
3. Load the Jun 2025 to Nov 2026 proposals before profiling the other funds?
