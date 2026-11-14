-- Test structure only. Data loaded here is unreviewed and not decision-grade.
create table if not exists gsi_master_test (
  master_record_id text primary key,
  investor_group text,
  target_or_event text,
  announcement_date text,
  evidence_grade text,
  transaction_status text,
  source_version text default 'v9.6'
);
alter table gsi_master_test enable row level security;
create policy "read test rows" on gsi_master_test for select using (true);
