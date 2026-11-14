import { getClient } from '../../../lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = getClient();
  if (!db) return Response.json({ app: 'ok', database: 'not_configured' });
  const { error } = await db.from('gsi_master_test').select('master_record_id', { head: true, count: 'exact' });
  return Response.json({ app: 'ok', database: error ? 'error' : 'connected', detail: error ? error.message : null });
}
