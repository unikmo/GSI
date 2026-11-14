# Natural Vertical Fit — internal foundation v0.1

**Status:** Infrastructure only; no runtime route, no live database migration, no publication or investor introductions.

## Intent

Research triage for Gulf sovereign investor capital routes. For an opportunity, compare explicit sector, geography, maturity, instrument and ticket signals against a *particular investing vehicle*. Every judgement must cite source and as-of date; historical transactions cannot prove current mandates or funding intent.

## Architecture

- `lib/naturalVerticalFit.mjs`: pure deterministic engine with reason codes and repeatable ranking; no external calls or access to secrets.
- `tests/naturalVerticalFit.test.mjs`: Node built-in tests.
- `supabase/natural_vertical_fit_private.sql`: **unapplied** private storage proposal (opportunities, immutable run snapshots and evidence audit events). All access to anonymous and authenticated roles revoked and RLS enabled; schema must remain absent from Supabase Data API exposed schemas.
- No route, page, environment variable, service-role credential or UI element is introduced.
- The existing public `gsi_master_full` view and the locked v4.9 schema are **not modified**.

## Data boundaries

Use vehicle-level identifiers and original source IDs. Keep source provenance, evidence grade, retrieval/as-of date, investing vehicle, fund amount distinct from headline deal value, and status. Do **not** auto-convert unreviewed v9.6 entries into current mandates.

Inputs are provisional engine contracts, **not approved additions to the locked master schema**. Only verified primary-source evidence with a current validity window can support `currentMandateVerified`. Every result remains research triage; `criteria_evidenced_check_with_investor` is *not* a promise of eligibility, appetite, access or funding.

The 0–100 `matchedWeight` counts matched **predefined criteria**, not probabilities. `knownWeight` shows how much of the criteria was assessable. Unknown evidence does not count as a match. The weights are illustrative technical defaults and require founder/research validation before any product use.

## Next gates

1. Review source-to-investor-vehicle mappings and v4.9 field compatibility.
2. Approve a separate private-schema migration, inspect Data API exposure, and test permissions in the actual target Supabase organisation.
3. Run historical opportunity backtests (at least 10–20) with negative controls; record false positives and analyst overrides.
4. Implement authenticated internal service and manual review workflow only after these checks.
5. Keep all public product, marketing, external exports, and subscription features disabled unless separately approved.

## Founder credibility — editorial guidance

A factual description of founder experience at PIMCO and Ford can support institutional trust, if precise on role and tenure. Employment is not endorsement by either firm. Do not imply GSI research was produced, vetted or approved by former employers. This document is not a website biography or publishing approval.
