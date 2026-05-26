# Secrets and Environment Config

Use this folder for backend runtime environment variables.

Files:

- `backend/config/.env.example`: safe template committed to git.
- `backend/config/.env`: local secrets file used at runtime (not committed).

## Setup

Run from the workspace root.

1. Copy the public-safe template:

```sh
cp backend/config/.env.example backend/config/.env
```

   Or generate local `.env` with:

```powershell
pwsh ./helpers/env/init.ps1
```

1. Edit `backend/config/.env` with your local values.
1. Never commit `backend/config/.env`.

Security notes:

- `.env` is ignored by `backend/.gitignore` and workspace `.gitignore`.
- Keep only placeholders in `.env.example`.
- Default seeded credentials in `.env.example` are for local/demo use only.
- Use a strong `AUTH_SECRET` and rotate seeded credentials for real deployments.
- Rotate keys if they were ever committed before.
