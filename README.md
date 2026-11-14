# GSI: Gulf Sovereign Intelligence (structure test)

Working research files for testing the data structure. All data is UNREVIEWED and NOT decision-grade. Not for sale or distribution.

- `database/`: v9.5 baseline, v9.6 working files (two founder-approved backfills) and the v9.7 label crosswalk. v9.5 is unchanged; later versions are new files.
- `proposals/`: proposed ledgers, maps, coverage registers and audits (1950 to 2019, Jun 2025 to Nov 2026). Not loaded into the database.
- `fund-profiles/`: pilot profile drafts.
- `CLAUDE.md`: project rules and strategy.

## Test application

A minimal Next.js app that checks the connection to Supabase. Structure test only: data is unreviewed and not decision-grade.

- `app/page.js`: status page, shows up to five test rows.
- `app/api/health/route.js`: returns app and database status.
- `supabase/schema.sql`: one test table, `gsi_master_test`.
- `.env.example`: the two variables to set (Supabase URL and anon key).

Run locally: `npm install`, copy `.env.example` to `.env.local`, then `npm run dev`. It deploys to Vercel as a standard Next.js project. Without the variables it reports "not configured".
