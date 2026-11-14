import { getClient } from '../../../lib/supabase';
import { family } from '../../../lib/eventFamilies';

export const dynamic = 'force-dynamic';

async function loadAll(db, table, cols, order) {
  const out = [];
  for (let from = 0; from < 5000; from += 1000) {
    const { data, error } = await db.from(table).select(cols).order(order).range(from, from + 999);
    if (error) return { error: error.message, rows: out };
    out.push(...data);
    if (data.length < 1000) break;
  }
  return { rows: out };
}

const tally = (list, fn) => {
  const m = {};
  list.forEach((r) => { const k = fn(r) || '(blank)'; m[k] = (m[k] || 0) + 1; });
  return Object.entries(m).sort((a, b) => b[1] - a[1]);
};
const Table = ({ head, rows }) => (
  <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse' }}>
    <thead><tr>{head.map((h) => <th key={h}>{h}</th>)}</tr></thead>
    <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
  </table>
);
// Families that are not an investment by the fund. Shown separately, never counted as deals.
const NOT_DEAL = ['NOT_AN_INVESTMENT_EVENT', 'NON_BINDING_OR_EXPLORATORY', 'INTRAGROUP_OR_STATE_TRANSFER'];

export default async function Mubadala() {
  const db = getClient();
  if (!db) return <main><p>Not configured: set the two Supabase variables.</p></main>;
  const m = await loadAll(db, 'gsi_master_full', 'master_record_id, investor_group, event_type, announcement_date, destination_region, record_integrity_state, investor_amount_millions, currency, amount_scope, target_or_event', 'master_record_id');
  const x = await loadAll(db, 'gsi_crosswalk_test', 'master_record_id, normalised_status_family, normalised_evidence_grade', 'master_record_id');
  const cw = Object.fromEntries(x.rows.map((r) => [r.master_record_id, r]));
  const all = m.rows.filter((r) => /mubadala/i.test(r.investor_group));
  const core = all.filter((r) => r.investor_group === 'Mubadala');
  const held = all.filter((r) => r.investor_group !== 'Mubadala');
  const tag = core.map((r) => ({ ...r, fam: family(r.event_type), st: cw[r.master_record_id]?.normalised_status_family, gr: cw[r.master_record_id]?.normalised_evidence_grade }));
  const deals = tag.filter((r) => !NOT_DEAL.includes(r.fam) && r.fam !== 'UNMAPPED');
  const proposed = tag.filter((r) => r.record_integrity_state === 'PROPOSED_UNVERIFIED').length;
  const withAmt = tag.filter((r) => r.investor_amount_millions !== null && r.investor_amount_millions !== '');
  const years = tally(tag, (r) => (r.announcement_date || '').slice(0, 4)).sort((a, b) => a[0].localeCompare(b[0]));
  return (
    <main>
      <p><a href="/">Home</a></p>
      <h1>Mubadala pilot profile</h1>
      <p><strong>Uncertified pilot. Structure test only.</strong> Data is unreviewed and not decision-grade. Research, not investment advice.</p>

      <h2>1. Executive judgment</h2>
      <p>This page shows what the loaded records can and cannot say about Mubadala today. It is a test of the profile layout, not a finding. Coverage is targeted, not exhaustive, so a count here is a count of loaded records, not of everything Mubadala did.</p>

      <h2>2. Scope</h2>
      <p>{core.length} records where the investor group is exactly “Mubadala”. {held.length} further records name Mubadala inside a joint or variant group (for example Mubadala / Masdar) and are held out until the founder rules on group variants.</p>
      <p>{proposed} of the {core.length} are proposed and unverified (not approved for the master).</p>

      <h2>3. Developments by proposed event family</h2>
      <p>Families are proposals. A family says what kind of event a record is, not whether it happened.</p>
      <Table head={['Family', 'Records']} rows={tally(tag, (r) => r.fam).map(([k, n]) => [k, n])} />
      <p>{deals.length} records sit in families that describe an investment by the fund. {core.length - deals.length} are policy notes, exploratory or non-binding items, intragroup transfers or unmapped, and are not counted as deals.</p>

      <h2>4. Status (normalised, proposed)</h2>
      <Table head={['Status family', 'Records']} rows={tally(tag, (r) => r.st).map(([k, n]) => [k, n])} />
      <p>Announced is not completed, and completed is not deployed. Records without a mapped status are shown as blank, not as zero.</p>

      <h2>5. Evidence grade (normalised, proposed)</h2>
      <Table head={['Grade', 'Records']} rows={tally(tag, (r) => r.gr).map(([k, n]) => [k, n])} />
      <p>UNGRADED means no grade has been assigned. It is not a low grade.</p>

      <h2>6. Announcement year</h2>
      <Table head={['Year', 'Records']} rows={years} />
      <p>Years reflect where research effort has gone, not where activity was. A thin year is not a quiet year.</p>

      <h2>7. Destination region</h2>
      <Table head={['Region', 'Records']} rows={tally(tag, (r) => r.destination_region).map(([k, n]) => [k, n])} />
      <p>A blank region means not recorded, not “none”.</p>

      <h2>8. Amounts</h2>
      <p>{withAmt.length} of {core.length} records carry an investor-specific amount. The rest are undisclosed or not attributable to Mubadala, which is unknown, not zero. No total is shown because a sum of {withAmt.length} amounts would read as Mubadala’s deployment and would mix currencies and statuses.</p>

      <h2>9. Evidence audit</h2>
      <ul>
        <li>Not reviewed by QA. Nothing here is certified.</li>
        <li>{proposed} records are proposed and unverified.</li>
        <li>Group variants held out: {held.length} records.</li>
        <li>Mubadala vehicles (for example Mubadala Capital, Mubadala Energy) are not yet separated from the parent.</li>
      </ul>

      <h2>Held out: group variants awaiting a ruling</h2>
      <Table head={['Record', 'Investor group', 'Event type']} rows={held.map((r) => [<a key={r.master_record_id} href={`/record/${encodeURIComponent(r.master_record_id)}`}>{r.master_record_id}</a>, r.investor_group, r.event_type])} />
    </main>
  );
}
