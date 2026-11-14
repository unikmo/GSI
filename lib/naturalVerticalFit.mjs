/**
 * Natural Vertical Fit foundation (internal research only).
 * Not investment advice, investor access, placement, or an investment probability.
 * Pure/deterministic: does not call Supabase and does not expose a route.
 */
export const FIT_ENGINE_VERSION = '0.1.0';
const SIGNALS = Object.freeze({ sector: 30, geography: 20, stage: 15, instrument: 15, ticket: 20 });
const EVIDENCE_LEVELS = new Set(['verified_primary', 'corroborated_secondary', 'inferred', 'unknown']);
const nonEmpty = (v) => typeof v === 'string' && v.trim().length > 0;
const matches = (xs, x) => Array.isArray(xs) && nonEmpty(x) && xs.some(y => nonEmpty(y) && y.trim().toLowerCase() === x.trim().toLowerCase());
const validDate = (s) => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s + 'T00:00:00Z'));
function ticketCheck(min, max, amount) {
  if (![min,max,amount].every(v => v === null || (typeof v === 'number' && Number.isFinite(v) && v >= 0))) return 'unknown';
  if (amount === null || (min === null && max === null)) return 'unknown';
  if ((min !== null && amount < min) || (max !== null && amount > max)) return 'mismatch';
  return 'match';
}
function signal(input, investor, name) {
  const property = { sector: 'sectors', geography: 'geographies', stage: 'stages', instrument: 'instruments' }[name];
  if (!property || !nonEmpty(input[name]) || !Array.isArray(investor[property]) || investor[property].length === 0) return 'unknown';
  return matches(investor[property], input[name]) ? 'match' : 'mismatch';
}
export function assessNaturalVerticalFit(opportunity, investor, { asOf = '2026-11-14' } = {}) {
  if (!opportunity || !investor || !validDate(asOf)) throw new TypeError('Opportunity, investor and valid asOf date required');
  if (!nonEmpty(opportunity.id) || !nonEmpty(investor.id)) throw new TypeError('Stable opportunity and investor IDs required');
  if (opportunity.ticketAmount != null && !(typeof opportunity.ticketAmount === 'number' && Number.isFinite(opportunity.ticketAmount) && opportunity.ticketAmount >= 0)) throw new TypeError('Invalid ticket amount');
  const mandate = investor.mandate || {};
  const evidence = Array.isArray(investor.evidence) ? investor.evidence : [];
  const inspectedEvidence = evidence.filter(e =>
    nonEmpty(e.id) && nonEmpty(e.sourceUrl) && validDate(e.asOfDate) &&
    e.asOfDate <= asOf && EVIDENCE_LEVELS.has(e.grade)
  );
  const results = {
    sector: signal(opportunity, investor, 'sector'),
    geography: signal(opportunity, investor, 'geography'),
    stage: signal(opportunity, investor, 'stage'),
    instrument: signal(opportunity, investor, 'instrument'),
    ticket: ticketCheck(investor.ticketMin ?? null, investor.ticketMax ?? null, opportunity.ticketAmount ?? null)
  };
  const knownWeight = Object.entries(results).reduce((n,[k,v])=>n+(v==='unknown'?0:SIGNALS[k]),0);
  const matchedWeight = Object.entries(results).reduce((n,[k,v])=>n+(v==='match'?SIGNALS[k]:0),0);
  const mismatches = Object.entries(results).filter(([,v])=>v==='mismatch').map(([k])=>k);
  const currentMandateVerified = mandate.status === 'active_verified' &&
    validDate(mandate.verifiedAt) && mandate.verifiedAt <= asOf &&
    validDate(mandate.validUntil) && mandate.validUntil >= asOf &&
    nonEmpty(mandate.sourceEvidenceId) &&
    inspectedEvidence.some(e=>e.id===mandate.sourceEvidenceId && e.grade==='verified_primary');
  const hasHistoricalEvidence = inspectedEvidence.some(e=> e.grade==='verified_primary' || e.grade==='corroborated_secondary');
  const historicalFit = hasHistoricalEvidence && matchedWeight > 0 && mismatches.length === 0;
  const strategicFit = historicalFit && knownWeight >= 60 && matchedWeight >= 60;
  const eligibility = mismatches.length ? 'contradicted' :
    currentMandateVerified && Object.values(results).every(v=>v==='match') ? 'criteria_evidenced_check_with_investor' :
    'unverified_research_further';
  // Scores express only the completeness of observed criteria, never funding likelihood.
  return {
    engineVersion: FIT_ENGINE_VERSION,
    opportunityId: opportunity.id,
    investorId: investor.id,
    asOf,
    criteria: results,
    matchedWeight, knownWeight, maxWeight: 100,
    contradictions: mismatches,
    historicalFit,
    strategicFit,
    currentMandateVerified,
    eligibility,
    evidenceIds: inspectedEvidence.map(e=>e.id),
    missingEvidence: evidence.length !== inspectedEvidence.length || !hasHistoricalEvidence,
    warning: 'Research triage only. No confirmed investor interest, access, or probability of funding.'
  };
}
export function rankNaturalVerticalFits(opportunity, investors, options = {}) {
  if (!Array.isArray(investors)) throw new TypeError('Investors must be an array');
  return investors.map(i=>assessNaturalVerticalFit(opportunity,i,options)).sort((a,b) =>
    (a.contradictions.length===0?1:0) === (b.contradictions.length===0?1:0)
      ? b.matchedWeight-a.matchedWeight || b.knownWeight-a.knownWeight || a.investorId.localeCompare(b.investorId)
      : a.contradictions.length-b.contradictions.length
  );
}
