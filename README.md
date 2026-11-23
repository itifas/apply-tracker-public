# Apply Tracker

Track your job applications as lines on a route map: every application moves from Applied through Screen, Interview and Final to Offer, with follow-ups and totals alongside.

**[Open the web demo](https://tracker.iakovostifas.com)** · **[Download the desktop app](https://github.com/itifas/apply-tracker-public/releases/latest)** · [Changelog](CHANGELOG.md) · [Roadmap](https://github.com/itifas/apply-tracker-public/milestones)

## Try it

- **Web demo:** https://tracker.iakovostifas.com runs in your browser with sample data. Nothing to install, and your changes stay in your browser.
- **Desktop app:** download it from the [latest release](https://github.com/itifas/apply-tracker-public/releases/latest). It starts empty, keeps your data on your computer and updates itself.

| System | File |
|---|---|
| Windows 10/11 | `Apply-Tracker-Setup-<version>.exe` |
| macOS, Apple Silicon (M1–M4) | `Apply-Tracker-<version>-mac-arm64.dmg` |
| macOS, Intel | `Apply-Tracker-<version>-mac-x64.dmg` |
| Debian, Ubuntu, Mint | `Apply-Tracker-<version>-linux-amd64.deb` |
| Fedora, RHEL, openSUSE | `Apply-Tracker-<version>-linux-x86_64.rpm` |
| Any Linux | `Apply-Tracker-<version>-linux-x86_64.AppImage` |

The release page has install steps for each system. Builds aren't code-signed yet, so Windows and macOS show a warning the first time.

## Status

Version **0.1.2**, an early public version. It works for day-to-day tracking on a desktop-sized screen; the phone layout and some settings are still being built. See the [changelog](CHANGELOG.md) for what changed in each version.

## Features

- Applications with company, role, location, link, contact, salary, source, notes and dates.
- Three interview steps per application (screen, interview, final). The overall status is worked out from them: Applied, Interviewing, Offer, Rejected, or No reply after 30 days.
- Dashboard route map, due follow-ups and totals; analytics charts.
- Follow-up reminders with preset intervals, exported to any calendar as an `.ics` file.
- CSV import and export, and search across applications.
- Light and dark themes with several color palettes.

## Three ways to run it

| Version | Where your data lives | How it's built |
|---|---|---|
| Web demo | Your browser's storage | Static export of the Next.js app (`npm run build:demo`), served by a Cloudflare Worker |
| Desktop app | A folder on your computer | The same static build wrapped in Electron, with automatic updates from GitHub Releases |
| Server version | PostgreSQL | Next.js with API routes, Prisma and login, run with Docker Compose |

Built with Next.js 14, React 18, TypeScript, Tailwind CSS, Prisma, PostgreSQL 16, Recharts, Lucide icons, Electron and the Overpass typeface.

## Repository layout

```text
.
├── frontend/          # the Next.js app used by all three versions (see frontend/README.md)
├── desktop/           # Electron wrapper, installer config and release notes template
├── backend/           # server version config: .env template and Dockerfile
├── .github/           # checks, release and demo-sync workflows, issue/PR templates
├── docker-compose.yml # server version: app + PostgreSQL
└── *.md               # changelog, contributing, security, privacy, terms, code of conduct
```

## Getting started

**Web demo build**

```sh
cd frontend
npm ci
npm run build:demo   # static site in frontend/out
```

**Desktop app**

```sh
cd desktop
npm ci
npm run build:web
npm start
```

**Server version**

```sh
cp backend/config/.env.example backend/config/.env
docker compose up -d   # http://localhost:3001
```

The seeded login comes from `backend/config/.env` (`SEED_USERNAME` / `SEED_PASSWORD`; the template uses `it` / `change-me-now`). These are for local use only: change them and `AUTH_SECRET` before any real deployment. More commands are in [backend/README.md](backend/README.md).

## Branches, tags and releases

| Branch | Purpose |
|---|---|
| `main` | All source code and documentation. Work lands here. |
| `web-demo` | Copied from `main` after every push; Cloudflare deploys it to tracker.iakovostifas.com. |
| `windows`, `macos`, `linux` | Pushing `main` to one of these builds that system's installer and adds it to the release for the version in `desktop/package.json`. |

Each release has a git tag (`v0.1.0`, `v0.1.1`, `v0.1.2`, …), and `v0.0.0` marks the original prototype. To publish a new desktop version:

1. Bump `version` in `desktop/package.json` and add the changes to [CHANGELOG.md](CHANGELOG.md).
2. Push `main` to each platform branch:

```sh
git push origin main:windows
git push origin main:macos
git push origin main:linux
```

Installed apps on Windows and Linux offer the update on their next launch. macOS updates are manual until the app is signed.

## Roadmap

Work is grouped into [milestones](https://github.com/itifas/apply-tracker-public/milestones):

1. **Fix what's broken:** phone layout, accessibility fixes, favicon and link preview.
2. **Finish the redesign:** the remaining pages in the new design; hide example-only screens.
3. **Data safety:** one-file backup and restore, and delete all data.
4. **New features:** activity timeline, contacts, saved job descriptions and interview notes, response rates.

## Known limitations

- Email integration and Google/Outlook calendar sync are not built yet; those screens are labelled as in progress.
- The layout is made for desktop-sized screens; phones come in phase 1.
- CSV import doesn't handle line breaks inside quoted fields.
- Calendar export creates all-day events, because reminders have no time of day yet.

## Contributing, security and privacy

- [CONTRIBUTING.md](CONTRIBUTING.md): setup, branches and checks before a pull request.
- [SECURITY.md](SECURITY.md): how to report a vulnerability privately.
- [PRIVACY.md](PRIVACY.md) and [TERMS.md](TERMS.md): what data is stored, GDPR rights, terms of use and copyright.
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md): how people treat each other here and the principles the app follows.

Company names in the sample data (Microsoft, Google, Amazon, Meta, Stripe, Airbnb) are trademarks of their owners, used only as examples. Apply Tracker is not affiliated with any of them. Sample contacts are invented and use `example.com` addresses.

See [ATTRIBUTIONS.md](ATTRIBUTIONS.md) for fonts, libraries and design credits.

## License

MIT. Copyright (c) 2026 Iakovos Tifas. See [LICENSE](LICENSE).
