# The House Official Site

## Local setup

```bash
npm install
npm run prisma:generate
npm run prisma:push
npm run dev
```

Open:
- `http://localhost:3000/` for the site
- `http://localhost:3000/admin` for the admin console

## Admin login

Set `ADMIN_SECRET` in `.env` and enter it in the admin page input.

## Editable content

All site content is stored in SQLite and managed via `/admin`:
- Site config (brand, hero, about, contact)
- Programs & events
- Insights
- Partners

## Notes

- Update `.env` values before sharing or deploying.
- Images can be added as URLs in the admin UI (you can use local file hosting or cloud URLs).
