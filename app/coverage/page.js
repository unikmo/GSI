import { getClient } from '../../lib/supabase';

export const dynamic = 'force-dynamic';

const LABEL = {
  PARTIAL_TARGETED_SCREEN: 'Partly screened (targeted checks only)',
  NOT_SCREENED: 'Not screened. This is not "zero deals".',
  NOT_SYSTEMATICALLY_SCREENED: 'Not screened. This is not "zero deals".',
};

async function loadAll(db) {
  const out = [];
  for (let from = 0; from < 20000; from += 1000) {
    const { data, error } = await db.from('gsi_coverage_register_test')
      .select('loaded_id, month, source_group, coverage_status, verified_sources, open_work, review_date')
      .order('loaded_id').range(from, from + 999);
    if (error) return { error: error.message, rows: out };
    out.push(...data);
    if (data.length < 1000) break;
  }
  return { rows: out };
}

export default async function Coverage({ searchParams }) {
  const sp = (await searchParams) || {};
  const db = getClient();
  let rows = [];
  let note = '';
  if (!db) note = 'Not configured: set the two Supabase variables.';
  else {
    const r = await loadAll(db);
    rows = r.rows;
    if (r.error) note = `Query failed: ${r.error}`;
  }
  const month = typeof sp.month === 'string' ? sp.month : '';
  const year = typeof sp.year === 'string' ? sp.year : '';
  const partial = (r) => r.coverage_status === 'PARTIAL_TARGETED_SCREEN';
  const tally = (list) => ({ total: list.length, partial: list.filter(partial).length, none: list.length - list.filter(partial).length });
  const months = [...new Set(rows.map((r) => r.month))].sort();
  const years = [...new Set(months.map((m) => m.slice(0, 4)))];
  const head = (
    <>
      <p><a href="/">Home</a>{(month || year) && <> | <a href="/coverage">All years</a></>}</p>
      <h1>Coverage register</h1>
      <p><strong>Structure test only.</strong> Data is unreviewed and not decision-grade. Research, not investment advice.</p>
      {note && <p>{note}</p>}
    </>
  );
  if (month) {
    const list = rows.filter((r) => r.month === month);
    return (
      <main>
        {head}
        <h2>{month}</h2>
        <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse' }}>
          <thead><tr><th>Source group</th><th>Coverage</th><th>Verified sources</th><th>Open work</th><th>Reviewed</th></tr></thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.loaded_id}>
                <td>{r.source_group}</td><td>{LABEL[r.coverage_status] || r.coverage_status}</td>
                <td>{r.verified_sources || '(none recorded)'}</td><td>{r.open_work}</td><td>{r.review_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    );
  }
  if (year) {
    return (
      <main>
        {head}
        <h2>{year}</h2>
        <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse' }}>
          <thead><tr><th>Month</th><th>Source groups</th><th>Partly screened</th><th>Not screened (not zero)</th></tr></thead>
          <tbody>
            {months.filter((m) => m.startsWith(year)).map((m) => {
              const t = tally(rows.filter((r) => r.month === m));
              return <tr key={m}><td><a href={`/coverage?month=${m}`}>{m}</a></td><td>{t.total}</td><td>{t.partial}</td><td>{t.none}</td></tr>;
            })}
          </tbody>
        </table>
      </main>
    );
  }
  const all = tally(rows);
  return (
    <main>
      {head}
      {rows.length > 0 && (
        <>
          <p>
            {rows.length} month and source-group entries, {months[0]} to {months[months.length - 1]}: {all.partial} partly screened,
            {' '}{all.none} not screened. No month is shown as complete. An unreviewed month or group is never read as zero deals.
          </p>
          <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse' }}>
            <thead><tr><th>Year</th><th>Entries</th><th>Partly screened</th><th>Not screened (not zero)</th></tr></thead>
            <tbody>
              {years.map((y) => {
                const t = tally(rows.filter((r) => r.month.startsWith(y)));
                return <tr key={y}><td><a href={`/coverage?year=${y}`}>{y}</a></td><td>{t.total}</td><td>{t.partial}</td><td>{t.none}</td></tr>;
              })}
            </tbody>
          </table>
        </>
      )}
    </main>
  );
}
