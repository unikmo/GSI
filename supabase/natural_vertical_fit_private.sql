-- OPTIONAL future migration. DO NOT execute as part of the current branch.
-- This does not modify the locked GSI v4.9 research schema or seed.
-- Private, non-Data-API schema, no public policies, no client access.
BEGIN;
CREATE SCHEMA IF NOT EXISTS gsi_fit_private;
REVOKE ALL ON SCHEMA gsi_fit_private FROM PUBLIC, anon, authenticated;
CREATE TABLE IF NOT EXISTS gsi_fit_private.opportunities (
  opportunity_id text PRIMARY KEY,
  input_payload jsonb NOT NULL,
  input_version text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS gsi_fit_private.assessment_runs (
  run_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id text NOT NULL REFERENCES gsi_fit_private.opportunities(opportunity_id),
  engine_version text NOT NULL,
  as_of_date date NOT NULL,
  result_payload jsonb NOT NULL,
  evidence_snapshot jsonb NOT NULL,
  research_state text NOT NULL DEFAULT 'UNREVIEWED',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT assessment_state_check CHECK (research_state IN ('UNREVIEWED','REVIEW_IN_PROGRESS','REVIEWED'))
);
CREATE TABLE IF NOT EXISTS gsi_fit_private.assessment_events (
  event_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  run_id uuid NOT NULL REFERENCES gsi_fit_private.assessment_runs(run_id),
  action text NOT NULL,
  event_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  recorded_at timestamptz NOT NULL DEFAULT now()
);
REVOKE ALL ON ALL TABLES IN SCHEMA gsi_fit_private FROM PUBLIC, anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA gsi_fit_private FROM PUBLIC, anon, authenticated;
ALTER TABLE gsi_fit_private.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE gsi_fit_private.assessment_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE gsi_fit_private.assessment_events ENABLE ROW LEVEL SECURITY;
-- No anon/authenticated policies. Access only through separately authorised backend roles.
COMMIT;
