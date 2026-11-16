-- GSI private deal advisers, legal counsel and transaction services.
-- UNAPPLIED migration; depends on capital_intelligence_snapshots_private.sql
-- and capital_intelligence_participation_ledger_private.sql.
-- A law firm advising a deal is NOT a co-investor; an investee that happens to
-- provide legal services is NOT automatically a transaction adviser.
BEGIN;
CREATE SCHEMA IF NOT EXISTS gsi_cap_private;
REVOKE ALL ON SCHEMA gsi_cap_private FROM PUBLIC, anon, authenticated;

CREATE TABLE IF NOT EXISTS gsi_cap_private.professional_service_firms (
 firm_id text PRIMARY KEY,
 legal_name text NOT NULL,
 firm_type text NOT NULL CHECK (firm_type IN
  ('LAW_FIRM','INVESTMENT_BANK','ACCOUNTANCY','FINANCIAL_ADVISER',
   'CONSULTANT','TECHNICAL_ADVISER','OTHER')),
 domicile_country text,
 source_evidence_id text REFERENCES gsi_cap_private.evidence_sources(evidence_id),
 identity_review_state text NOT NULL DEFAULT 'UNREVIEWED'
  CHECK(identity_review_state IN ('UNREVIEWED','REVIEW_IN_PROGRESS','REVIEWED')),
 UNIQUE(legal_name,firm_type)
);

CREATE TABLE IF NOT EXISTS gsi_cap_private.transaction_adviser_engagements (
 engagement_id text PRIMARY KEY,
 event_id text NOT NULL REFERENCES gsi_cap_private.investment_events(event_id),
 firm_id text NOT NULL REFERENCES gsi_cap_private.professional_service_firms(firm_id),
 advice_type text NOT NULL CHECK (advice_type IN
  ('BUYER_LEGAL','SELLER_LEGAL','INVESTOR_LEGAL','INVESTEE_LEGAL',
   'DEBT_FINANCING_LEGAL','REGULATORY_LEGAL','TAX_LEGAL',
   'BUYER_FINANCIAL','SELLER_FINANCIAL','DUE_DILIGENCE',
   'ACCOUNTING','OTHER')),
 represented_party_name text NOT NULL,
 represented_investor_entity_id text REFERENCES gsi_cap_private.investor_entities(investor_entity_id),
 announced_on date,
 evidence_id text NOT NULL REFERENCES gsi_cap_private.evidence_sources(evidence_id),
 evidence_claim text NOT NULL,
 engagement_state text NOT NULL DEFAULT 'REPORTED'
  CHECK(engagement_state IN ('REPORTED','CONFIRMED_BY_FIRM','UNVERIFIED')),
 review_state text NOT NULL DEFAULT 'UNREVIEWED'
  CHECK(review_state IN ('UNREVIEWED','REVIEW_IN_PROGRESS','REVIEWED')),
 disclosure_note text,
 CONSTRAINT adviser_claim_not_empty CHECK(length(trim(evidence_claim))>0),
 CONSTRAINT adviser_party_not_empty CHECK(length(trim(represented_party_name))>0)
);
CREATE INDEX IF NOT EXISTS gsi_engagement_firm_idx ON gsi_cap_private.transaction_adviser_engagements(firm_id);
CREATE INDEX IF NOT EXISTS gsi_engagement_event_idx ON gsi_cap_private.transaction_adviser_engagements(event_id);
REVOKE ALL ON ALL TABLES IN SCHEMA gsi_cap_private FROM PUBLIC, anon, authenticated;
ALTER TABLE gsi_cap_private.professional_service_firms ENABLE ROW LEVEL SECURITY;
ALTER TABLE gsi_cap_private.transaction_adviser_engagements ENABLE ROW LEVEL SECURITY;
COMMIT;
