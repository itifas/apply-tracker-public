# Contributing

Thanks for your interest. Apply Tracker is a personal project maintained by Iakovos Tifas: only the maintainer can change this repository. You can still help by opening an issue, or by forking the repository and opening a pull request, which the maintainer reviews before anything is merged.

Please follow the [code of conduct](CODE_OF_CONDUCT.md).

## Reporting bugs and ideas

Open an issue with the bug or feature template. Security problems go through [SECURITY.md](SECURITY.md), not public issues.

## Setup

- **Web demo / desktop build:** `cd frontend && npm ci && npm run build:demo`, then serve `frontend/out`.
- **Server version:** `cp backend/config/.env.example backend/config/.env` and `docker compose up -d`, then open http://localhost:3001.
- **Desktop app:** `cd desktop && npm ci && npm run build:web && npm start`.

## Branches

| Branch | Purpose |
|---|---|
| `main` | Source of truth. All changes land here through pull requests. |
| `web-demo` | Updated automatically from `main`; deployed by Cloudflare. Don't push to it. |
| `windows`, `macos`, `linux` | Release branches. The maintainer pushes `main` to them to publish a desktop version. |

Work on a branch named after the change, for example `fix/phone-layout` or `feature/backup`.

## Before opening a pull request

```sh
cd frontend
npm run lint
npx tsc --noEmit
npm run build:demo
```

The same checks run automatically on every pull request. Add a line to [CHANGELOG.md](CHANGELOG.md) under "Unreleased" for user-visible changes.

## Don't commit

- `.env` files, real secrets, API keys or passwords
- `node_modules`, `.next`, `out`, `desktop/app`, `desktop/dist`, logs or local database files
