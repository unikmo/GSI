-- GSI strategy / macro / divestment evidence extension, for private research only.
-- UNAPPLIED. Dependency: capital_intelligence_snapshots_private.sql.
-- No master alteration, policy relaxation, publication or data seed.
BEGIN;
CREATE SCHEMA IF NOT EXISTS gsi_cap_private;
REVOKE ALL ON SCHEMA gsi_cap_private FROM PUBLIC, anon, authenticated;

CREATE TABLE IF NOT EXISTS gsi_cap_private.fund_strategy_versions (
 strategy_version_id text PRIMARY KEY,
 vehicle_id text REFERENCES gsi_cap_private.investor_vehicles(vehicle_id),
 declared_parent_group text NOT NULL,
 strategy_name text NOT NULL,
 published_on date NOT NULL,
 stated_effective_from date,
 stated_effective_to date,
 mandate_text text,
 sector_focus text[],
 region_focus text[],
 instrument_focus text[],
 risk_return_objective text,
 capital_allocation_framework text,
 sovereign_policy_link text,
 governance_context text,
 source_evidence_id text NOT NULL REFERENCES gsi_cap_private.evidence_sources(evidence_id),
 review_state text NOT NULL DEFAULT 'UNREVIEWED',
 CONSTRAINT fund_strategy_review CHECK(review_state IN ('UNREVIEWED','REVIEW_IN_PROGRESS','REVIEWED')),
 CONSTRAINT fund_strategy_date_order CHECK(stated_effective_to IS NULL OR stated_effective_from IS NULL OR stated_effective_to >= stated_effective_from)
);
CREATE TABLE IF NOT EXISTS gsi_cap_private.strategy_change_events (
 change_id text PRIMARY KEY,
 before_strategy_version_id text REFERENCES gsi_cap_private.fund_strategy_versions(strategy_version_id),
 after_strategy_version_id text NOT NULL REFERENCES gsi_cap_private.fund_strategy_versions(strategy_version_id),
 change_dimension text NOT NULL,
 change_description text NOT NULL,
 stated_reason text,
 reason_evidence_id text REFERENCES gsi_cap_private.evidence_sources(evidence_id),
 analyst_inference text,
 competing_explanations text[],
 evidence_state text NOT NULL DEFAULT 'UNVERIFIED',
 CONSTRAINT strategy_change_state CHECK(evidence_state IN ('DOCUMENTED','CORROBORATED','INFERRED','UNVERIFIED'))
);
CREATE TABLE IF NOT EXISTS gsi_cap_private.macro_political_observations (
 observation_id text PRIMARY KEY,
 affected_country text,
 affected_region text,
 indicator_or_event text NOT NULL,
 observation_type text NOT NULL,
 measure_value numeric,
 measure_unit text,
 observation_start date NOT NULL,
 observation_end date,
 known_by date NOT NULL,
 source_evidence_id text NOT NULL REFERENCES gsi_cap_private.evidence_sources(evidence_id),
 source_kind text NOT NULL,
 review_state text NOT NULL DEFAULT 'UNREVIEWED',
 CONSTRAINT macro_observation_dates CHECK(observation_end IS NULL OR observation_end >= observation_start),
 CONSTRAINT macro_known_by CHECK(known_by >= observation_start),
 CONSTRAINT macro_source_kind CHECK(source_kind IN ('OFFICIAL_STATISTICS','CENTRAL_BANK','REGULATORY_FILING','GOVERNMENT_POLICY','FUND_STATEMENT','INDEPENDENT_RESEARCH','OTHER')),
 CONSTRAINT macro_review_state CHECK(review_state IN ('UNREVIEWED','REVIEW_IN_PROGRESS','REVIEWED'))
);
CREATE TABLE IF NOT EXISTS gsi_cap_private.transaction_lifecycle_events (
 lifecycle_id text PRIMARY KEY,
 master_record_id text NOT NULL,
 master_source_version text NOT NULL,
 investee_id text REFERENCES gsi_cap_private.investee_entities(investee_id),
 vehicle_id text REFERENCES gsi_cap_private.investor_vehicles(vehicle_id),
 lifecycle_type text NOT NULL,
 effective_date date,
 announced_on date,
 stake_before_percent numeric,
 stake_after_percent numeric,
 gross_proceeds numeric,
 gross_proceeds_currency text,
 investor_specific_proceeds numeric,
 investor_proceeds_currency text,
 book_value_at_exit numeric,
 invested_cost_basis numeric,
 realised_gain_or_loss numeric,
 realised_irr_percent numeric,
 realised_moic numeric,
 methodology_note text,
 status text NOT NULL DEFAULT 'ANNOUNCED',
 source_evidence_id text NOT NULL REFERENCES gsi_cap_private.evidence_sources(evidence_id),
 review_state text NOT NULL DEFAULT 'UNREVIEWED',
 CONSTRAINT lifecycle_type_valid CHECK(lifecycle_type IN ('ENTRY','FOLLOW_ON','PARTIAL_DIVESTMENT','FULL_EXIT','SECONDARY_SALE','IPO_SELLDOWN','RECAPITALISATION','WRITE_DOWN','WRITE_OFF','TRANSFER','OTHER')),
 CONSTRAINT lifecycle_status_valid CHECK(status IN ('ANNOUNCED','SIGNED','REGULATORY_APPROVED','COMPLETED','CASH_SETTLED','UNVERIFIED')),
 CONSTRAINT lifecycle_review_valid CHECK(review_state IN ('UNREVIEWED','REVIEW_IN_PROGRESS','REVIEWED')),
 CONSTRAINT stake_before_bounds CHECK(stake_before_percent IS NULL OR stake_before_percent BETWEEN 0 AND 100),
 CONSTRAINT stake_after_bounds CHECK(stake_after_percent IS NULL OR stake_after_percent BETWEEN 0 AND 100),
 CONSTRAINT lifecycle_amount_bounds CHECK(gross_proceeds IS NULL OR gross_proceeds >= 0),
 CONSTRAINT lifecycle_proceeds_bounds CHECK(investor_specific_proceeds IS NULL OR investor_specific_proceeds >= 0),
 CONSTRAINT lifecycle_moic_bounds CHECK(realised_moic IS NULL OR realised_moic >= 0)
);
CREATE TABLE IF NOT EXISTS gsi_cap_private.transaction_strategy_assessments (
 assessment_id text PRIMARY KEY,
 master_record_id text NOT NULL,
 master_source_version text NOT NULL,
 strategy_version_id text REFERENCES gsi_cap_private.fund_strategy_versions(strategy_version_id),
 as_of_transaction_date date NOT NULL,
 observed_alignment text NOT NULL,
 supporting_evidence_ids text[] NOT NULL DEFAULT '{}',
 contradictory_evidence_ids text[] NOT NULL DEFAULT '{}',
 macro_observation_ids text[] NOT NULL DEFAULT '{}',
 analyst_analysis text,
 alternative_explanations text[],
 proposed_external_driver text,
 driver_confidence text NOT NULL DEFAULT 'UNKNOWN',
 research_state text NOT NULL DEFAULT 'UNREVIEWED',
 assessed_at timestamptz NOT NULL DEFAULT now(),
 CONSTRAINT alignment_valid CHECK(observed_alignment IN ('CONSISTENT','PARTIALLY_CONSISTENT','APPARENT_DEPARTURE','NOT_ASSESSABLE')),
 CONSTRAINT driver_confidence_valid CHECK(driver_confidence IN ('DIRECTLY_STATED','INFERRED','UNKNOWN')),
 CONSTRAINT alignment_review_valid CHECK(research_state IN ('UNREVIEWED','REVIEW_IN_PROGRESS','REVIEWED'))
);
CREATE TABLE IF NOT EXISTS gsi_cap_private.fund_clarification_questions (
 question_id text PRIMARY KEY,
 vehicle_id text REFERENCES gsi_cap_private.investor_vehicles(vehicle_id),
 master_record_id text,
 strategy_version_id text REFERENCES gsi_cap_private.fund_strategy_versions(strategy_version_id),
 evidence_gap text NOT NULL,
 precise_question text NOT NULL,
 source_evidence_ids text[] NOT NULL DEFAULT '{}',
 status text NOT NULL DEFAULT 'DRAFT_INTERNAL',
 reply_source_evidence_id text REFERENCES gsi_cap_private.evidence_sources(evidence_id),
 response_received_on date,
 attribution_permission text NOT NULL DEFAULT 'NOT_REQUESTED',
 reviewed_by text,
 CONSTRAINT clarification_state CHECK(status IN ('DRAFT_INTERNAL','APPROVED_TO_SEND','SENT','REPLIED','NO_RESPONSE','CLOSED')),
 CONSTRAINT attribution_state CHECK(attribution_permission IN ('NOT_REQUESTED','GRANTED','DENIED','UNKNOWN'))
);
REVOKE ALL ON ALL TABLES IN SCHEMA gsi_cap_private FROM PUBLIC, anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA gsi_cap_private FROM PUBLIC, anon, authenticated;
ALTER TABLE gsi_cap_private.fund_strategy_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gsi_cap_private.strategy_change_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gsi_cap_private.macro_political_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE gsi_cap_private.transaction_lifecycle_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gsi_cap_private.transaction_strategy_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE gsi_cap_private.fund_clarification_questions ENABLE ROW LEVEL SECURITY;
COMMIT;
