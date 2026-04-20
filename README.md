# The House Official Site

## Local setup

```bash
npm install
npm run prisma:generate
npm run prisma:push
npm run dev
```

Before running locally, create `.env.local` or `.env` with:

```bash
DATABASE_URL="your-postgresql-connection-string"
DIRECT_URL="your-postgresql-direct-connection-string"
ADMIN_SECRET="the-same-secret-you-will-use-in-production"
```

Open:
- `http://localhost:3000/` for the site
- `http://localhost:3000/admin` for the admin console

## Admin login

Set `ADMIN_SECRET` in `.env.local` or `.env`, then enter the same value in the admin page input.

## Editable content

All site content is stored in PostgreSQL and managed via `/admin`:
- Site config (brand, hero, about, contact)
- Programs & events
- Insights
- Partners

## Notes

- Update `.env` values before sharing or deploying.
- Images can be added as URLs in the admin UI (you can use local file hosting or cloud URLs).
