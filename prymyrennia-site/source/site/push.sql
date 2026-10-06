-- Примирення: tables and schedule for push notifications. Safe to run more than once.
create table if not exists public.push_subs(
  endpoint text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  p256dh text not null,
  auth text not null,
  ua text not null default '',
  created_at timestamptz not null default now()
);
create table if not exists public.push_config(k text primary key, v text not null);
create table if not exists public.push_sent(
  rem_id text not null, day date not null, user_id uuid not null,
  primary key (rem_id, day, user_id)
);
alter table public.push_subs   enable row level security;
alter table public.push_config enable row level security;
alter table public.push_sent   enable row level security;
revoke all on public.push_subs, public.push_config, public.push_sent from anon, authenticated;

create extension if not exists pgcrypto with schema extensions;
create extension if not exists pg_net;
create extension if not exists pg_cron;

insert into public.push_config(k, v) values ('cron', encode(extensions.gen_random_bytes(24), 'hex')) on conflict (k) do nothing;

do $do$
begin
  perform cron.unschedule('push-reminders');
exception when others then null;
end
$do$;
select cron.schedule('push-reminders', '5 * * * *', $job$
  select net.http_post(
    url := 'https://nbxsomiypukivlnralrv.supabase.co/functions/v1/push',
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-cron-key', (select v from public.push_config where k = 'cron')),
    body := '{"op":"run"}'::jsonb
  );
$job$);

select (select count(*) from public.push_config) as config_rows,
       (select count(*) from cron.job where jobname = 'push-reminders') as jobs;
