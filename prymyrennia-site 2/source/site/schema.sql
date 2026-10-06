
create table if not exists public.staff(
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null default '',
  name text not null default '',
  role text not null default 'pending' check (role in ('pending','deacon','full','owner','blocked')),
  person_id text not null default '',
  created_at timestamptz not null default now()
);
create table if not exists public.docs(
  col text not null,
  id text not null,
  data jsonb not null default '{}'::jsonb,
  deacon text not null default '',
  updated_at timestamptz not null default now(),
  updated_by uuid,
  primary key (col,id)
);
create table if not exists public.log(
  id bigint generated always as identity primary key,
  ts timestamptz not null default now(),
  user_id uuid not null default auth.uid(),
  col text not null default '',
  doc_id text not null default '',
  label text not null default '',
  act text not null default '',
  ch jsonb not null default '[]'::jsonb,
  prev text not null default ''
);
create table if not exists public.prefs(
  user_id uuid primary key default auth.uid(),
  data jsonb not null default '{}'::jsonb
);

create or replace function public.my_role() returns text
language sql stable security definer set search_path = public as $fn$
  select coalesce((select role from public.staff where user_id = auth.uid()), 'none')
$fn$;

create or replace function public.my_deacon() returns text
language sql stable security definer set search_path = public as $fn$
  select coalesce((
    select d->>'name'
    from public.docs c,
         jsonb_array_elements(case when jsonb_typeof(c.data->'deacons') = 'array' then c.data->'deacons' else '[]'::jsonb end) d
    where c.col = 'config' and c.id = 'main'
      and jsonb_typeof(d) = 'object'
      and coalesce(d->>'pid','') <> ''
      and d->>'pid' = (select person_id from public.staff where user_id = auth.uid())
    limit 1), '')
$fn$;

create or replace function public.on_new_user() returns trigger
language plpgsql security definer set search_path = public as $fn$
declare first_one boolean;
begin
  first_one := not exists (select 1 from public.staff where role = 'owner');
  insert into public.staff(user_id, email, name, role, person_id)
  values (new.id, coalesce(new.email,''), coalesce(new.raw_user_meta_data->>'name',''),
          case when first_one then 'owner' else 'pending' end,
          case when first_one then 'driq0q7rdmm4salty183' else '' end)
  on conflict (user_id) do nothing;
  return new;
end
$fn$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.on_new_user();

create or replace function public.touch_doc() returns trigger
language plpgsql as $fn$
begin
  new.updated_at := now();
  new.updated_by := auth.uid();
  return new;
end
$fn$;
drop trigger if exists docs_touch on public.docs;
create trigger docs_touch before insert or update on public.docs
  for each row execute function public.touch_doc();

alter table public.staff enable row level security;
alter table public.docs  enable row level security;
alter table public.log   enable row level security;
alter table public.prefs enable row level security;

drop policy if exists staff_read on public.staff;
create policy staff_read on public.staff for select to authenticated
  using (user_id = auth.uid() or public.my_role() in ('full','owner'));
drop policy if exists staff_update on public.staff;
create policy staff_update on public.staff for update to authenticated
  using (public.my_role() = 'owner' or (public.my_role() = 'full' and role <> 'owner'))
  with check (public.my_role() = 'owner' or (public.my_role() = 'full' and role <> 'owner'));
drop policy if exists staff_delete on public.staff;
create policy staff_delete on public.staff for delete to authenticated
  using (public.my_role() = 'owner' and user_id <> auth.uid());

drop policy if exists docs_read on public.docs;
create policy docs_read on public.docs for select to authenticated
  using (public.my_role() in ('deacon','full','owner'));
drop policy if exists docs_insert on public.docs;
create policy docs_insert on public.docs for insert to authenticated
  with check (public.my_role() in ('full','owner')
              or (public.my_role() = 'deacon' and col in ('groups','gmeet','reminders')));
drop policy if exists docs_update on public.docs;
create policy docs_update on public.docs for update to authenticated
  using (public.my_role() in ('full','owner')
         or (public.my_role() = 'deacon' and (col in ('groups','gmeet','reminders')
              or (col = 'people' and deacon <> '' and deacon = public.my_deacon()))))
  with check (public.my_role() in ('full','owner')
         or (public.my_role() = 'deacon' and (col in ('groups','gmeet','reminders')
              or (col = 'people' and deacon <> '' and deacon = public.my_deacon()))));
drop policy if exists docs_delete on public.docs;
create policy docs_delete on public.docs for delete to authenticated
  using (public.my_role() in ('full','owner')
         or (public.my_role() = 'deacon' and col in ('gmeet','reminders')));

drop policy if exists log_insert on public.log;
create policy log_insert on public.log for insert to authenticated
  with check (user_id = auth.uid() and public.my_role() in ('deacon','full','owner'));
drop policy if exists log_read on public.log;
create policy log_read on public.log for select to authenticated
  using (user_id = auth.uid() or public.my_role() in ('full','owner'));

drop policy if exists prefs_all on public.prefs;
create policy prefs_all on public.prefs for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

revoke all on public.staff, public.docs, public.log, public.prefs from anon;
grant select, update, delete on public.staff to authenticated;
grant select, insert, update, delete on public.docs to authenticated;
grant select, insert on public.log to authenticated;
grant select, insert, update, delete on public.prefs to authenticated;
revoke execute on function public.on_new_user() from anon, authenticated, public;
grant execute on function public.my_role(), public.my_deacon() to authenticated;

do $do$
begin
  begin alter publication supabase_realtime add table public.docs;  exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.staff; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.log;   exception when duplicate_object then null; end;
end
$do$;

-- початкові дані сюди не входять: вони вже є в базі

select (select count(*) from public.docs) as docs,
       (select count(*) from pg_policies where schemaname='public') as policies,
       (select count(*) from public.staff) as staff;
