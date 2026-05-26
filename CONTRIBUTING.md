# Contributing

## Current Target

- The current target is the v0 desktop prototype.
- Version 1.0 work should be done in small, focused commits.
- Do not mix mobile work into v1.0 desktop fixes.

## Setup

1. Copy the local environment template:

```sh
cp backend/config/.env.example backend/config/.env
```

2. Start the local stack:

```sh
docker compose up -d
```

3. Check service status:

```sh
docker compose ps
```

4. Open the app at `http://localhost:3001`.

## Branches and Commits

- Create focused branches for each fix or feature.
- Keep commits small and descriptive.
- Avoid mixing unrelated refactors with behavior changes.
- Keep v1.0 desktop fixes separate from mobile/responsive work.
- Document any setup or migration steps in the pull request.

## Checks Before Pull Request

Run lint before opening a pull request:

```sh
npm --prefix frontend run lint
```

If you changed dependencies, explain why in the pull request.

## Files to Avoid Committing

- Do not commit `.env` files.
- Do not commit real secrets, API keys, database passwords, or local credentials.
- Do not commit `node_modules`, `.next`, local logs, local database files, or temporary files.
- Avoid committing `package-lock.json` unless dependencies changed intentionally.

## Environment Files

Use `backend/config/.env.example` as the public template and `backend/config/.env` as your ignored local runtime file. Keep examples public-safe and replace placeholder secrets for any real deployment.
