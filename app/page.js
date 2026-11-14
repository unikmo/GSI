import { getClient } from '../lib/supabase';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const db = getClient();
  let status = 'Not configured: set the two Supabase variables.';
  let rows = [];
  let total = null, proposed = null;
  if (db) {
    const { data, error } = await db.from('gsi_master_full').select('master_record_id, investor_group, target_or_event').limit(5);
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
      <p><a href="/coverage">Coverage register</a> | <a href="/api/health">/api/health</a></p>
    </main>
  );
}
