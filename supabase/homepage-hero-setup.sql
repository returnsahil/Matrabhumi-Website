-- Run this once in the Supabase SQL Editor.
-- It creates the public homepage settings record and a dedicated public bucket.
create table if not exists public.site_settings (
  id text primary key,
  hero_line_en text not null default '',
  hero_line_hi text not null default '',
  hero_image_path text,
  updated_at timestamptz not null default now(),
  constraint site_settings_homepage_only check (id = 'homepage'),
  constraint site_settings_hero_line_en_length check (char_length(hero_line_en) <= 120),
  constraint site_settings_hero_line_hi_length check (char_length(hero_line_hi) <= 120)
);

alter table public.site_settings enable row level security;

grant select on public.site_settings to anon, authenticated;
grant insert, update on public.site_settings to authenticated;

drop policy if exists "Anyone can read homepage settings" on public.site_settings;
create policy "Anyone can read homepage settings"
on public.site_settings
for select
to anon, authenticated
using (id = 'homepage');

drop policy if exists "Admins can create homepage settings" on public.site_settings;
create policy "Admins can create homepage settings"
on public.site_settings
for insert
to authenticated
with check (id = 'homepage' and public.is_admin()); 0

drop policy if exists "Admins can update homepage settings" on public.site_settings;
create policy "Admins can update homepage settings"
on public.site_settings
for update
to authenticated
using (id = 'homepage' and public.is_admin())
with check (id = 'homepage' and public.is_admin());

insert into public.site_settings (id)
values ('homepage')
on conflict (id) do nothing;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'site-assets',
  'site-assets',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Anyone can view site assets" on storage.objects;
create policy "Anyone can view site assets"
on storage.objects
for select
to public
using (bucket_id = 'site-assets');

drop policy if exists "Admins can upload site assets" on storage.objects;
create policy "Admins can upload site assets"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'site-assets' and public.is_admin());

drop policy if exists "Admins can update site assets" on storage.objects;
create policy "Admins can update site assets"
on storage.objects
for update
to authenticated
using (bucket_id = 'site-assets' and public.is_admin())
with check (bucket_id = 'site-assets' and public.is_admin());

drop policy if exists "Admins can delete site assets" on storage.objects;
create policy "Admins can delete site assets"
on storage.objects
for delete
to authenticated
using (bucket_id = 'site-assets' and public.is_admin());
