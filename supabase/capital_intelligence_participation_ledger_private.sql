-- GSI investor participation and capital-flow event ledger (UNAPPLIED).
-- Depends on capital_intelligence_snapshots_private.sql and
-- capital_intelligence_private_fund_taxonomy.sql, in that order.
-- Never backfills or updates public.gsi_master_full.
BEGIN;
CREATE TABLE IF NOT EXISTS gsi_cap_private.investment_events (
 event_id text PRIMARY KEY,
 investee_id text NOT NULL REFERENCES gsi_cap_private.investee_entities(investee_id),
 master_record_id text,
 master_source_version text,
 event_type text NOT NULL CHECK(event_type IN ('INITIAL_INVESTMENT','FOLLOW_ON','FUND_COMMITMENT','SECONDARY_PURCHASE','PARTIAL_EXIT','FULL_EXIT','WRITE_OFF','DISTRIBUTION','RESTRUCTURING','OTHER')),
 announced_on date NOT NULL,
 effective_on date,
 instrument text,
 event_status text NOT NULL DEFAULT 'ANNOUNCED' CHECK(event_status IN ('ANNOUNCED','SIGNED','CLOSED','CANCELLED','UNKNOWN')),
 review_state text NOT NULL DEFAULT 'UNREVIEWED' CHECK(review_state IN ('UNREVIEWED','REVIEW_IN_PROGRESS','REVIEWED')),
 evidence_id text NOT NULL REFERENCES gsi_cap_private.evidence_sources(evidence_id),
 notes text,
 CHECK(effective_on IS NULL OR effective_on >= announced_on OR notes IS NOT NULL),
 CHECK((master_record_id IS NULL AND master_source_version IS NULL) OR (master_record_id IS NOT NULL AND master_source_version IS NOT NULL))
);
CREATE TABLE IF NOT EXISTS gsi_cap_private.investment_participants (
 event_id text NOT NULL REFERENCES gsi_cap_private.investment_events(event_id),
 investor_entity_id text NOT NULL REFERENCES gsi_cap_private.investor_entities(investor_entity_id),
 vehicle_id text REFERENCES gsi_cap_private.investor_vehicles(vehicle_id),
 participant_role text NOT NULL CHECK(participant_role IN ('LEAD','CO_INVESTOR','CONSORTIUM_MEMBER','SELLER','BUYER','GENERAL_PARTNER','LIMITED_PARTNER','LENDER','OTHER')),
 evidence_id text NOT NULL REFERENCES gsi_cap_private.evidence_sources(evidence_id),
 review_state text NOT NULL DEFAULT 'UNREVIEWED' CHECK(review_state IN ('UNREVIEWED','REVIEW_IN_PROGRESS','REVIEWED')),
 PRIMARY KEY(event_id,investor_entity_id,participant_role)
);
CREATE TABLE IF NOT EXISTS gsi_cap_private.participant_capital_flows (
 flow_id text PRIMARY KEY,
 event_id text NOT NULL,
 investor_entity_id text NOT NULL,
 participant_role text NOT NULL,
 flow_kind text NOT NULL CHECK(flow_kind IN ('COMMITMENT','FUNDED','PROCEEDS','DISTRIBUTION','REPORTED_TRANSACTION_TOTAL')),
 amount numeric CHECK(amount IS NULL OR amount >= 0),
 currency_code text CHECK(currency_code IS NULL OR currency_code ~ '^[A-Z]{3}$'),
 amount_state text NOT NULL CHECK(amount_state IN ('REPORTED','ESTIMATED','NOT_DISCLOSED','NOT_AVAILABLE','NOT_APPLICABLE')),
 amount_as_of date,
 evidence_id text REFERENCES gsi_cap_private.evidence_sources(evidence_id),
 estimation_method text,
 notes text,
 FOREIGN KEY(event_id,investor_entity_id,participant_role)
  REFERENCES gsi_cap_private.investment_participants(event_id,investor_entity_id,participant_role),
 CHECK((amount_state IN ('REPORTED','ESTIMATED') AND amount IS NOT NULL AND currency_code IS NOT NULL AND evidence_id IS NOT NULL)
    OR (amount_state NOT IN ('REPORTED','ESTIMATED') AND amount IS NULL)),
 CHECK(amount_state <> 'ESTIMATED' OR NULLIF(trim(estimation_method),'') IS NOT NULL),
 CHECK(amount_as_of IS NOT NULL OR amount_state NOT IN ('REPORTED','ESTIMATED'))
);
-- A disclosed transaction total is not the investor's ticket; use a distinct
-- flow kind and NEVER sum it with COMMITMENT/FUNDED/PROCEEDS.
-- Investor-class counts must use REVIEWED, date-valid classification history,
-- not entity_kind, geography, fund domicile, or co-investment membership.
CREATE INDEX IF NOT EXISTS gsi_event_investee_date_idx ON gsi_cap_private.investment_events(investee_id,announced_on);
CREATE INDEX IF NOT EXISTS gsi_participant_investor_idx ON gsi_cap_private.investment_participants(investor_entity_id);
CREATE INDEX IF NOT EXISTS gsi_flows_event_kind_idx ON gsi_cap_private.participant_capital_flows(event_id,flow_kind);
REVOKE ALL ON ALL TABLES IN SCHEMA gsi_cap_private FROM PUBLIC,anon,authenticated;
ALTER TABLE gsi_cap_private.investment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gsi_cap_private.investment_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE gsi_cap_private.participant_capital_flows ENABLE ROW LEVEL SECURITY;
COMMIT;
