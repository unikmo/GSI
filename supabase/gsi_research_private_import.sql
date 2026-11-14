-- GSI research import staging: additive and private. No public research master modification.
-- Apply only to the GSI-owned Supabase project, after checking project identity and backups.
BEGIN;
CREATE SCHEMA IF NOT EXISTS gsi_research_private;
REVOKE ALL ON SCHEMA gsi_research_private FROM PUBLIC, anon, authenticated;
CREATE TABLE IF NOT EXISTS gsi_research_private.master_research_import (
  master_record_id text PRIMARY KEY,
  source_version text NOT NULL,
  source_claim jsonb NOT NULL,
  evidence_state text NOT NULL DEFAULT 'UNREVIEWED_MASTER',
  imported_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT evidence_state_valid CHECK (evidence_state IN ('UNREVIEWED_MASTER','REVIEW_IN_PROGRESS','SOURCE_CLAIMS_CHECKED','DECISION_GRADE'))
);
CREATE TABLE IF NOT EXISTS gsi_research_private.transaction_dossier_import (
  master_record_id text PRIMARY KEY REFERENCES gsi_research_private.master_research_import(master_record_id),
  dossier_payload jsonb NOT NULL,
  source_file text NOT NULL,
  evidence_state text NOT NULL DEFAULT 'SOURCE_CLAIMS_CHECKED',
  independently_certified boolean NOT NULL DEFAULT false,
  imported_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT dossier_state_valid CHECK(evidence_state IN ('REVIEW_IN_PROGRESS','SOURCE_CLAIMS_CHECKED','DECISION_GRADE')),
  CONSTRAINT no_false_certification CHECK (independently_certified = false OR evidence_state = 'DECISION_GRADE')
);
CREATE TABLE IF NOT EXISTS gsi_research_private.research_priority_queue (
  master_record_id text PRIMARY KEY REFERENCES gsi_research_private.master_research_import(master_record_id),
  queue_payload jsonb NOT NULL,
  evidence_state text NOT NULL DEFAULT 'UNREVIEWED',
  imported_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT queue_state_valid CHECK (evidence_state IN ('UNREVIEWED','REVIEW_IN_PROGRESS','SOURCE_CLAIMS_CHECKED'))
);
CREATE TABLE IF NOT EXISTS gsi_research_private.research_import_manifest (
  import_id text PRIMARY KEY,
  expected_master_count integer NOT NULL,
  imported_master_count integer NOT NULL,
  expected_dossier_count integer NOT NULL,
  imported_dossier_count integer NOT NULL,
  imported_queue_count integer NOT NULL DEFAULT 0,
  imported_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT expected_counts CHECK (expected_master_count=445 AND expected_dossier_count >= 0)
);
ALTER TABLE gsi_research_private.master_research_import ENABLE ROW LEVEL SECURITY;
ALTER TABLE gsi_research_private.transaction_dossier_import ENABLE ROW LEVEL SECURITY;
ALTER TABLE gsi_research_private.research_priority_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE gsi_research_private.research_import_manifest ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON ALL TABLES IN SCHEMA gsi_research_private FROM PUBLIC, anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA gsi_research_private REVOKE ALL ON TABLES FROM PUBLIC, anon, authenticated;
COMMIT;
-- Post-import: SELECT count(*) FROM gsi_research_private.master_research_import; -- 445
-- Check no anon/authenticated USAGE to the schema and no public grants to the tables.
