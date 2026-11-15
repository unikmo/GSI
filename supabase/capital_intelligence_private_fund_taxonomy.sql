-- GSI private investor taxonomy. UNAPPLIED additive migration.
-- Depends on capital_intelligence_snapshots_private.sql; never edits gsi_master_full.
-- Do not infer state ownership from Gulf domicile, PE co-investment, or manager brand.
BEGIN;
CREATE SCHEMA IF NOT EXISTS gsi_cap_private;
REVOKE ALL ON SCHEMA gsi_cap_private FROM PUBLIC, anon, authenticated;

CREATE TABLE IF NOT EXISTS gsi_cap_private.investor_entities (
 investor_entity_id text PRIMARY KEY,
 legal_name text NOT NULL,
 entity_kind text NOT NULL,
 domicile_country text,
 gulf_connection_type text NOT NULL DEFAULT 'UNVERIFIED',
 ultimate_parent_investor_entity_id text REFERENCES gsi_cap_private.investor_entities(investor_entity_id),
 regulator_or_registry_id text,
 website text,
 source_evidence_id text REFERENCES gsi_cap_private.evidence_sources(evidence_id),
 verified_as_of date,
 review_state text NOT NULL DEFAULT 'UNREVIEWED',
 notes text,
 CONSTRAINT investor_entity_kind_valid CHECK(entity_kind IN ('SOVEREIGN_WEALTH_FUND','STATE_OWNED_INVESTMENT_COMPANY','GOVERNMENT_PENSION','PRIVATE_INVESTMENT_MANAGER','PRIVATE_EQUITY_FUND','VENTURE_CAPITAL_FUND','PRIVATE_CREDIT_FUND','PRIVATE_HOLDING_COMPANY','FAMILY_OFFICE','CO_INVESTMENT_VEHICLE','SPV','OTHER')),
 CONSTRAINT investor_gulf_type_valid CHECK(gulf_connection_type IN ('GULF_DOMICILED','GULF_ULTIMATE_OWNER','GULF_OPERATING_HEADQUARTERS','GULF_MANDATE_ONLY','NONE','UNVERIFIED')),
 CONSTRAINT investor_review_valid CHECK(review_state IN ('UNREVIEWED','REVIEW_IN_PROGRESS','REVIEWED')),
 CONSTRAINT investor_taxonomy_provenance CHECK(review_state <> 'REVIEWED' OR (source_evidence_id IS NOT NULL AND verified_as_of IS NOT NULL))
);

CREATE TABLE IF NOT EXISTS gsi_cap_private.investor_classification_history (
 classification_id text PRIMARY KEY,
 investor_entity_id text NOT NULL REFERENCES gsi_cap_private.investor_entities(investor_entity_id),
 investor_class text NOT NULL,
 effective_from date,
 effective_to date,
 evidence_id text NOT NULL REFERENCES gsi_cap_private.evidence_sources(evidence_id),
 classification_note text,
 review_state text NOT NULL DEFAULT 'UNREVIEWED',
 CONSTRAINT investor_class_valid CHECK(investor_class IN ('SOVEREIGN','STATE_OWNED','PRIVATE','MIXED_OWNERSHIP','UNKNOWN')),
 CONSTRAINT investor_class_dates_valid CHECK(effective_to IS NULL OR effective_from IS NULL OR effective_to >= effective_from),
 CONSTRAINT investor_class_review_valid CHECK(review_state IN ('UNREVIEWED','REVIEW_IN_PROGRESS','REVIEWED'))
);

CREATE TABLE IF NOT EXISTS gsi_cap_private.investment_manager_fund_links (
 manager_fund_link_id text PRIMARY KEY,
 manager_entity_id text NOT NULL REFERENCES gsi_cap_private.investor_entities(investor_entity_id),
 fund_entity_id text NOT NULL REFERENCES gsi_cap_private.investor_entities(investor_entity_id),
 link_role text NOT NULL,
 valid_from date,
 valid_to date,
 evidence_id text NOT NULL REFERENCES gsi_cap_private.evidence_sources(evidence_id),
 review_state text NOT NULL DEFAULT 'UNREVIEWED',
 CONSTRAINT manager_fund_dates_valid CHECK(valid_to IS NULL OR valid_from IS NULL OR valid_to >= valid_from),
 CONSTRAINT manager_fund_role_valid CHECK(link_role IN ('MANAGER','GENERAL_PARTNER','ADVISER','LIMITED_PARTNER','SPONSOR','CONTROLLING_OWNER','OTHER')),
 CONSTRAINT manager_fund_review_valid CHECK(review_state IN ('UNREVIEWED','REVIEW_IN_PROGRESS','REVIEWED')),
 CONSTRAINT manager_fund_distinct CHECK(manager_entity_id <> fund_entity_id)
);

-- Vehicle resolution is evidence-led; never silently equate a branded manager
-- with the legal fund, SPV, LP, sovereign sponsor or investing entity.
CREATE TABLE IF NOT EXISTS gsi_cap_private.vehicle_entity_mappings (
 vehicle_id text NOT NULL REFERENCES gsi_cap_private.investor_vehicles(vehicle_id),
 investor_entity_id text NOT NULL REFERENCES gsi_cap_private.investor_entities(investor_entity_id),
 relationship_type text NOT NULL,
 evidence_id text REFERENCES gsi_cap_private.evidence_sources(evidence_id),
 review_state text NOT NULL DEFAULT 'UNREVIEWED',
 PRIMARY KEY(vehicle_id,investor_entity_id,relationship_type),
 CONSTRAINT vehicle_entity_relation_valid CHECK(relationship_type IN ('LEGAL_ENTITY','MANAGED_BY','SPONSORED_BY','AFFILIATE_OF','CO_INVESTOR','REPORTED_GROUP','OTHER')),
 CONSTRAINT vehicle_entity_review_valid CHECK(review_state IN ('UNREVIEWED','REVIEW_IN_PROGRESS','REVIEWED'))
);

CREATE INDEX IF NOT EXISTS gsi_investor_kind_idx ON gsi_cap_private.investor_entities(entity_kind);
CREATE INDEX IF NOT EXISTS gsi_investor_class_idx ON gsi_cap_private.investor_classification_history(investor_entity_id,effective_from);
CREATE INDEX IF NOT EXISTS gsi_manager_fund_idx ON gsi_cap_private.investment_manager_fund_links(fund_entity_id);

REVOKE ALL ON ALL TABLES IN SCHEMA gsi_cap_private FROM PUBLIC, anon, authenticated;
ALTER TABLE gsi_cap_private.investor_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE gsi_cap_private.investor_classification_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE gsi_cap_private.investment_manager_fund_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE gsi_cap_private.vehicle_entity_mappings ENABLE ROW LEVEL SECURITY;
COMMIT;
