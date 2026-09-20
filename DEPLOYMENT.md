# Vercel deployment

## Before deployment

Run `npm run check`. The command must finish without lint or build errors.

Only the Supabase project URL and publishable key belong in frontend variables.
Never add a Supabase service-role key to a variable beginning with `VITE_`.

## Vercel setup

1. Import the Git repository into Vercel.
2. Keep the detected Vite framework preset.
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` under Project
   Settings → Environment Variables for Production and Preview.
4. Enable **Automatically expose System Environment Variables**. The build uses
   `VERCEL_PROJECT_PRODUCTION_URL` for canonical links, sharing metadata,
   `robots.txt` and `sitemap.xml`.
5. Deploy. Vercel runs `npm run build` and publishes `dist`.

## Supabase after deployment

In Supabase Authentication → URL Configuration, set **Site URL** to the final
Vercel production URL. Keep the local development URL in the allowed redirect
URLs if password recovery or email authentication is added later.

The dashboard continues to use the same Supabase database, storage bucket,
authentication and row-level security policies.

## Custom domain later

Add the domain in Vercel, then set `VITE_SITE_URL` to its full HTTPS URL and
redeploy. This makes the custom domain canonical in metadata and the sitemap.
