-- GSI capital intelligence: read-only preflight for PRIVATE research schema.
-- Run after applying the two reviewed migrations to a disposable/staging PostgreSQL database.
-- Does not create tables, alter data, or grant access. Raises errors on failed gates.
-- Expected order: capital_intelligence_snapshots_private.sql,
-- capital_intelligence_private_fund_taxonomy.sql.
DO $qa$
DECLARE
  missing text;
  exposed text;
  invalid_count bigint;
BEGIN
  SELECT string_agg(required, ', ' ORDER BY required) INTO missing
  FROM (VALUES
    ('investee_entities'),('investor_vehicles'),('evidence_sources'),
    ('investee_snapshots'),('snapshot_metrics'),('snapshot_ownership'),
    ('snapshot_transaction_terms'),('master_record_links'),
    ('investor_entities'),('investor_classification_history'),
    ('investment_manager_fund_links'),('vehicle_entity_mappings')
  ) AS req(required)
  WHERE to_regclass(format('gsi_cap_private.%I',req.required)) IS NULL;
  IF missing IS NOT NULL THEN
    RAISE EXCEPTION 'GSI private schema missing required tables: %', missing;
  END IF;

  SELECT string_agg(c.relname, ', ' ORDER BY c.relname) INTO missing
  FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
  WHERE n.nspname='gsi_cap_private' AND c.relkind IN ('r','p')
    AND NOT c.relrowsecurity;
  IF missing IS NOT NULL THEN
    RAISE EXCEPTION 'GSI private tables missing row-level security: %', missing;
  END IF;

  SELECT string_agg(p.grantee::text || ':' || p.privilege_type, ', ')
  INTO exposed
  FROM information_schema.role_table_grants p
  WHERE p.table_schema='gsi_cap_private'
    AND p.grantee IN ('PUBLIC','anon','authenticated');
  IF exposed IS NOT NULL THEN
    RAISE EXCEPTION 'GSI private tables expose grants: %', exposed;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_namespace n
    WHERE n.nspname='gsi_cap_private'
      AND (EXISTS (SELECT 1 FROM aclexplode(COALESCE(n.nspacl,acldefault('n',n.nspowner))) a WHERE a.grantee=0 AND a.privilege_type='USAGE')
        OR (EXISTS (SELECT 1 FROM pg_roles WHERE rolname='anon') AND has_schema_privilege('anon','gsi_cap_private','USAGE'))
        OR (EXISTS (SELECT 1 FROM pg_roles WHERE rolname='authenticated') AND has_schema_privilege('authenticated','gsi_cap_private','USAGE')))
  ) THEN
    RAISE EXCEPTION 'GSI private schema accessible to public/API roles';
  END IF;

  SELECT count(*) INTO invalid_count
  FROM gsi_cap_private.investor_entities e
  WHERE e.review_state='REVIEWED'
    AND (e.source_evidence_id IS NULL OR e.verified_as_of IS NULL);
  IF invalid_count > 0 THEN
    RAISE EXCEPTION 'Reviewed investor classifications lack evidence: %',invalid_count;
  END IF;

  SELECT count(*) INTO invalid_count
  FROM gsi_cap_private.investor_classification_history h
  JOIN gsi_cap_private.investor_classification_history other
    ON h.investor_entity_id=other.investor_entity_id
   AND h.classification_id<other.classification_id
   AND h.review_state='REVIEWED' AND other.review_state='REVIEWED'
   AND daterange(h.effective_from,h.effective_to,'[]') && daterange(other.effective_from,other.effective_to,'[]')
  WHERE h.investor_class<>other.investor_class;
  IF invalid_count>0 THEN
    RAISE EXCEPTION 'Overlapping conflicting reviewed investor classes: %',invalid_count;
  END IF;

  SELECT count(*) INTO invalid_count
  FROM gsi_cap_private.snapshot_metrics m
  JOIN gsi_cap_private.investee_snapshots s ON s.snapshot_id=m.snapshot_id
  WHERE m.state IN ('REPORTED','ESTIMATED')
    AND (m.evidence_id IS NULL OR m.period_end IS NULL
      OR m.period_end > s.announcement_date);
  IF invalid_count>0 THEN
    RAISE EXCEPTION 'Invalid reported/estimated point-in-time metrics: %',invalid_count;
  END IF;

  RAISE NOTICE 'PASS: GSI private schema RLS, access, evidence and point-in-time preflight';
END
$qa$;

-- Review-only exception queues (not assertions): missing classification and
-- overlapping date windows must be manually investigated before release.
SELECT e.investor_entity_id,e.legal_name,e.entity_kind,e.gulf_connection_type
FROM gsi_cap_private.investor_entities e
WHERE NOT EXISTS (
 SELECT 1 FROM gsi_cap_private.investor_classification_history h
 WHERE h.investor_entity_id=e.investor_entity_id AND h.review_state='REVIEWED'
)
ORDER BY e.investor_entity_id;

SELECT e.investor_entity_id,e.legal_name,e.review_state
FROM gsi_cap_private.investor_entities e
WHERE e.gulf_connection_type='UNVERIFIED'
ORDER BY e.investor_entity_id;
