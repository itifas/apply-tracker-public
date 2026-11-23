# Apply Tracker: web app

The Next.js app behind every version of Apply Tracker. See the [root README](../README.md) for setup, branches and releases.

## Two build modes

| Command | Output | Data |
|---|---|---|
| `npm run dev` / `npm run build` | Server version with API routes and login | PostgreSQL via Prisma |
| `npm run build:demo` | Static site in `out/`, used by the web demo and the desktop app | The visitor's browser storage, answered by `lib/demo/` |

## Structure

```text
app/          # pages, plus app/api/* route handlers for the server version
components/   # UI: layout, dashboard (route map), applications, feedback, legal
lib/          # status rules, reports, CSV, auth, demo data layer, theme palettes
services/     # calendar (.ics) export and email/calendar integration stubs
prisma/       # schema, migrations and seed
scripts/      # build-demo.mjs
types/        # shared TypeScript types
```

## Checks

```sh
npm run lint
npx tsc --noEmit
npm run build:demo
```
