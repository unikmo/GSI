#!/usr/bin/env node
/** Validates research claims without promoting them to verified investment data.
 * Usage: node scripts/validate-gsi-private-fund-pilot.mjs
 */
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
import assert from 'node:assert/strict';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>JSON.parse(readFileSync(resolve(root,p),'utf8'));
export function validatePrivateFundPilot(directory,deals){
 const errs=[];
 const add=x=>errs.push(x);
 const unique=(list,key,where)=>{
  const seen=new Set();
  for(const rec of list){if(!rec[key]||seen.has(rec[key]))add(where+': duplicate/missing '+key+': '+rec[key]);seen.add(rec[key]);}
 };
 if(!directory||!deals)throw Error('Both private manager and deal datasets required');
 const managers=directory.managers||[],funds=directory.named_funds||[],events=deals.events||[];
 unique(managers,'id','managers');unique(funds,'id','funds');unique(events,'id','events');
 const managerIds=new Set(managers.map(m=>m.id)),sourceIds=new Set((directory.sources||[]).map(x=>x.id));
 const eventSourceIds=new Set((deals.sources||[]).map(x=>x.id));
 unique(directory.sources||[],'id','manager sources');unique(deals.sources||[],'id','event sources');
 for(const src of [...(directory.sources||[]),...(deals.sources||[])])if(!/^https:\/\//.test(src.url||''))add('Source missing HTTPS URL: '+src.id);
 for(const manager of managers){
  if(!manager.sources?.length||!manager.sources.every(s=>sourceIds.has(s)))add('Unproven manager source: '+manager.id);
  if(!manager.ownership_class||manager.ownership_class==='PRIVATE_CONFIRMED'&&!manager.ownership_source_id)add('Unproven private ownership class: '+manager.id);
 }
 for(const fund of funds){
  if(!managerIds.has(fund.manager_id))add('Unknown manager for fund '+fund.id);
  if(!sourceIds.has(fund.source_id))add('Unknown source for fund '+fund.id);
 }
 const lawFirms=new Set(),coInvestments=[],exits=[],undated=[],metricLimitations=[];
 const uniqueEventSourceLinks=new Map();
 for(const event of events){
  if(!managerIds.has(event.manager_id))add('Unknown manager for event '+event.id);
  if(!event.sources?.length||!event.sources.every(s=>eventSourceIds.has(s)))add('Missing event source: '+event.id);
  const validDate=d=>/^\d{4}-\d{2}-\d{2}$/.test(d||'');
  if(event.announcement_date!==null&&!validDate(event.announcement_date))add('Bad event date: '+event.id);
  if(event.announcement_date===null){undated.push(event.id);if(!Number.isInteger(event.observed_year))add('Undated event lacks year: '+event.id);}
  if(event.announcement_date && event.later_stage && event.later_stage_source && !eventSourceIds.has(event.later_stage_source))add('Later stage source missing: '+event.id);
  for(const party of event.parties||[]){
   if(!party.name||!party.role)add('Nameless party: '+event.id);
   if(party.amount!==null&&party.amount!==undefined&&!party.amount_source)add('Unverified participant ticket: '+event.id);
   if(party.role.includes('CO_INVESTOR'))coInvestments.push(event.id+': '+party.name);
  }
  for(const adviser of event.advisers||[]){
   if(!adviser.firm||!adviser.role||!adviser.client||!eventSourceIds.has(adviser.source))add('Unattributed adviser: '+event.id);
   if(adviser.role.endsWith('_LEGAL'))lawFirms.add(adviser.firm);
   if(adviser.amount!==undefined)add('Adviser falsely given investor amount: '+event.id);
  }
  if(event.event_type?.includes('EXIT'))exits.push(event.id);
  for(const metric of event.financial_observations||[]){
   if(!eventSourceIds.has(metric.source))add('Unattributed metric: '+event.id);
   if(!metric.period_end||metric.accounting_basis==='NOT_DISCLOSED'||metric.accounting_basis?.includes('UNSPECIFIED'))metricLimitations.push(event.id+': '+metric.metric);
  }
  if(!uniqueEventSourceLinks.has(event.id))uniqueEventSourceLinks.set(event.id,new Set());
  for(const src of event.sources||[])uniqueEventSourceLinks.get(event.id).add(src);
 }
 assert.ok(!directory.status?.includes('CERTIFIED'), 'Seed cannot claim certified investor classification');
 if(errs.length)throw Error('Private fund pilot QA failed:\n'+errs.join('\n'));
 return {state:'SOURCE_LINKED_NOT_CERTIFIED_NOT_IMPORTED',managers:managers.length,named_funds:funds.length,events:events.length,undated_historical_events:undated,exit_events:exits,coinvestor_mentions:coInvestments,distinct_law_firms:lawFirms.size,law_firm_names:[...lawFirms].sort(),metrics_missing_certified_accounting_basis:metricLimitations};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const output=validatePrivateFundPilot(read('research/private_funds/gulf_manager_seed_2026-11-16_UNREVIEWED.json'),read('research/private_funds/gulf_private_deals_advisers_pilot_2026-11-16_UNREVIEWED.json'));
 process.stdout.write(JSON.stringify(output,null,2)+'\n');
}
