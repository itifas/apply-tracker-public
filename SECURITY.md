# Security Policy

## Reporting Security Issues

Please report security issues privately to the repository owner or maintainer. Do not open a public issue with exploit details, secrets, or personally identifiable information.

Include:

- A short description of the issue
- Steps to reproduce, if safe to share
- Affected files, routes, or configuration
- Suggested mitigation, if known

## Secrets

Do not commit secrets. This includes:

- `.env` files
- API keys and OAuth client secrets
- Database passwords
- Session secrets such as `AUTH_SECRET`
- Production credentials

Only commit public-safe templates such as `.env.example` files.

## Local Credentials

The seeded local/demo credentials from `backend/config/.env.example` are not production credentials. Change them before any deployment outside local development.

## Production Guidance

- Use a strong, randomly generated `AUTH_SECRET`.
- Rotate `AUTH_SECRET`, seeded credentials, and provider keys if they were exposed.
- Keep real deployment secrets in your hosting platform or secret manager.
- Review `backend/config/.env` before sharing logs, screenshots, or archives.
