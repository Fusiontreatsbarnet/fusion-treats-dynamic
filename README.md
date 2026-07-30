# Fusion Treats — Dynamic Website

Next.js + PostgreSQL. Menu items, reviews, and custom pages are all stored in the
database and manageable from `/admin` — no code changes needed to update them.

## What's inside
- `/` — public homepage, pulls menu + reviews live from Postgres
- `/[slug]` — any page you create in the admin panel appears here automatically
- `/admin` — login-protected dashboard to manage menu, reviews, and pages
- `prisma/schema.prisma` — the database structure (MenuItem, Review, Page, AdminUser)

## One-time setup (free)

1. **Create a free Postgres database** at [neon.tech](https://neon.tech) (or supabase.com).
   Copy the connection string it gives you.

2. **Create a free Vercel account** at [vercel.com](https://vercel.com), sign in with GitHub.

3. **Import this repo** into Vercel ("Add New Project" → select this GitHub repo).
   Vercel auto-detects Next.js — no config needed.

4. **Add environment variables** in Vercel's project settings (Settings → Environment Variables):
   - `DATABASE_URL` — the connection string from step 1
   - `JWT_SECRET` — any long random string
   - `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` — your first admin login (only needed for seeding)

5. **Push the database schema** — run this once from your own computer (with Node.js installed)
   after cloning the repo and setting your `.env` file (copy `.env.example` to `.env` and fill it in):
   ```
   npm install
   npx prisma db push
   npm run seed
   ```
   This creates the tables and loads your real menu, reviews, and first admin login.

6. **Deploy** — Vercel deploys automatically on every push to `main`. Your site will be live at
   a free `yourproject.vercel.app` URL, and later can be pointed at your own domain
   (fusiontreats-barnet.uk) via Vercel's Domains settings.

## Logging in as admin
Go to `/admin/login` on your live site and use the email/password you set in
`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`. Change the password by re-running the
seed step with new values, or ask for a "change password" feature to be added.

## Notes
- Online ordering/checkout is intentionally **not** included, per current scope.
- Images: the `imageUrl` field on menu items accepts any public image URL. Uploading
  images directly (rather than linking) can be added later if needed.
