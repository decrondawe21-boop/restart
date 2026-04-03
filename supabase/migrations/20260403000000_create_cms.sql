create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  email text primary key,
  created_at timestamptz not null default timezone('utc', now()),
  check (email = lower(email))
);

create table if not exists public.cms_entries (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('news', 'blog')),
  title text not null,
  slug text not null unique,
  category text not null,
  excerpt text not null,
  content_html text not null default '<p></p>',
  cover_image_url text,
  source_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists cms_entries_type_status_published_idx
  on public.cms_entries (type, status, published_at desc);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists cms_entries_touch_updated_at on public.cms_entries;
create trigger cms_entries_touch_updated_at
before update on public.cms_entries
for each row
execute function public.touch_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

grant usage on schema public to anon, authenticated;
grant select on public.cms_entries to anon, authenticated;
grant all on public.cms_entries to authenticated;
grant select on public.admin_users to authenticated;
grant execute on function public.is_admin() to anon, authenticated;

alter table public.admin_users enable row level security;
alter table public.cms_entries enable row level security;

drop policy if exists "Admins can read admin users" on public.admin_users;
create policy "Admins can read admin users"
on public.admin_users
for select
to authenticated
using (public.is_admin());

drop policy if exists "Public can read published cms entries" on public.cms_entries;
create policy "Public can read published cms entries"
on public.cms_entries
for select
to anon, authenticated
using ((status = 'published') or public.is_admin());

drop policy if exists "Admins can insert cms entries" on public.cms_entries;
create policy "Admins can insert cms entries"
on public.cms_entries
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update cms entries" on public.cms_entries;
create policy "Admins can update cms entries"
on public.cms_entries
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete cms entries" on public.cms_entries;
create policy "Admins can delete cms entries"
on public.cms_entries
for delete
to authenticated
using (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'cms-media',
  'cms-media',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read cms media" on storage.objects;
create policy "Public can read cms media"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'cms-media');

drop policy if exists "Admins can upload cms media" on storage.objects;
create policy "Admins can upload cms media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'cms-media'
  and public.is_admin()
);

drop policy if exists "Admins can update cms media" on storage.objects;
create policy "Admins can update cms media"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'cms-media'
  and public.is_admin()
)
with check (
  bucket_id = 'cms-media'
  and public.is_admin()
);

drop policy if exists "Admins can delete cms media" on storage.objects;
create policy "Admins can delete cms media"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'cms-media'
  and public.is_admin()
);

insert into public.admin_users (email)
values
  ('info@david-kozak.com'),
  ('restartintegrace@david-kozak.com')
on conflict (email) do nothing;

insert into public.cms_entries (
  type,
  title,
  slug,
  category,
  excerpt,
  content_html,
  status,
  published_at
)
values
  (
    'news',
    'Žádost o PP: Majer Jaroslav - REST||ART se připojuje',
    'zadost-o-pp-majer-jaroslav-rest-art-se-pripojuje',
    'Postpenitenciární péče',
    'REST||ART se připojuje k žádosti o podmíněné propuštění a potvrzuje návaznou podporu po výstupu: doprovod při propuštění, zajištěné ubytování v Ústí nad Labem, předjednané pracovní uplatnění, sociální asistenci, dluhové poradenství a pravidelný mentoring v průběhu zkušební doby.',
    '<p>REST||ART se připojuje k žádosti o podmíněné propuštění pana Majera Jaroslava a potvrzuje připravenost převzít návaznou postpenitenciární podporu ihned po výstupu.</p><h3>Co po propuštění zajišťujeme</h3><ul><li>doprovod při výstupu a stabilizační kontakt v prvních dnech</li><li>ubytování na adrese Drážďanská 51/52, 400 07 Ústí nad Labem</li><li>předjednané pracovní uplatnění a pomoc s nástupem do režimu</li><li>sociální asistenci a orientaci v běžném fungování po výkonu trestu</li><li>dluhové poradenství a průběžný mentoring během zkušební doby</li></ul><p>Cílem je, aby propuštění nebylo jednorázovým aktem, ale reálným přechodem do stabilnějšího života. REST||ART se v tomto případě nepřipojuje jen formálně, ale deklaruje konkrétní kapacitu a odpovědnost za návaznou podporu.</p>',
    'published',
    '2026-04-03T09:00:00+00'
  ),
  (
    'blog',
    'Brána na svobodu: proč práce rozhoduje o návratu do života',
    'brana-na-svobodu-proc-prace-rozhoduje-o-navratu-do-zivota',
    'Analýza',
    'Zaměstnání není jen příjem. Je to bod obratu, který snižuje recidivu, vrací důstojnost a dává člověku nový rytmus.',
    '<p>Práce je v logice REST||ART víc než pracovní smlouva. Je to struktura dne, nové sociální vazby, odpovědnost a možnost znovu vidět vlastní hodnotu.</p><p>Bez pracovního ukotvení se návrat z výkonu trestu nebo z dlouhodobého vyloučení často rozpadá na sérii improvizovaných kroků. Naopak včasný vstup do smysluplné práce umí stabilizovat finance, režim i vztahy.</p>',
    'published',
    '2025-10-15T09:00:00+00'
  ),
  (
    'blog',
    'Strategická zpráva REST||ART: ekonomická efektivita versus systémová zátěž',
    'strategicka-zprava-rest-art-ekonomicka-efektivita-versus-systemova-zatez',
    'Strategie',
    'Současný systém stojí veřejné rozpočty miliardy korun, zatímco cílená reintegrace umí snížit recidivu i dlouhodobé náklady.',
    '<p>Model REST||ART stojí na jednoduchém principu: investice do včasné stabilizace a pracovní reintegrace je levnější než opakované selhání systému.</p><p>Do výpočtů vstupují náklady na výkon trestu, sociální dávky, zdravotní zátěž i ztracený ekonomický potenciál. Proto na webu pracujeme s návratností, rozpočty i měřitelnými přínosy po jednotlivých programech.</p>',
    'published',
    '2025-11-10T09:00:00+00'
  ),
  (
    'blog',
    'Tone of Voice REST||ART: důstojný, přímý a transformační jazyk',
    'tone-of-voice-rest-art-dustojny-primy-a-transformacni-jazyk',
    'Značka',
    'Komunikace projektu staví na empatii, odvaze a výzvě k akci. Bez patosu, bez lítosti, s respektem ke skutečným příběhům.',
    '<p>REST||ART komunikuje přímo. Nepracuje s lítostí ani s efektními zkratkami, ale s jazykem, který nese odpovědnost, důstojnost a konkrétní nabídku změny.</p><p>Proto se v obsahu opakují silné claimy, skutečné příběhy a jasně formulované závazky. Značka nemá přikrývat problém, ale zpřítomnit možnost obratu.</p>',
    'published',
    '2026-01-12T09:00:00+00'
  )
on conflict (slug) do update
set
  type = excluded.type,
  title = excluded.title,
  category = excluded.category,
  excerpt = excluded.excerpt,
  content_html = excluded.content_html,
  status = excluded.status,
  published_at = excluded.published_at;
