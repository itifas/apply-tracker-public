# Apply Tracker

Apply Tracker is a local-first job application tracker for managing applications, interview stages, reminders, imports, exports, and lightweight analytics.

## Project Status

- Current version: v0.0 Desktop Prototype.
- Desktop-first build for normal browser widths.
- Version 0 is a working desktop-focused prototype with core application tracking flows implemented.
- Mobile polish is planned for a later version.
- Not production-ready yet.
- Version 1.0 will focus on unfinished/scaffolded flows, data correctness checks, and production polish.

## Features

- Track companies, roles, locations, application links, contacts, notes, salaries, sources, and application dates.
- Manage application stage statuses and derived final status.
- View dashboard and analytics summaries.
- Import and export applications as CSV.
- Manage reminders and export reminders as an `.ics` calendar file.
- Local username/password authentication with seeded demo credentials.
- Scaffolded Google/Outlook calendar and email integration endpoints for future provider work.

## What Works in Version 0

- Login and logout.
- Applications list.
- Add application.
- Edit application.
- Delete application with confirmation modal.
- Clear application row action icons.
- Step 1, Step 2, and Step 3 status updates.
- Dashboard.
- Basic analytics charts.
- Reminders add, edit, and complete flows.
- CSV import and export.
- ICS reminder export.
- Theme and palette settings.
- Toast notifications and confirmation modal.

## Tech Stack

- Next.js 14, React 18, TypeScript
- Tailwind CSS and CSS theme variables
- Prisma ORM
- PostgreSQL 16
- Docker Compose
- Recharts and Lucide React

## Folder Structure

```text
.
├── backend/
│   ├── config/          # Local runtime env template and ignored local .env
│   └── docker/          # Dockerfile for the app container
├── frontend/
│   ├── app/             # Next.js app routes and API routes
│   ├── components/      # Reusable UI and page components
│   ├── lib/             # Auth, database, mapping, status, and utility code
│   ├── prisma/          # Prisma schema, migrations, and seed script
│   └── services/        # Calendar/email integration scaffolds
├── helpers/             # PowerShell helper scripts
└── docker-compose.yml   # Local app + Postgres services
```

## Prerequisites

- Docker and Docker Compose
- Node.js and npm, for running local development commands outside Docker
- PowerShell, optional, for helper scripts

## Local Setup With Docker

1. Copy the environment template:

```sh
cp backend/config/.env.example backend/config/.env
```

On Windows PowerShell:

```powershell
Copy-Item backend/config/.env.example backend/config/.env
```

2. Review `backend/config/.env` and adjust local-only values if needed.

3. Start the app and database:

```sh
docker compose up -d
```

4. Open the app:

```text
http://localhost:3001
```

The app container uses `backend/config/.env` via Docker Compose. Do not commit real `.env` files.

## Default Local Credentials

The default seeded demo login comes from `backend/config/.env.example`:

```text
Username: it
Password: change-me-now
```

These credentials are for local/demo use only. Rotate seeded credentials before any real deployment.

## Common Docker Commands

```sh
docker compose up -d
docker compose ps
docker compose logs app --tail=100
docker compose restart app
docker compose down
```

## Development Commands

Run lint from the repository root:

```sh
npm --prefix frontend run lint
```

## Environment Notes

- `backend/config/.env.example` is the public-safe template.
- `backend/config/.env` is the ignored local runtime file.
- `frontend/.env.example` documents that frontend secrets are centralized through `backend/config`.
- Keep placeholders in `.env.example`; never add real provider keys, tokens, passwords, or production secrets.

## Known Limitations

- Status calculation still needs final verification/fix if all-Pending applications are classified incorrectly.
- Email integration is scaffolded/stubbed and not fully functional.
- Settings page includes some no-op/future controls.
- Application detail Quick Actions include buttons that are not fully wired.
- Reminder auto-rule toggles are not fully functional.
- Analytics includes some placeholder/limited data sections.
- Topbar search and notification bell are currently visual/non-functional.
- CSV import does not fully support multiline quoted fields yet.
- ICS events are all-day because reminder time is not modeled.
- Mobile/responsive polish is planned for later.

## Roadmap to Version 1.0

- Fix final status calculation and reconcile existing records.
- Remove, disable, or clearly label scaffolded controls.
- Complete or hide email/calendar integration features.
- Wire or remove no-op settings and quick-action buttons.
- Improve reminder validation and auto-rule behavior.
- Replace analytics placeholder widgets with real data or hide them.
- Improve export error handling.
- Improve CSV multiline parsing.
- Final desktop UI polish.
- Prepare public demo/deployment documentation.

## Version 1.1 / Later

- Mobile sidebar/topbar behavior.
- Mobile chart/table layout.
- Touch-friendly controls.
- Reminder time support.
- Real Google/Outlook/Gmail integration.

## Security

- Do not commit real `.env` files or production secrets.
- Rotate `AUTH_SECRET` and seeded credentials for real deployments.
- Local/demo credentials are not production credentials.
- See [SECURITY.md](SECURITY.md) for vulnerability reporting guidance.

## Attributions

See [ATTRIBUTIONS.md](ATTRIBUTIONS.md) for design attribution notes preserved from the original design exploration.

## License

MIT. See [LICENSE](LICENSE).
