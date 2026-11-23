# Changelog

All notable changes to Apply Tracker. Versions match the git tags and the desktop app version in `desktop/package.json`.

## Unreleased

- Dashboard motion and interaction polish: route lines draw in once per session within ~450ms, toasts slide in and out, press feedback on buttons, hover only on devices that can hover, tabular numerals where numbers line up.
- Repository organization: Docker Compose file, changelog, issue and pull request templates, automatic checks, code owners.

## 0.1.2 (23 November 2026)

- Redesigned dashboard: every application drawn as a line through Applied, Screen, Interview, Final and Offer.
- New Wayfinding palette and Overpass typeface; simpler sidebar and top bar.
- Privacy notice, terms of use and project principles (in the app and the repository).
- Sample contacts use `example.com` addresses; note that company names are trademarks of their owners.

## 0.1.1 (23 November 2026)

- 404 page, in-progress labels and "coming soon" messages for unfinished features.
- Working top bar search.
- Linux `.deb` and `.rpm` packages alongside the AppImage; download page with install steps per system.
- Web demo updates automatically after every push to `main`.

## 0.1.0 (23 November 2026)

- Static browser demo (`npm run build:demo`), hosted on Cloudflare at tracker.iakovostifas.com.
- Desktop app for Windows, macOS and Linux with automatic updates from GitHub Releases.

## 0.0.0 (27 May 2026)

- First public version: desktop-first prototype with PostgreSQL, login, applications, reminders, analytics, CSV import/export and `.ics` export.
