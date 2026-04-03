create table if not exists public.site_settings (
  key text primary key,
  value_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists site_settings_touch_updated_at on public.site_settings;
create trigger site_settings_touch_updated_at
before update on public.site_settings
for each row
execute function public.touch_updated_at();

grant select on public.site_settings to anon, authenticated;
grant all on public.site_settings to authenticated;

alter table public.site_settings enable row level security;

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
on public.site_settings
for select
to anon, authenticated
using (true);

drop policy if exists "Admins can insert site settings" on public.site_settings;
create policy "Admins can insert site settings"
on public.site_settings
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update site settings" on public.site_settings;
create policy "Admins can update site settings"
on public.site_settings
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete site settings" on public.site_settings;
create policy "Admins can delete site settings"
on public.site_settings
for delete
to authenticated
using (public.is_admin());

insert into public.site_settings (key, value_json)
values
  (
    'homepage_layout',
    '[
      {"id":"header-reveal","visible":true},
      {"id":"hero-intro","visible":true},
      {"id":"stats","visible":true},
      {"id":"topic-pages","visible":true},
      {"id":"legacy-storyline","visible":true},
      {"id":"brochures","visible":true},
      {"id":"ai-assistant","visible":true},
      {"id":"pillars","visible":true}
    ]'::jsonb
  ),
  (
    'homepage_media_slots',
    '[
      {"id":"hero-main-image","src":"","alt":"","caption":""},
      {"id":"manifest-silence","src":"","alt":"","caption":""},
      {"id":"manifest-everything-has-time","src":"","alt":"","caption":""},
      {"id":"manifest-challenge","src":"","alt":"","caption":""},
      {"id":"unity-poster","src":"","alt":"","caption":""},
      {"id":"why-not-nonprofit","src":"","alt":"","caption":""}
    ]'::jsonb
  )
on conflict (key) do nothing;
