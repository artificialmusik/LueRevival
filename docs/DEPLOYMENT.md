# LueRevival deployment guide

## Required `.env` values

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Set these before production:

| Variable | Required | Example | Notes |
|---|---:|---|---|
| `NODE_ENV` | yes | `production` | Enables production checks. |
| `PORT` | yes | `3000` | Container listens here. |
| `BASE_URL` | yes | `https://lue.cloudfyr.com` | Public canonical URL. |
| `SITE_NAME` | yes | `LueRevival` | Display name. |
| `POSTGRES_DB` | yes | `luerevival` | DB name. |
| `POSTGRES_USER` | yes | `luerevival` | DB user. |
| `POSTGRES_PASSWORD` | yes | generated | Use a long random value. |
| `POSTGRES_HOST` | yes | `db` | `db` when using Compose. |
| `SESSION_SECRET` | yes | generated | `openssl rand -base64 48`. |
| `COOKIE_SECURE` | yes | `true` | Use true behind HTTPS. Local HTTP can use false. |
| `ADMIN_USERNAME` | yes | `admin` | First seeded admin username. |
| `ADMIN_EMAIL` | yes | `admin@example.com` | First seeded admin email. |
| `ADMIN_PASSWORD` | yes | generated | First seeded admin password. |
| `REGISTRATION_MODE` | yes | `invite` | `open`, `invite`, or `closed`. |
| `INVITES_ENABLED` | yes | `true` | Controls invite workflows. |
| `UPLOAD_DIR` | yes | `/app/uploads` | Bind-mounted by Compose. |
| `MAX_UPLOAD_MB` | yes | `8` | Upload cap. |

## Deploy

```bash
docker compose up --build -d
docker compose ps
docker compose logs -f app
curl -fsS http://127.0.0.1:3000/health
```

## Update

```bash
git pull
docker compose up --build -d
docker compose logs --tail=100 app
```

## Backup

```bash
mkdir -p backups
# Database dump
docker compose exec -T db pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" > backups/luerevival-$(date +%F).sql
# Uploads
tar -czf backups/luerevival-uploads-$(date +%F).tgz uploads/
```

## Restore

```bash
cat backups/luerevival-YYYY-MM-DD.sql | docker compose exec -T db psql -U "$POSTGRES_USER" "$POSTGRES_DB"
tar -xzf backups/luerevival-uploads-YYYY-MM-DD.tgz
```

## Caddy

For an external Caddy container on `headscale-stack-cloudfyr-v31_default`, run the optional override and use service name routing:

```bash
docker compose -f docker-compose.yml -f docker-compose.caddy-example.yml up -d --build
```

Caddyfile:

```caddyfile
lue.cloudfyr.com {
  reverse_proxy luerevival-app:3000
}
```

Do not use `127.0.0.1:3000` inside containerized Caddy.
