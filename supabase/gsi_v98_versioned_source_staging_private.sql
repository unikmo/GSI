-- GSI v9.8 full research staging: preserves every source row and its version.
-- UNAPPLIED. Requires authenticated private admin access and verified backups.
-- Does not modify the existing public master or 445-row v9.6 staging table.
BEGIN;
CREATE SCHEMA IF NOT EXISTS gsi_research_private;
REVOKE ALL ON SCHEMA gsi_research_private FROM PUBLIC, anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA gsi_research_private REVOKE ALL ON TABLES FROM PUBLIC, anon, authenticated;
CREATE TABLE IF NOT EXISTS gsi_research_private.source_row_versions (
  source_version text NOT NULL,
  source_table text NOT NULL CHECK(source_table IN ('MASTER','LEDGER','SYNDICATE','CROSSWALK','HELD_CASE')),
  source_row_id text NOT NULL,
  source_position integer NOT NULL CHECK(source_position>0),
  source_payload jsonb NOT NULL,
  evidence_state text NOT NULL DEFAULT 'UNREVIEWED'
    CHECK(evidence_state IN ('UNREVIEWED','UNDER_REVIEW','SOURCE_CHECKED','REJECTED')),
  imported_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(source_version,source_table,source_row_id),
  UNIQUE(source_version,source_table,source_position),
  CHECK(jsonb_typeof(source_payload)='object')
);
CREATE TABLE IF NOT EXISTS gsi_research_private.source_batch_versions (
  batch_id text PRIMARY KEY,
  source_version text NOT NULL,
  declared_master integer NOT NULL,
  declared_ledger integer NOT NULL,
  declared_syndicate integer NOT NULL,
  declared_crosswalk integer NOT NULL,
  declared_held integer NOT NULL,
  record_state text NOT NULL DEFAULT 'UNREVIEWED'
    CHECK(record_state IN ('UNREVIEWED','UNDER_REVIEW','CERTIFIED')),
  source_commit_shas jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK(declared_master>0 AND declared_master=declared_crosswalk),
  CHECK(jsonb_typeof(source_commit_shas)='object')
);
CREATE INDEX IF NOT EXISTS gsi_version_rows_by_table ON gsi_research_private.source_row_versions(source_version,source_table);
REVOKE ALL ON ALL TABLES IN SCHEMA gsi_research_private FROM PUBLIC, anon, authenticated;
ALTER TABLE gsi_research_private.source_row_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gsi_research_private.source_batch_versions ENABLE ROW LEVEL SECURITY;
COMMIT;
-- Stage only. Separate analytical normalization must preserve evidence states
-- and investor-specific cash, counterparties and history of economic stages.
