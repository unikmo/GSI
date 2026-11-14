/**
 * Private Capital Intelligence data-quality gate. No API, DB calls or public routes.
 * Non-disclosure is distinct from zero, and negative EBITDA is valid.
 * Financials must be dated and currency-normalised before peer comparisons.
 */
export const INTAKE_VERSION = 'cap-intake-v1';
export const DATA_STATES = Object.freeze(['reported','estimated','not_disclosed','not_applicable','not_available']);
export const REVIEW_LEVELS = Object.freeze(['screening','executive_review','investment_committee']);
const states = new Set(DATA_STATES);
const filled = x => typeof x === 'string' && x.trim().length > 0;
const obj = x => x !== null && typeof x === 'object' && !Array.isArray(x);
const arr = x => Array.isArray(x) && x.length > 0;
const date = x => typeof x === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(x) && !Number.isNaN(Date.parse(x + 'T00:00:00Z'));
const missing = (path, reason='required') => ({path,reason});
const hasNumber = x => typeof x === 'number' && Number.isFinite(x);
const numericValue = (x, path, issues, {allowNegative=false}={}) => {
  if(!obj(x) || !states.has(x.state)){issues.push(missing(path,'status_required'));return false;}
  if(x.state==='reported'||x.state==='estimated'){
    if(!hasNumber(x.value)||(!allowNegative&&x.value<0)){issues.push(missing(path+'.value','invalid_number'));return false;}
    if(!filled(x.currency)||!date(x.periodEnd)){issues.push(missing(path,'currency_and_period_required'));return false;}
    if(!filled(x.sourceType)){issues.push(missing(path+'.sourceType','provenance_required'));return false;}
    if(x.state==='estimated'&&!filled(x.estimationMethod)){issues.push(missing(path+'.estimationMethod','method_required'));return false;}
    return true;
  }
  if(x.value!==undefined && x.value!==null)issues.push(missing(path+'.value','undisclosed_must_not_be_zero_filled'));
  return false;
};
export function validateCapitalIntake(record, {level='executive_review'}={}){
  if(!REVIEW_LEVELS.includes(level)) throw new TypeError('Invalid review level');
  const issues=[]; const unknown=[]; const warn=[];
  if(!obj(record))return {valid:false,level,issues:[missing('record','object_required')],warnings:[],unknowns:[],readiness:'blocked'};
  const fields=[
    'companyName','companyId','sector','subsector','businessModel','stage','headquartersCountry',
    'capitalPurpose','capitalInstrument','transactionType','ownershipType','ownershipSummary',
    'financialBasis','fiscalYearEnd','fundraisingTimeline'
  ];
  for(const field of fields)if(!filled(record[field]))issues.push(missing(field));
  for(const field of ['operatingCountries','targetMarkets'])if(!arr(record[field])||!record[field].every(filled))issues.push(missing(field));
  for(const field of ['existingInvestors','shareholders'])if(!Array.isArray(record[field]))issues.push(missing(field,'must_be_array_or_empty'));
  if(!obj(record.capitalSought)||!hasNumber(record.capitalSought.amount)||record.capitalSought.amount<=0||!filled(record.capitalSought.currency))issues.push(missing('capitalSought','positive_amount_currency_required'));
  if(!obj(record.financials))issues.push(missing('financials','object_required'));
  else{
    const required=['revenue','revenueGrowth','ebitda','ebitdaMargin','netIncome','netDebt','cashBalance','cashBurn','valuation'];
    for(const f of required){const v=record.financials[f];numericValue(v,'financials.'+f,issues,{allowNegative:['revenueGrowth','ebitda','ebitdaMargin','netIncome','netDebt','cashBurn'].includes(f)});if(v&&states.has(v.state)&&!['reported','estimated'].includes(v.state))unknown.push('financials.'+f);}
    if(!['audited','reviewed','management','unaudited','not_available'].includes(record.financialBasis))issues.push(missing('financialBasis','invalid_basis'));
    if(!date(record.fiscalYearEnd))issues.push(missing('fiscalYearEnd','valid_date_required'));
  }
  if(!obj(record.profitability)||!['profitable','loss_making','break_even','pre_revenue','unknown'].includes(record.profitability.status))issues.push(missing('profitability.status'));
  if(!obj(record.ownership)||!['confirmed','estimated','undisclosed'].includes(record.ownership.verification))issues.push(missing('ownership.verification'));
  if(!obj(record.restrictions))issues.push(missing('restrictions','object_required'));
  else for(const k of ['sanctionsReviewed','regulatoryConstraintsReviewed','existingCovenantsReviewed'])if(typeof record.restrictions[k]!=='boolean')issues.push(missing('restrictions.'+k,'explicit_boolean_required'));
  if(!obj(record.riskFactors)||!Array.isArray(record.riskFactors.items))issues.push(missing('riskFactors.items','array_required'));
  const financials=record.financials||{};
  if(financials.revenue?.state==='reported' && financials.revenueGrowth?.state==='not_available')warn.push('Growth history unavailable');
  if(record.shareholders?.length===0)unknown.push('shareholder_details');
  if(record.existingInvestors?.length===0)unknown.push('existing_investors_unspecified_or_none');
  if(!arr(record.evidenceSources))issues.push(missing('evidenceSources','source_register_required'));
  else for(const [i,s] of record.evidenceSources.entries())if(!obj(s)||!filled(s.id)||!filled(s.sourceType)||!date(s.asOfDate))issues.push(missing('evidenceSources.'+i,'id_type_asof_required'));
  // Different stages of review: required-field presence is only the first gate.
  const gaps=unknown.length;
  if(gaps)warn.push(gaps+' metrics withheld or unavailable; do not treat as zero');
  if(level!=='screening' && record.financialBasis==='not_available')warn.push('Financial evidence not reviewable; executive conclusion must be conditional');
  if(level==='investment_committee')warn.push('Analyst approval, deal documentation and independently corroborated source checks are mandatory outside this schema gate');
  return {valid:issues.length===0,level,issues,warnings:warn,unknowns:unknown,readiness:issues.length?'blocked':gaps?'conditional':'intake_complete_not_investment_approved'};
}
/**
 * Distinguishes point-in-time investee snapshots from the current-company intake.
 * Snapshot date is the latest evidenced date no later than announcement; later figures
 * are never treated as if they were public at investment announcement.
 */
export function validateHistoricalInvesteeSnapshot(s){
 const issues=[];
 if(!obj(s))return {valid:false,issues:[missing('snapshot','object_required')]};
 for(const k of ['snapshotId','masterRecordId','investeeId','investingVehicleId','eventType','announcementDate','sourceId','disclosureState','reviewState'])if(!filled(s[k]))issues.push(missing(k));
 if(!date(s.announcementDate))issues.push(missing('announcementDate','valid_date_required'));
 if(!date(s.asOfDate)||s.asOfDate>s.announcementDate)issues.push(missing('asOfDate','must_precede_or_equal_announcement'));
 if(!date(s.sourcePublishedAt)||s.sourcePublishedAt>s.announcementDate)issues.push(missing('sourcePublishedAt','not_public_at_announcement'));
 if(!['direct_equity','fund_commitment','acquisition','debt','joint_venture','other'].includes(s.eventType))issues.push(missing('eventType','unrecognised'));
 if(!['UNREVIEWED','REVIEW_IN_PROGRESS','REVIEWED'].includes(s.reviewState))issues.push(missing('reviewState','invalid'));
 if(!obj(s.financials))issues.push(missing('financials','object_required'));
 else for(const k of ['revenue','ebitda','netDebt','enterpriseValue','equityValue'])numericValue(s.financials[k],'financials.'+k,issues,{allowNegative:['ebitda','netDebt'].includes(k)});
 if(!obj(s.ownership)||!filled(s.ownership.type))issues.push(missing('ownership.type'));
 return {valid:issues.length===0,issues};
}
