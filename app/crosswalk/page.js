import { getClient } from '../../lib/supabase';

export const dynamic = 'force-dynamic';

async function loadAll(db) {
  const out = [];
  for (let from = 0; from < 5000; from += 1000) {
    const { data, error } = await db.from('gsi_crosswalk_test')
      .select('master_record_id, investor_group, original_evidence_grade, normalised_evidence_grade, grade_mapping_basis, original_transaction_status, normalised_status_family, status_mapping_basis, source_version')
      .order('master_record_id').range(from, from + 999);
    if (error) return { error: error.message, rows: out };
    out.push(...data);
    if (data.length < 1000) break;
  }
  return { rows: out };
}

const count = (list, key) => {
  const m = {};
  list.forEach((r) => { const k = r[key] || '(blank)'; m[k] = (m[k] || 0) + 1; });
  return Object.entries(m).sort((a, b) => b[1] - a[1]);
};

export default async function Crosswalk() {
  const db = getClient();
  let rows = [];
  let note = '';
  if (!db) note = 'Not configured: set the two Supabase variables.';
  else {
    const r = await loadAll(db);
    rows = r.rows;
    if (r.error) note = `Query failed: ${r.error}`;
  }
  const unmapped = rows.filter((r) => r.normalised_status_family === 'UNMAPPED');
  const review = rows.filter((r) => r.normalised_status_family !== 'UNMAPPED' && /REVIEW|DOUBT/.test(`${r.status_mapping_basis} ${r.grade_mapping_basis}`));
  const table = (list) => (
    <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse' }}>
      <thead><tr><th>Record</th><th>Investor group</th><th>Original status</th><th>Mapped to</th><th>Basis</th><th>Grade</th></tr></thead>
      <tbody>
        {list.map((r) => (
          <tr key={r.master_record_id}>
            <td><a href={`/record/${encodeURIComponent(r.master_record_id)}`}>{r.master_record_id}</a></td>
            <td>{r.investor_group}</td><td>{r.original_transaction_status || '(blank)'}</td>
            <td>{r.normalised_status_family}</td><td>{r.status_mapping_basis}</td>
            <td>{r.normalised_evidence_grade} ({r.grade_mapping_basis})</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
  return (
    <main>
      <p><a href="/">Home</a></p>
      <h1>Crosswalk review</h1>
      <p><strong>Structure test only.</strong> Data is unreviewed and not decision-grade. Research, not investment advice.</p>
      {note && <p>{note}</p>}
      {rows.length > 0 && (
        <>
          <p>{rows.length} crosswalk rows. Mappings are proposals for the founder to rule on. An unmapped status is left unmapped, not guessed.</p>
          <h2>Status families</h2>
          <ul>{count(rows, 'normalised_status_family').map(([k, n]) => <li key={k}>{k}: {n}</li>)}</ul>
          <h2>Evidence grades</h2>
          <ul>{count(rows, 'normalised_evidence_grade').map(([k, n]) => <li key={k}>{k}: {n}</li>)}</ul>
          <p>UNGRADED means no evidence grade has been assigned. It is not a low grade.</p>
          <h2>Unmapped statuses ({unmapped.length})</h2>
          {unmapped.length ? table(unmapped) : <p>None.</p>}
          <h2>Mapped with a flag for review ({review.length})</h2>
          {review.length ? table(review) : <p>None.</p>}
        </>
      )}
    </main>
  );
}
