# Backend

Runtime configuration for the server version of Apply Tracker (Next.js API + PostgreSQL). The application code itself lives in [`../frontend`](../frontend).

```text
backend/
  config/   # .env.example (public template) and your ignored local .env
  docker/   # Dockerfile and container start script for the app service
```

## Run the stack

From the repository root:

```sh
cp backend/config/.env.example backend/config/.env
docker compose up -d
```

The app runs at http://localhost:3001 and the database in the `db` service (see [`../docker-compose.yml`](../docker-compose.yml)).

```sh
docker compose ps                    # status
docker compose logs app --tail=100   # app logs
docker compose restart app
docker compose down                  # stop; data stays in the postgres-data volume
docker compose down -v               # stop and delete the database
```

## Secrets

- Put real values only in `backend/config/.env`, which git ignores.
- Keep `backend/config/.env.example` public-safe with placeholders.
- Change `AUTH_SECRET` and the seeded password before any real deployment.
