# Deep code review notes

Review performed against the current LueRevival implementation and the cloned upstream AlpacaBoards source.

## Source fidelity

The original AlpacaBoards stack depended on PHP 5.3, MySQL, Sphinx Search, and Smarty templates. LueRevival keeps the domain model while replacing the infrastructure:

- `Users` -> `users`
- `Topics` -> `topics`
- `Messages` -> `messages` + `message_revisions`
- `Links`, `LinkMessages`, `LinkVotes`, `LinkReports`, `LinkFavorites` -> equivalent link tables
- `InviteTree`, `Inventory`, `ShopItems`, `ShopTransactions` -> equivalent invite/shop flow
- `TopicalTags`, `Tagged` -> equivalent tagging model
- `StaffPermissions`, `DisciplineHistory` -> staff/admin + audit/discipline model
- `UploadedImages`, `ImageMap` -> upload registry + image map schema
- Sphinx -> Postgres full text search
- `templates/default/css/nblue.css` -> copied as primary stylesheet

## Security posture

Implemented:

- Parameterized Postgres queries only.
- bcrypt password hashes with cost 12.
- Server-side Postgres session store.
- CSRF protection with a session-bound token on form POSTs.
- Helmet headers with a restrictive CSP compatible with the nostalgic stylesheet.
- Rate limiting.
- Secure cookie support via `COOKIE_SECURE=true`.
- Soft delete / audit history rather than destructive moderation.
- Uploads restricted to image MIME types and capped by `MAX_UPLOAD_MB`.

Known future hardening:

- Add per-route stricter rate limits for login/register.
- Add email verification and password reset delivery once SMTP is configured.
- Add image dimension extraction and thumbnail generation.
- Expand integration tests with a live Postgres test DB.

## Production readiness verdict

Good for an initial self-hosted production deployment behind TLS with strong `.env` secrets and regular DB/upload backups. It is intentionally minimal on front-end dependencies to preserve the original feel.

## Verification performed locally

- `npm run verify` — passed (`node --check` on server/app/migrate/format and 4 Node tests).
- EJS template compile sweep — passed for every file in `src/views`.
- `node -e "require('./src/app')"` — app module loads OK.
- `npm audit --audit-level=low` — 0 vulnerabilities after replacing archived `csurf`.
- Static diff scan for obvious hardcoded secrets, shell injection, dangerous eval/exec, unsafe deserialization, and formatted SQL patterns — no hits.

## Not verified on this workstation

- Docker runtime and `docker compose config` because Docker is not installed in this Hermes Windows shell (`docker: command not found`).
- Live Postgres migration/runtime because neither Docker nor local `psql` is available here. GitHub Actions is included to run migration against Postgres on push.
