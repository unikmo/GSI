import { getClient } from '../../lib/supabase';
import { family } from '../../lib/eventFamilies';

export const dynamic = 'force-dynamic';

async function loadAll(db) {
  const out = [];
  for (let from = 0; from < 5000; from += 1000) {
    const { data, error } = await db.from('gsi_master_full')
      .select('master_record_id, investor_group, event_type, record_integrity_state')
      .order('master_record_id').range(from, from + 999);
    if (error) return { error: error.message, rows: out };
    out.push(...data);
    if (data.length < 1000) break;
  }
  return { rows: out };
}

export default async function EventTypes() {
  const db = getClient();
  let rows = [];
  let note = '';
  if (!db) note = 'Not configured: set the two Supabase variables.';
  else {
    const r = await loadAll(db);
    rows = r.rows;
    if (r.error) note = `Query failed: ${r.error}`;
  }
  const tagged = rows.map((r) => ({ ...r, fam: family(r.event_type) }));
  const fams = {};
  tagged.forEach((r) => { (fams[r.fam] = fams[r.fam] || []).push(r); });
  const order = Object.entries(fams).sort((a, b) => (a[0] === 'UNMAPPED') - (b[0] === 'UNMAPPED') || b[1].length - a[1].length);
  const variants = (list) => {
    const m = {};
    list.forEach((r) => { const k = r.event_type || '(blank)'; m[k] = (m[k] || 0) + 1; });
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  };
  const distinct = new Set(rows.map((r) => r.event_type)).size;
  return (
    <main>
      <p><a href="/">Home</a></p>
      <h1>Event-type families</h1>
      <p><strong>Structure test only.</strong> Data is unreviewed and not decision-grade. Research, not investment advice.</p>
      {note && <p>{note}</p>}
      {rows.length > 0 && (
        <>
          <p>{rows.length} records use {distinct} different event-type labels. The grouping below is a proposal for the founder to rule on. The stored label is not changed (the v4.9 schema is locked). A label that fits no rule stays unmapped, not guessed. A family is not a status: it does not say whether a deal was signed or completed.</p>
          <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse' }}>
            <thead><tr><th>Proposed family</th><th>Records</th><th>Distinct labels</th></tr></thead>
            <tbody>{order.map(([f, l]) => <tr key={f}><td><a href={`#${f}`}>{f}</a></td><td>{l.length}</td><td>{variants(l).length}</td></tr>)}</tbody>
          </table>
          {order.map(([f, l]) => (
            <section key={f} id={f}>
              <h2>{f} ({l.length})</h2>
              {f === 'UNMAPPED' && <ul>{l.map((r) => <li key={r.master_record_id}><a href={`/record/${encodeURIComponent(r.master_record_id)}`}>{r.master_record_id}</a>: {r.investor_group}, {r.event_type}</li>)}</ul>}
              {f !== 'UNMAPPED' && <p>{variants(l).map(([k, n]) => `${k} (${n})`).join('; ')}</p>}
            </section>
          ))}
        </>
      )}
    </main>
  );
}
