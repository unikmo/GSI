import { getClient } from '../../lib/supabase';

export const dynamic = 'force-dynamic';

const LABEL = {
  PARTIAL_TARGETED_SCREEN: 'Partly screened (targeted checks only)',
  NOT_SYSTEMATICALLY_SCREENED: 'Not screened. This is not "zero deals".',
};

export default async function Coverage() {
  const db = getClient();
  let rows = [];
  let note = '';
  if (!db) note = 'Not configured: set the two Supabase variables.';
  else {
    const { data, error } = await db.from('gsi_coverage_register_test').select('*').order('loaded_id');
    if (error) note = `Query failed: ${error.message}`;
    else rows = data;
  }
  const months = [...new Set(rows.map((r) => r.month))];
  const count = (s) => rows.filter((r) => r.coverage_status === s).length;
  return (
    <main>
      <p><a href="/">Back</a></p>
      <h1>Coverage register</h1>
      <p><strong>Structure test only.</strong> Data is unreviewed and not decision-grade. Research, not investment advice.</p>
      {note && <p>{note}</p>}
      {rows.length > 0 && (
        <>
          <p>
            {rows.length} source groups, loaded for {months.join(', ')} only. {count('PARTIAL_TARGETED_SCREEN')} partly screened,
            {' '}{count('NOT_SYSTEMATICALLY_SCREENED')} not screened. No month is shown as complete, and an unreviewed month or
            group is never read as zero deals. Months not listed here are not loaded, which is also not zero.
          </p>
          <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr><th>Month</th><th>Source group</th><th>Coverage</th><th>Verified sources</th><th>Open work</th><th>Reviewed</th></tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.loaded_id}>
                  <td>{r.month}</td>
                  <td>{r.source_group}</td>
                  <td>{LABEL[r.coverage_status] || r.coverage_status}</td>
                  <td>{r.verified_sources || '(none recorded)'}</td>
                  <td>{r.open_work}</td>
                  <td>{r.review_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </main>
  );
}
