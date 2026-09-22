# Finance Helper v1 Design

## Stack

- **P**ostgreSQL, **E**xpress, **R**eact, **N**ode (PERN)
- React (Vite) + Express API + PostgreSQL + Prisma

## Project layout

Two **separate deployable projects** (e.g. two Vercel projects), each with its own `.env`:

```
finance helper/
├── client/              # React frontend → Vercel project #1
│   ├── .env
│   └── .env.example
├── server/              # Express API → Vercel project #2
│   ├── .env
│   └── .env.example
├── docs/                # knowledge base + specs
└── data/                # sample/reference data (used by server seed)
```

## RBAC model

- **Modules** — app sections with route keys (employees, monthly_pf, exit_settlement, users, roles)
- **Roles** — accountant, HR, custom roles
- **Permissions** — per role per module: `can_view`, `can_edit`
- **Superadmin** — `is_super_admin` on user; bypasses all permission checks; manages users & roles

## v1 modules

| Module key | Route | Description |
|---|---|---|
| dashboard | / | Overview |
| employees | /employees | Employee master |
| monthly_pf | /monthly-pf | Monthly PF ledger |
| exit_settlement | /exit-settlement | Exit PF calculator |
| users | /admin/users | User management |
| roles | /admin/roles | Role & permission management |

## Seed data

Demo data seeded on first run (deletable later):

- Superadmin user (from env)
- Default modules, roles, permissions
- Sample employees from `data/employees.json` (permanent only, with PF fields)

## Out of scope v1

Gratuity, payslips, festival bonus, tax, employee self-service
