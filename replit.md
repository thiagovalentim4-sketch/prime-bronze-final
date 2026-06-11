# Prime Bronze

Sistema de agendamento e gestão para o estúdio de bronzeamento artificial Prime Bronze.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/prime-bronze run dev` — run the frontend (Vite dev server)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Also needs: `PORT`, `BASE_PATH` for frontend build

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: Vite + React + wouter + Tailwind CSS + framer-motion
- API: Express 5 + pino logger
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle for API), Vite for frontend

## Where things live

- **Frontend pages**: `artifacts/prime-bronze/src/components/public/` (public pages) and `components/admin/` (admin pages)
- **API routes**: `artifacts/api-server/src/routes/` (public.ts, admin.ts)
- **Database schema**: `lib/db/src/schema.ts` — source of truth for Drizzle tables
- **Seed data**: `lib/db/src/seed.ts` — admin user, services, business hours, settings
- **Theme**: `artifacts/prime-bronze/src/index.css` — Tailwind + custom CSS variables
- **Auth utilities**: `artifacts/prime-bronze/src/lib/auth.ts` — localStorage JWT helpers
- **Layouts**: `artifacts/prime-bronze/src/components/public/public-layout.tsx` and `components/admin/admin-layout.tsx`

## Architecture decisions

- Prices stored in **cents** (integer) in DB, formatted to BRL on display: `(cents/100).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})`
- **No shadcn/ui** — custom components with Tailwind only (legacy Next.js UI components remain but are unused)
- **wouter** for routing (lightweight React Router alternative)
- JWT auth with localStorage token, `authHeaders()` helper for API calls
- Admin layout uses sidebar navigation with mobile hamburger overlay
- Booking flow: 4-step wizard (service → date → time → personal info) with WhatsApp confirmation
- Reports: daily/weekly/monthly aggregation with top-5 services bar chart

## Product

Prime Bronze é um estúdio de bronzeamento artificial em Mesquita, RJ. O sistema permite:

- **Clientes**: ver serviços com preços, agendar horários online, ver FAQ, cuidados, promoções e contato
- **Admin**: painel com dashboard, gestão de agendamentos, serviços, relatórios (diário/semanal/mensal) e configurações

## User preferences

- Tema: escuro com dourado (#D4AF37), fonte Playfair Display
- Conteúdo em português (Brasil)
- Preços em BRL (Real brasileiro)
- Instagram: @primebronze2026
- WhatsApp: (21) 96506-8219
- Endereço: Rua Guaratá, 30 - Santa Terezinha, Mesquita - RJ
- Horário: Seg-Sex 9h-20h, Sáb 9h-18h, Dom 8h-12h

## Gotchas

- **PORT and BASE_PATH env vars** are required for the frontend Vite build — without them the build fails
- **API server runs on port 8080**, not 5000 (replit.md originally had outdated info)
- `count` must be imported from `drizzle-orm` for aggregation queries in admin routes
- Seed.ts uses `active` (not `isActive`) and `sortOrder` for services table
- Pre-existing typecheck errors in `theme-provider.tsx`, `calendar.tsx`, `input-group.tsx` from Next.js migration — these are not from the current codebase
- Admin credentials (seeded): `admin@primebronze.com` / `primebronze2026`
- WhatsApp confirmation link uses `wa.me` with pre-filled message

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- All public pages verified with screenshots in `screenshots/` directory
- API endpoints tested with curl — login and reports confirmed working
