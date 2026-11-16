-- GSI private research intake staging: research provenance is not certified master data.
-- UNAPPLIED. Requires previously reviewed gsi_cap_private schema and access checks.
BEGIN;
CREATE SCHEMA IF NOT EXISTS gsi_cap_private;
REVOKE ALL ON SCHEMA gsi_cap_private FROM PUBLIC, anon, authenticated;
CREATE TABLE IF NOT EXISTS gsi_cap_private.research_intake_batches (
 batch_id text PRIMARY KEY,
 source_dataset text NOT NULL,
 captured_as_of date NOT NULL,
 status text NOT NULL DEFAULT 'UNREVIEWED'
  CHECK(status IN ('UNREVIEWED','UNDER_REVIEW','APPROVED_FOR_NORMALISATION','REJECTED')),
 source_commit_sha text,
 imported_at timestamptz NOT NULL DEFAULT now(),
 CHECK(status <> 'APPROVED_FOR_NORMALISATION' OR source_commit_sha IS NOT NULL)
);
CREATE TABLE IF NOT EXISTS gsi_cap_private.research_intake_records (
 batch_id text NOT NULL REFERENCES gsi_cap_private.research_intake_batches(batch_id),
 intake_id text NOT NULL,
 record_kind text NOT NULL CHECK(record_kind IN ('MANAGER','FUND','TRANSACTION','EXIT','FUND_COMMITMENT')),
 payload jsonb NOT NULL,
 evidence_state text NOT NULL DEFAULT 'SOURCE_LINKED_UNREVIEWED'
  CHECK(evidence_state IN ('SOURCE_LINKED_UNREVIEWED','SOURCE_REVIEW_IN_PROGRESS','SOURCE_REVIEWED','REJECTED')),
 canonical_master_id text,
 canonical_master_version text,
 imported_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(batch_id,intake_id),
 CHECK(jsonb_typeof(payload)='object'),
 CHECK((canonical_master_id IS NULL AND canonical_master_version IS NULL)
    OR (canonical_master_id IS NOT NULL AND canonical_master_version IS NOT NULL))
);
CREATE INDEX IF NOT EXISTS gsi_intake_kind_state_idx ON gsi_cap_private.research_intake_records(record_kind,evidence_state);
REVOKE ALL ON ALL TABLES IN SCHEMA gsi_cap_private FROM PUBLIC, anon, authenticated;
ALTER TABLE gsi_cap_private.research_intake_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE gsi_cap_private.research_intake_records ENABLE ROW LEVEL SECURITY;
COMMIT;
-- Stage raw dated claims first; only approved, source-backed records should be
-- separately normalised into investor/vehicle/transaction/adviser tables.
