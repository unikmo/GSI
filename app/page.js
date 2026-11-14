import { getClient } from '../lib/supabase';

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }) {
  const sp = (await searchParams) || {};
  const proposedView = sp.view === 'proposed';
  const db = getClient();
  let status = 'Not configured: set the two Supabase variables.';
  let rows = [];
  let total = null, proposed = null;
  if (db) {
    let q = db.from('gsi_master_full').select('master_record_id, investor_group, target_or_event, record_integrity_state');
    q = proposedView ? q.eq('record_integrity_state', 'PROPOSED_UNVERIFIED').order('master_record_id').limit(200) : q.neq('record_integrity_state', 'PROPOSED_UNVERIFIED').limit(5);
    const { data, error } = await q;
    if (error) status = `Connected, but query failed: ${error.message}`;
    else { status = 'Connected to Supabase.'; rows = data; }
    const a = await db.from('gsi_master_full').select('master_record_id', { count: 'exact', head: true });
    const b = await db.from('gsi_master_full').select('master_record_id', { count: 'exact', head: true }).eq('record_integrity_state', 'PROPOSED_UNVERIFIED');
    total = a.count; proposed = b.count;
  }
  return (
    <main>
      <h1>Gulf Sovereign Intelligence: test build</h1>
      <p><strong>Structure test only.</strong> Data is unreviewed and not decision-grade. Research, not investment advice.</p>
      <p>Database: {status}</p>
      {total !== null && <p>{total} master records, of which {proposed} are proposed and unverified (not yet approved for the master). Coverage runs from 1950 to Nov 2026 and is targeted, not exhaustive.</p>}
      {rows.length > 0 && (
        <ul>{rows.map((r) => <li key={r.master_record_id}><a href={`/record/${encodeURIComponent(r.master_record_id)}`}>{r.master_record_id}</a>: {r.investor_group}, {r.target_or_event}</li>)}</ul>
      )}
      <p>{proposedView ? <a href="/">Show a sample of the v9.6 records</a> : <a href="/?view=proposed">Show the proposed, unverified records</a>}</p>
      <p><a href="/coverage">Coverage register</a> | <a href="/crosswalk">Crosswalk review</a> | <a href="/eventtypes">Event-type families</a> | <a href="/api/health">/api/health</a></p>
    </main>
  );
}
