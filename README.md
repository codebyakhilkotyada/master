# Akhil Kotyada — Portfolio (Full Source)

## Structure
- frontend/ — React + Vite + Tailwind app
- backend/supabase/ — Supabase config + Postgres migrations (Lovable Cloud)
- backend/migrations/postgres_full.sql — combined SQL for re-creating tables/storage

## Run frontend
    cd frontend
    npm install
    npm run dev

## Env (already in frontend/.env)
VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY, VITE_SUPABASE_PROJECT_ID

## Deploy
- Frontend → Vercel: import repo, Framework: Vite, add env vars above.
- Backend → already hosted by Lovable Cloud. To self-host, run the SQL in your own Supabase project.
