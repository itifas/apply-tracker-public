# Changelog

All notable changes to Apply Tracker. Versions match the git tags and the desktop app version in `desktop/package.json`.

## Unreleased

- "Coming soon" roadworks tape across features that aren't built yet (Email, calendar sync, notifications, reminder defaults, keyboard shortcuts, account). The section underneath is dimmed and can't be used; the stripes drift slowly and stay still with reduced motion.
- The sidebar stays in view while scrolling long pages.
- Due follow-up markers sit inside the Follow-ups panel instead of on its border.
- Phones: the sidebar becomes a slide-out menu (menu button in the top bar; Escape, backdrop tap or choosing a page closes it), and the route map stacks each name above its line.
- Accessibility: every field, dropdown, toggle and icon button has a name; status colours, buttons and links meet WCAG AA contrast in light and dark mode; chart slices are described. Automated checks report no issues on any page.
- Status labels match the dashboard (Offer, No reply) and use the route-map colours.
- Favicon, home-screen icon and a link preview image for sharing.
- Dashboard motion and interaction polish: route lines draw in once per session within ~450ms, toasts slide in and out, press feedback on buttons, hover only on devices that can hover, tabular numerals where numbers line up.
- Privacy notice and terms describe the planned optional online version: database storage, consent-based anonymised analysis, and user control over their data.
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
