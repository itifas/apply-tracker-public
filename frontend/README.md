# Internship Tracker (Frontend)

Workspace root structure:

```text
backend/
frontend/
```

This README explains the application in `frontend/`.

Desktop-first personal internship and job application tracker.

This app is intentionally **single-user/local-first** and focuses on personal workflow management:

- application pipeline tracking
- reminders and follow-up presets
- analytics dashboards
- CSV import/export
- calendar export (`.ics`)
- integration architecture stubs for Google/Outlook calendar and Gmail/Outlook email

## Tech Stack

- Next.js 14 (App Router)
- React + TypeScript
- Tailwind CSS + shadcn-style reusable UI components
- Prisma ORM + PostgreSQL
- Recharts
- Docker + Docker Compose

## Project Structure

```text
app/
components/
lib/
services/
prisma/
public/
styles/
types/
docker/
scripts/
```

## Core Business Rules

Interview step values:

- `Pending`
- `Passed`
- `Rejected`

Computed final status logic:

- `Rejected` if any step is `Rejected`
- `OFFER` if step1, step2, and step3 are all `Passed`
- `Ghosted` if `daysSinceApply >= 30` and no final outcome
- `Interviewing` if step2 or step3 is `Pending`
- `Applied` if step1 is `Pending`

`daysSinceApply` is derived from `dateApplied` in backend mapping logic.

## Docker Setup (Recommended)

Docker orchestration is managed from the workspace root `docker-compose.yml`.

1. Create local environment file:

```bash
cd ..
pwsh ./helpers/env/init.ps1
```

1. Build and run app + db:

```bash
pwsh ./helpers/docker/start.ps1
```

1. Open:

- App: `http://localhost:3001`
- Postgres: `localhost:5433`

## Prisma Commands

```bash
# Generate Prisma client
npm run prisma:generate

# Apply migrations in local dev
npm run prisma:migrate

# Apply committed migrations (CI/container style)
npm run prisma:deploy

# Seed demo data
npm run prisma:seed
```

## Development (Without Docker)

1. Start PostgreSQL locally (or point `DATABASE_URL` to an existing instance).
2. Install deps:

```bash
npm install
```

1. Run migrations + seed:

```bash
npm run prisma:migrate
npm run prisma:seed
```

1. Start dev server:

```bash
npm run dev
```

## Feature Coverage

- Dashboard KPIs + charts + recent activity + upcoming reminders
- Applications table with search/filter/sort, inline stage edits, CRUD, CSV import/export
- Application detail page with stage tracker, notes, reminders, timeline panel
- Reminder engine with default presets (3/7/14/30 day)
- Calendar integration scaffold and real `.ics` export
- Email integration scaffold with clear TODO service boundaries
- Dark mode support
- Loading/empty/error states for key views

## Authentication

Current mode is local single-user with cookie-based login.

Default seeded login:

- Username: `it`
- Password: `change-me-now`

Change these through `SEED_USERNAME`, `SEED_PASSWORD`, `SEED_EMAIL`, and `SEED_FULL_NAME` in `backend/config/.env` before reseeding. Set `AUTH_SECRET` to a long random value outside local development.

## Screenshots

Add screenshots before publishing:

- `public/screenshots/dashboard.png`
- `public/screenshots/applications.png`
- `public/screenshots/reminders.png`

## Notes

- Desktop-first layout is intentional (`min-width` optimized for large table workflows).
- Mobile-specific UX is out of scope for this version.
- Docker lifecycle scripts are maintained in `../helpers`.
