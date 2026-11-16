-- GSI sovereign/private fund taxonomy QA. READ ONLY. Run after private snapshots
-- and private fund taxonomy migrations in a protected staging database.
-- No writes, no inferred ownership, no automatic reclassification.
BEGIN TRANSACTION READ ONLY;
SELECT 'investor_classification_missing_reviewed_evidence' AS check_name, count(*) AS findings
FROM gsi_cap_private.investor_classification_history c
WHERE c.review_state = 'REVIEWED' AND
      (c.evidence_id IS NULL OR c.effective_from IS NULL OR c.investor_class = 'UNKNOWN')
UNION ALL
SELECT 'reviewed_investor_without_provenance', count(*)
FROM gsi_cap_private.investor_entities e
WHERE e.review_state = 'REVIEWED'
  AND (e.source_evidence_id IS NULL OR e.verified_as_of IS NULL)
UNION ALL
SELECT 'fund_manager_self_link', count(*)
FROM gsi_cap_private.investment_manager_fund_links l
WHERE l.manager_entity_id = l.fund_entity_id
UNION ALL
SELECT 'invalid_manager_fund_dates', count(*)
FROM gsi_cap_private.investment_manager_fund_links l
WHERE l.valid_from IS NOT NULL AND l.valid_to IS NOT NULL AND l.valid_to < l.valid_from
UNION ALL
SELECT 'overlapping_conflicting_reviewed_classes', count(*)
FROM gsi_cap_private.investor_classification_history a
JOIN gsi_cap_private.investor_classification_history b
  ON a.investor_entity_id = b.investor_entity_id
 AND a.classification_id < b.classification_id
WHERE a.review_state = 'REVIEWED' AND b.review_state = 'REVIEWED'
  AND a.investor_class <> b.investor_class
  AND daterange(a.effective_from, a.effective_to, '[]')
      && daterange(b.effective_from, b.effective_to, '[]')
UNION ALL
SELECT 'reviewed_private_without_gulf_basis', count(*)
FROM gsi_cap_private.investor_entities e
WHERE e.review_state = 'REVIEWED'
 AND e.entity_kind IN ('PRIVATE_INVESTMENT_MANAGER','PRIVATE_EQUITY_FUND','VENTURE_CAPITAL_FUND','PRIVATE_CREDIT_FUND','PRIVATE_HOLDING_COMPANY','FAMILY_OFFICE')
 AND e.gulf_connection_type IN ('NONE','UNVERIFIED','GULF_MANDATE_ONLY')
UNION ALL
SELECT 'reviewed_vehicle_mapping_without_evidence', count(*)
FROM gsi_cap_private.vehicle_entity_mappings m
WHERE m.review_state = 'REVIEWED' AND m.evidence_id IS NULL
UNION ALL
SELECT 'reviewed_fund_links_missing_dates', count(*)
FROM gsi_cap_private.investment_manager_fund_links l
WHERE l.review_state = 'REVIEWED' AND l.valid_from IS NULL;

-- Separate sovereign and private entities: count distinct legal investor entities
-- with reviewed, evidence-backed, non-overlapping current classifications.
-- Never count a manager, fund and SPV as a single economic investor automatically.
WITH current_classes AS (
 SELECT DISTINCT ON (c.investor_entity_id)
        c.investor_entity_id, c.investor_class
 FROM gsi_cap_private.investor_classification_history c
 WHERE c.review_state = 'REVIEWED'
   AND c.effective_from <= CURRENT_DATE
   AND (c.effective_to IS NULL OR c.effective_to >= CURRENT_DATE)
 ORDER BY c.investor_entity_id, c.effective_from DESC, c.classification_id
)
SELECT investor_class, count(*) AS distinct_verified_legal_entities
FROM current_classes
GROUP BY investor_class ORDER BY investor_class;
ROLLBACK;
