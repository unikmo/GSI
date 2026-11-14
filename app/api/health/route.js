import { getClient } from '../../../lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = getClient();
  if (!db) return Response.json({ app: 'ok', database: 'not_configured' });
  const { data, error } = await db.from('gsi_master_test').select('master_record_id').limit(1);
  return Response.json({ app: 'ok', database: error ? 'error' : 'connected', detail: error ? error.message : `rows_visible_in_sample: ${data.length}` });
}
