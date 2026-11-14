-- GSI Capital Intelligence: PRIVATE point-in-time investee research extension.
-- UNAPPLIED MIGRATION. Run only after reviewing project access and backups.
-- Never modifies public.gsi_master_full (locked 67-field research master).
-- Existing 445 base records and Mubadala profile remain unchanged.
-- No real/company confidential data is inserted by this migration.
BEGIN;
CREATE SCHEMA IF NOT EXISTS gsi_cap_private;
REVOKE ALL ON SCHEMA gsi_cap_private FROM PUBLIC, anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA gsi_cap_private REVOKE ALL ON TABLES FROM PUBLIC, anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA gsi_cap_private REVOKE ALL ON SEQUENCES FROM PUBLIC, anon, authenticated;

CREATE TABLE IF NOT EXISTS gsi_cap_private.investee_entities (
  investee_id text PRIMARY KEY,
  legal_name text NOT NULL,
  domicile_country text,
  entity_type text,
  parent_investee_id text REFERENCES gsi_cap_private.investee_entities(investee_id),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS gsi_cap_private.investor_vehicles (
  vehicle_id text PRIMARY KEY,
  legal_name text NOT NULL,
  reported_parent_group text,
  legal_parent_vehicle_id text REFERENCES gsi_cap_private.investor_vehicles(vehicle_id),
  verification_state text NOT NULL DEFAULT 'UNREVIEWED',
  CONSTRAINT vehicle_review_valid CHECK(verification_state IN ('UNREVIEWED','REVIEW_IN_PROGRESS','REVIEWED'))
);
CREATE TABLE IF NOT EXISTS gsi_cap_private.master_record_links (
  master_record_id text NOT NULL,
  master_source_version text NOT NULL,
  investee_id text REFERENCES gsi_cap_private.investee_entities(investee_id),
  vehicle_id text REFERENCES gsi_cap_private.investor_vehicles(vehicle_id),
  link_type text NOT NULL,
  review_state text NOT NULL DEFAULT 'UNREVIEWED',
  evidence_note text,
  PRIMARY KEY(master_record_id,master_source_version,link_type),
  CONSTRAINT link_review_valid CHECK(review_state IN ('UNREVIEWED','REVIEW_IN_PROGRESS','REVIEWED')),
  CONSTRAINT link_type_valid CHECK(link_type IN ('DIRECT_INVESTMENT','FUND_COMMITMENT','PARTNERSHIP','DEBT','POLICY','INTRAGROUP','OTHER'))
);
-- Master record identifiers link back to the full public research master logically;
-- no hard foreign-key dependency on an evolving master test/seed version.
CREATE TABLE IF NOT EXISTS gsi_cap_private.evidence_sources (
  evidence_id text PRIMARY KEY,
  source_url text,
  publisher text NOT NULL,
  source_title text NOT NULL,
  source_type text NOT NULL,
  published_on date,
  retrieved_on date,
  currency_original text,
  evidence_grade text,
  data_access_level text NOT NULL DEFAULT 'INTERNAL',
  CONSTRAINT evidence_access_valid CHECK(data_access_level IN ('INTERNAL','CONFIDENTIAL','RESTRICTED')),
  CONSTRAINT evidence_location CHECK(source_url IS NOT NULL OR source_type = 'PRIVATE_DOCUMENT')
);
CREATE TABLE IF NOT EXISTS gsi_cap_private.investee_snapshots (
  snapshot_id text PRIMARY KEY,
  master_record_id text NOT NULL,
  master_source_version text NOT NULL,
  investee_id text NOT NULL REFERENCES gsi_cap_private.investee_entities(investee_id),
  investing_vehicle_id text REFERENCES gsi_cap_private.investor_vehicles(vehicle_id),
  event_family text NOT NULL,
  announcement_date date NOT NULL,
  financial_as_of date,
  financial_period_end date,
  accounting_basis text,
  ownership_type text,
  profitability_status text,
  business_model text,
  company_stage text,
  headquarter_country text,
  data_available_by_announcement boolean NOT NULL DEFAULT false,
  review_state text NOT NULL DEFAULT 'UNREVIEWED',
  snapshot_version integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT snapshot_review_valid CHECK(review_state IN ('UNREVIEWED','REVIEW_IN_PROGRESS','REVIEWED')),
  CONSTRAINT snapshot_version_positive CHECK(snapshot_version >= 1),
  CONSTRAINT point_in_time_dates CHECK(financial_as_of IS NULL OR financial_as_of <= announcement_date),
  CONSTRAINT period_end_dates CHECK(financial_period_end IS NULL OR financial_period_end <= announcement_date),
  UNIQUE(master_record_id,master_source_version,investee_id,snapshot_version)
);
CREATE TABLE IF NOT EXISTS gsi_cap_private.snapshot_metrics (
  metric_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  snapshot_id text NOT NULL REFERENCES gsi_cap_private.investee_snapshots(snapshot_id),
  metric_key text NOT NULL,
  metric_value numeric,
  value_unit text,
  original_currency text,
  period_start date,
  period_end date,
  state text NOT NULL,
  estimation_method text,
  accounting_basis text,
  evidence_id text REFERENCES gsi_cap_private.evidence_sources(evidence_id),
  availability_at_announcement text NOT NULL DEFAULT 'UNKNOWN',
  note text,
  CONSTRAINT metric_state_valid CHECK(state IN ('REPORTED','ESTIMATED','NOT_DISCLOSED','NOT_AVAILABLE','NOT_APPLICABLE')),
  CONSTRAINT metric_value_valid CHECK (
    (state IN ('REPORTED','ESTIMATED') AND metric_value IS NOT NULL AND evidence_id IS NOT NULL AND period_end IS NOT NULL)
    OR (state NOT IN ('REPORTED','ESTIMATED') AND metric_value IS NULL)
  ),
  CONSTRAINT estimates_explained CHECK(state <> 'ESTIMATED' OR estimation_method IS NOT NULL),
  CONSTRAINT metric_availability_valid CHECK(availability_at_announcement IN ('CONTEMPORANEOUS','LATER_DISCLOSURE','UNKNOWN')),
  UNIQUE(snapshot_id,metric_key,period_end)
);
CREATE TABLE IF NOT EXISTS gsi_cap_private.snapshot_ownership (
  ownership_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  snapshot_id text NOT NULL REFERENCES gsi_cap_private.investee_snapshots(snapshot_id),
  owner_name text,
  owner_category text NOT NULL,
  ownership_percent numeric,
  disclosure_state text NOT NULL,
  voting_control text,
  governance_rights text,
  evidence_id text REFERENCES gsi_cap_private.evidence_sources(evidence_id),
  CONSTRAINT ownership_pct_bounds CHECK(ownership_percent IS NULL OR (ownership_percent >= 0 AND ownership_percent <= 100)),
  CONSTRAINT ownership_disclosure_valid CHECK(disclosure_state IN ('REPORTED','ESTIMATED','NOT_DISCLOSED','NOT_AVAILABLE')),
  CONSTRAINT ownership_provenance CHECK(disclosure_state NOT IN ('REPORTED','ESTIMATED') OR evidence_id IS NOT NULL)
);
CREATE TABLE IF NOT EXISTS gsi_cap_private.snapshot_markets (
  snapshot_id text NOT NULL REFERENCES gsi_cap_private.investee_snapshots(snapshot_id),
  country_code text NOT NULL,
  market_role text NOT NULL,
  evidence_id text REFERENCES gsi_cap_private.evidence_sources(evidence_id),
  PRIMARY KEY(snapshot_id,country_code,market_role),
  CONSTRAINT market_role_valid CHECK(market_role IN ('OPERATING','HEADQUARTERS','REVENUE','TARGET','ASSET_LOCATION'))
);
CREATE TABLE IF NOT EXISTS gsi_cap_private.snapshot_transaction_terms (
  snapshot_id text PRIMARY KEY REFERENCES gsi_cap_private.investee_snapshots(snapshot_id),
  instrument text,
  investor_specific_amount numeric,
  investor_currency text,
  total_transaction_value numeric,
  transaction_currency text,
  stake_pct numeric,
  use_of_proceeds text,
  co_investors text[],
  transaction_status text,
  evidence_id text REFERENCES gsi_cap_private.evidence_sources(evidence_id),
  CONSTRAINT investor_amount_nonnegative CHECK(investor_specific_amount IS NULL OR investor_specific_amount >= 0),
  CONSTRAINT transaction_value_nonnegative CHECK(total_transaction_value IS NULL OR total_transaction_value >= 0),
  CONSTRAINT stake_bounds CHECK(stake_pct IS NULL OR (stake_pct >= 0 AND stake_pct <= 100))
);
CREATE TABLE IF NOT EXISTS gsi_cap_private.entity_variant_reviews (
  review_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  master_record_id text NOT NULL,
  original_investor_group text NOT NULL,
  candidate_parent_group text,
  candidate_vehicle_id text REFERENCES gsi_cap_private.investor_vehicles(vehicle_id),
  mapping_type text NOT NULL DEFAULT 'PENDING',
  review_state text NOT NULL DEFAULT 'UNREVIEWED',
  evidence_id text REFERENCES gsi_cap_private.evidence_sources(evidence_id),
  analyst_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT mapping_type_valid CHECK(mapping_type IN ('PENDING','SUBSIDIARY','JOINT_VENTURE','CO_INVESTOR','AFFILIATE','UNRELATED','OTHER')),
  CONSTRAINT entity_variant_review_valid CHECK(review_state IN ('UNREVIEWED','REVIEW_IN_PROGRESS','REVIEWED'))
);
CREATE TABLE IF NOT EXISTS gsi_cap_private.research_review_events (
  event_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  object_type text NOT NULL,
  object_id text NOT NULL,
  action text NOT NULL,
  reviewer_id text,
  note text,
  recorded_at timestamptz NOT NULL DEFAULT now()
);
-- The new extension has no Data API grants, policies, views or publicly callable functions.
REVOKE ALL ON ALL TABLES IN SCHEMA gsi_cap_private FROM PUBLIC, anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA gsi_cap_private FROM PUBLIC, anon, authenticated;
DO $private_tables$
DECLARE table_name text;
BEGIN
  FOR table_name IN SELECT tablename FROM pg_tables WHERE schemaname = 'gsi_cap_private'
  LOOP
    EXECUTE format('ALTER TABLE gsi_cap_private.%I ENABLE ROW LEVEL SECURITY',table_name);
  END LOOP;
END
$private_tables$;
COMMIT;

-- Post-deployment verification, run separately:
-- SELECT count(*) FROM information_schema.tables WHERE table_schema='gsi_cap_private';
-- SELECT has_schema_privilege('anon','gsi_cap_private','USAGE'),has_schema_privilege('authenticated','gsi_cap_private','USAGE');
-- SELECT count(*) FROM public.gsi_master_full; -- expected not to change
