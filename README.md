# Matrabhumi Construction

Responsive English/Hindi architecture website with a React frontend and Supabase database, authentication and image storage.

## Local development

1. Install dependencies with `npm ci`.
2. Copy `.env.example` to `.env.local` and fill in the public Supabase connection values.
3. Run `npm run dev`.

## Production build

Set `VITE_SITE_URL` to the intended public URL, then run `npm run check` (lint and production build). The deployable files are generated in `dist/`. Run `npm run preview` to inspect that build locally.

Production builds require both Supabase variables and a site URL. A Cloudflare build can use its automatic `CF_PAGES_URL` when `VITE_SITE_URL` is unset. The URL is embedded in canonical links, sharing metadata, structured data, sitemap and robots files. Rebuild after changing it.

All `VITE_` values are public in browser code. Use only the Supabase publishable key; never use a service-role key. Database and storage policies must enforce administrator-only writes.

## Cloudflare Pages deployment

Use these settings when connecting the repository:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Build command | `npm run check` |
| Build output directory | `dist` |
| Root directory | Repository root |
| `NODE_VERSION` | `22` |
| `VITE_SUPABASE_URL` | Existing Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Existing Supabase publishable key |
| `VITE_SITE_URL` | Final HTTPS domain when available; otherwise omit to use `CF_PAGES_URL` |

For direct upload, build locally with the correct public site URL and upload the contents of `dist`. Environment variables must be present at build time; uploading the files does not rebuild them.

Cloudflare Pages serves React Router paths through its built-in SPA fallback when there is no top-level `404.html`. Keep `dist/index.html` and do not add `public/404.html`. `public/_headers` is copied into `dist` and supplies security, admin no-index and hashed-asset cache headers.

After publishing, verify direct visits and refreshes on `/`, `/about`, `/projects`, `/contact`, and `/admin`; check language/theme persistence, published project images and admin sign-in. Configure the production site URL in Supabase Auth and add any redirect URLs used by authentication flows. Then connect the custom domain and rebuild with its `VITE_SITE_URL`.

Use Dhruv-owned hosting and domain accounts for handover. Only publish genuine project photos as completed Matrabhumi work; generated architectural concepts must remain identifiable as concepts.
