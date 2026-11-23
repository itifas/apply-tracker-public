# Apply Tracker

Apply Tracker is a local-first job application tracker for managing applications, interview stages, reminders, imports, exports, and lightweight analytics.

## Project Status

- Current version: v0.0 Desktop Prototype.
- Desktop-first build for normal browser widths.
- Version 0 is a working desktop-focused prototype with core application tracking flows implemented.
- Mobile polish is planned for a later version.
- Not production-ready yet.
- Version 1.0 will focus on unfinished/scaffolded flows, data correctness checks, and production polish.

## Try It

- **Web demo:** https://tracker.iakovostifas.com. It runs in your browser with sample data, so there's nothing to install.
- **Desktop app:** [download the latest release](https://github.com/itifas/apply-tracker-public/releases/latest).

| System | File |
|---|---|
| Windows 10/11 | `Apply-Tracker-Setup-<version>.exe` |
| macOS, Apple Silicon (M1–M4) | `Apply-Tracker-<version>-mac-arm64.dmg` |
| macOS, Intel | `Apply-Tracker-<version>-mac-x64.dmg` |
| Debian, Ubuntu, Mint | `Apply-Tracker-<version>-linux-amd64.deb` |
| Fedora, RHEL, openSUSE | `Apply-Tracker-<version>-linux-x86_64.rpm` |
| Any Linux | `Apply-Tracker-<version>-linux-x86_64.AppImage` |

The release page has step-by-step install instructions for each system.

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

## Live Demo and Desktop App

### Branches

| Branch | Purpose |
|---|---|
| `main` | All source code and documentation. Work happens here. |
| `web-demo` | Deployed by Cloudflare to `tracker.iakovostifas.com`. Updated automatically from `main` on every push. |
| `windows` | Pushing builds the Windows installer (`.exe`). |
| `macos` | Pushing builds the macOS app (`.dmg`, `.zip`). |
| `linux` | Pushing builds the Linux app (`.AppImage`). |

The release branches hold the same code as `main`. The web demo updates itself (the `Update web demo` workflow copies `main` to `web-demo` after every push). Update the desktop branches from `main` when you want to publish an app version:

```sh
git push origin main:windows    # build and release Windows
git push origin main:macos      # build and release macOS
git push origin main:linux      # build and release Linux
```

### Web demo (Cloudflare)

`npm --prefix frontend run build:demo` builds a static version of the app into `frontend/out`. It needs no server or database: data is stored in the visitor's browser, with sample data preloaded and a "Reset sample data" button.

Cloudflare setup (one time, uses `frontend/wrangler.jsonc`):

1. Cloudflare dashboard → Workers & Pages → Create → Import a repository → pick this repo.
2. Production branch: `web-demo`. Root directory: `frontend`. Build command: `npm ci && npm run build:demo`. Deploy command: `npx wrangler deploy`.
3. In the new Worker `apply-tracker-demo`: Settings → Domains & Routes → Add → Custom domain → `tracker.iakovostifas.com`.

### Desktop app (Windows, macOS, Linux)

`desktop/` wraps the same static build in Electron. Data is saved on the user's computer and the app starts empty.

- Releases: the `Desktop release` workflow builds the installer for the pushed platform branch and adds it to the GitHub Release named after `version` in `desktop/package.json` (e.g. `v0.1.0`).
- Updates: bump `version` in `desktop/package.json` on `main`, then push `main` to the platform branches. Installed apps check the latest release on launch, download the update and offer to restart.
- Builds are unsigned for now, so Windows SmartScreen and macOS Gatekeeper show a warning on first launch. macOS auto-update needs a signed app; Windows and Linux auto-update work unsigned.
- Local test: `cd desktop && npm ci && npm run build:web && npm start`.

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

## Privacy, Terms and Principles

- [PRIVACY.md](PRIVACY.md): what data is stored, Cloudflare hosting, desktop update checks, and your GDPR rights.
- [TERMS.md](TERMS.md): terms of use, copyright, and the note on company names in the sample data.
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md): how contributors treat each other and the principles the app follows.

Company names in the sample data (Microsoft, Google, Amazon, Meta, Stripe, Airbnb) are trademarks of their owners and are used only as examples. Apply Tracker is not affiliated with any of them. Sample contacts are invented and use `example.com` addresses.

## Attributions

See [ATTRIBUTIONS.md](ATTRIBUTIONS.md) for design attribution notes preserved from the original design exploration.

## License

MIT. Copyright (c) 2026 Iakovos Tifas. See [LICENSE](LICENSE).
