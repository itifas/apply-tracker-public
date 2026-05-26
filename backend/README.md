# Backend

This folder owns runtime orchestration and local environment configuration.

## Structure

```text
backend/
  config/            # local env files
  docker/            # backend image startup scripts
```

Operational scripts are in `../helpers/` at the workspace root.
Compose file is at `../docker-compose.yml`.

## Security

- Put real keys in `backend/config/.env` only.
- Keep placeholders in `backend/config/.env.example`.
- `.env` is git-ignored.

## Run Stack

```powershell
pwsh ../helpers/env/init.ps1
pwsh ../helpers/docker/start.ps1
```

## Common Operations

```powershell
pwsh ../helpers/docker/status.ps1
pwsh ../helpers/docker/logs.ps1
pwsh ../helpers/docker/logs.ps1 -Service app
pwsh ../helpers/docker/restart.ps1
pwsh ../helpers/docker/stop.ps1
pwsh ../helpers/docker/clean.ps1
```

Current app code is in `../frontend`.
