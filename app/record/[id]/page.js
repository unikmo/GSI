import { getClient } from '../../../lib/supabase';

export const dynamic = 'force-dynamic';

export default async function Record({ params }) {
  const { id } = await params;
  const recordId = decodeURIComponent(id);
  const db = getClient();
  let row = null;
  let note = '';
  if (!db) note = 'Not configured: set the two Supabase variables.';
  else {
    const { data, error } = await db.from('gsi_master_full').select('*').eq('master_record_id', recordId).maybeSingle();
    if (error) note = `Query failed: ${error.message}`;
    else if (!data) note = 'No record with this id.';
    else row = data;
  }
  return (
    <main>
      <p><a href="/">Back</a></p>
      <h1>{recordId}</h1>
      <p><strong>Structure test only.</strong> Data is unreviewed and not decision-grade. Research, not investment advice.</p>
      {note && <p>{note}</p>}
      {row && (
        <>
          <p>{Object.keys(row).length} fields. A blank value means not recorded, not zero.</p>
          <table>
            <tbody>
              {Object.entries(row).map(([k, v]) => (
                <tr key={k}><th align="left" valign="top">{k}</th><td>{v === '' || v === null ? '(blank)' : String(v)}</td></tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </main>
  );
}
