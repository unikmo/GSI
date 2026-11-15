-- GSI private consortium and co-investor graph extension.
-- UNAPPLIED. Depends on capital_intelligence_snapshots_private.sql.
-- No modifications to the locked 67-field research master or public schema.
BEGIN;
CREATE SCHEMA IF NOT EXISTS gsi_cap_private;
REVOKE ALL ON SCHEMA gsi_cap_private FROM PUBLIC, anon, authenticated;

CREATE TABLE IF NOT EXISTS gsi_cap_private.deal_groups (
  deal_group_id text PRIMARY KEY,
  name text NOT NULL,
  master_record_id text,
  master_source_version text,
  investee_id text REFERENCES gsi_cap_private.investee_entities(investee_id),
  consortium_type text NOT NULL DEFAULT 'OTHER',
  announcement_date date,
  agreement_date date,
  completion_date date,
  lifecycle_state text NOT NULL DEFAULT 'UNVERIFIED',
  description text,
  lead_evidence_id text REFERENCES gsi_cap_private.evidence_sources(evidence_id),
  review_state text NOT NULL DEFAULT 'UNREVIEWED',
  CONSTRAINT group_type_valid CHECK (consortium_type IN ('ACQUISITION_CONSORTIUM','FUND_SYNDICATE','CO_INVESTMENT','JOINT_VENTURE','LENDING_SYNDICATE','OTHER')),
  CONSTRAINT group_lifecycle_valid CHECK (lifecycle_state IN ('PROPOSED','ANNOUNCED','SIGNED','COMPLETED','CANCELLED','UNVERIFIED')),
  CONSTRAINT group_review_valid CHECK (review_state IN ('UNREVIEWED','REVIEW_IN_PROGRESS','REVIEWED'))
);

CREATE TABLE IF NOT EXISTS gsi_cap_private.deal_group_members (
  group_member_id text PRIMARY KEY,
  deal_group_id text NOT NULL REFERENCES gsi_cap_private.deal_groups(deal_group_id),
  member_name text NOT NULL,
  member_vehicle_id text REFERENCES gsi_cap_private.investor_vehicles(vehicle_id),
  member_category text NOT NULL DEFAULT 'UNKNOWN',
  participation_role text NOT NULL,
  involvement_state text NOT NULL DEFAULT 'REPORTED',
  stake_percent numeric,
  amount_commitment numeric,
  commitment_currency text,
  amount_funded numeric,
  funded_currency text,
  amount_basis text,
  stage_date date,
  joined_on date,
  exited_on date,
  evidence_id text REFERENCES gsi_cap_private.evidence_sources(evidence_id),
  review_state text NOT NULL DEFAULT 'UNREVIEWED',
  review_note text,
  CONSTRAINT member_stake_bounds CHECK (stake_percent IS NULL OR stake_percent BETWEEN 0 AND 100),
  CONSTRAINT member_amounts_nonnegative CHECK ((amount_commitment IS NULL OR amount_commitment >= 0) AND (amount_funded IS NULL OR amount_funded >= 0)),
  CONSTRAINT member_funded_currency CHECK (amount_funded IS NULL OR funded_currency IS NOT NULL),
  CONSTRAINT member_commit_currency CHECK (amount_commitment IS NULL OR commitment_currency IS NOT NULL),
  CONSTRAINT member_date_order CHECK (exited_on IS NULL OR joined_on IS NULL OR exited_on >= joined_on),
  CONSTRAINT member_review_valid CHECK (review_state IN ('UNREVIEWED','REVIEW_IN_PROGRESS','REVIEWED')),
  CONSTRAINT member_state_valid CHECK (involvement_state IN ('PROPOSED','REPORTED','SIGNED','FUNDED','EXITED','UNVERIFIED')),
  CONSTRAINT member_category_valid CHECK (member_category IN ('GULF_SOVEREIGN','PRIVATE_EQUITY','PENSION','CORPORATE','BANK','GOVERNMENT','FOUNDER','OTHER','UNKNOWN'))
);

-- A consortium member may have multiple distinct, source-backed stages; avoid
-- collapsing a fund sponsor, GP, LP, arranger and capital-paying investor.
CREATE TABLE IF NOT EXISTS gsi_cap_private.deal_group_member_evidence (
  group_member_id text NOT NULL REFERENCES gsi_cap_private.deal_group_members(group_member_id),
  evidence_id text NOT NULL REFERENCES gsi_cap_private.evidence_sources(evidence_id),
  claim_type text NOT NULL,
  statement_as_of date,
  evidence_note text,
  PRIMARY KEY (group_member_id, evidence_id, claim_type)
);

CREATE INDEX IF NOT EXISTS gsi_deal_group_master_idx ON gsi_cap_private.deal_groups(master_record_id, master_source_version);
CREATE INDEX IF NOT EXISTS gsi_group_member_group_idx ON gsi_cap_private.deal_group_members(deal_group_id);
CREATE INDEX IF NOT EXISTS gsi_group_member_vehicle_idx ON gsi_cap_private.deal_group_members(member_vehicle_id);

REVOKE ALL ON ALL TABLES IN SCHEMA gsi_cap_private FROM PUBLIC, anon, authenticated;
ALTER TABLE gsi_cap_private.deal_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE gsi_cap_private.deal_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE gsi_cap_private.deal_group_member_evidence ENABLE ROW LEVEL SECURITY;
COMMIT;

-- Deploy only in an approved controlled private environment following migration,
-- privileges, row level security, linkage, and backup review.
