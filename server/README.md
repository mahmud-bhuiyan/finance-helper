# Finance Helper — Server (API)

Express + PostgreSQL + Prisma API for payroll and PF management (TypeScript).

Deploy as a **separate Vercel project** (or any Node host).

## Setup

```bash
cp .env.example .env
# Edit .env with your real credentials

npm install
npm run db:setup         # push schema + seed demo data
npm run create-superadmin  # create superadmin (once only)
npm run dev
```

API runs at `http://localhost:5000`

## Environment variables

See `.env.example` for all variables. Key ones:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret for auth tokens |
| `CLIENT_URL` | Frontend URL(s), comma-separated for CORS |

## Vercel deployment

1. Create a new Vercel project pointing to this `server/` folder
2. Add all env vars from `.env.example` in Vercel dashboard
3. Set `CLIENT_URL` to your Vercel client URL (e.g. `https://finance-helper.vercel.app`)
4. Use a hosted PostgreSQL (Neon, Supabase, Railway, etc.) for `DATABASE_URL`
5. After deploy, run `npm run db:setup` locally against production DB (or use Vercel CLI)

## Create superadmin

Set `SUPERADMIN_EMAIL`, `SUPERADMIN_PASSWORD`, and `SUPERADMIN_NAME` in `.env`, then:

```bash
npm run create-superadmin
```

Only runs if no superadmin exists yet.

## Seed data

Demo data is marked `is_demo=true` and can be deleted via `DELETE /api/employees/demo`.
