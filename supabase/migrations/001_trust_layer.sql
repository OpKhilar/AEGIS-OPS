-- ============================================================================
-- ResQBharat Trust Layer (idempotent — safe to re-run)
-- counters: fake incident logs, spam check-ins, spoofed GPS, flood attacks
--
-- Setup steps for the operator:
--   1. Run this whole file in the Supabase SQL Editor.
--   2. Enable "Anonymous sign-ins" (Dashboard → Authentication → Providers).
--   3. Backfill pre-existing rows so they don't flood the new pending queue:
--        update public.incidents    set verification_status = 'verified';
--        update public.user_status  set verification_status = 'verified';
--   4. After your first moderator sign-in, register yourself:
--        insert into moderators (user_id)
--        select id from auth.users where email = 'you@example.com';
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 0. Moderators allow-list (empty until you seed it — see header)
-- ---------------------------------------------------------------------------
create table if not exists public.moderators (
  user_id uuid primary key references auth.users(id) on delete cascade,
  added_at timestamptz not null default now()
);

create or replace function public.is_moderator()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.moderators where user_id = auth.uid());
$$;

-- ---------------------------------------------------------------------------
-- 1. Columns: provenance + verification pipeline
-- ---------------------------------------------------------------------------
alter table public.incidents
  add column if not exists reporter_uid uuid,
  add column if not exists ip_hash text,
  add column if not exists verification_status text not null default 'pending',
  add column if not exists corroboration_count integer not null default 0,
  add column if not exists simulated_gps boolean not null default false,
  add column if not exists verified_at timestamptz,
  add column if not exists verified_by uuid;

alter table public.user_status
  add column if not exists reporter_uid uuid,
  add column if not exists ip_hash text,
  add column if not exists verification_status text not null default 'pending',
  add column if not exists simulated_gps boolean not null default false,
  add column if not exists verified_at timestamptz,
  add column if not exists verified_by uuid;

-- ---------------------------------------------------------------------------
-- 2. Constraints: Mumbai geofence + sane values (applies to every insert)
-- ---------------------------------------------------------------------------
alter table public.incidents drop constraint if exists incidents_geofence;
alter table public.incidents
  add constraint incidents_geofence check (
    lat between 18.60 and 19.35 and long between 72.60 and 73.15
  );

alter table public.incidents drop constraint if exists incidents_severity_whitelist;
alter table public.incidents
  add constraint incidents_severity_whitelist check (
    severity in ('critical', 'warning', 'advisory')
  );

alter table public.incidents drop constraint if exists incidents_verification_whitelist;
alter table public.incidents
  add constraint incidents_verification_whitelist check (
    verification_status in ('pending', 'verified', 'rejected', 'expired')
  );

alter table public.incidents drop constraint if exists incidents_text_caps;
alter table public.incidents
  add constraint incidents_text_caps check (
    char_length(coalesce(title, '')) between 3 and 140
    and char_length(coalesce(address, '')) <= 200
    and char_length(coalesce(description, '')) <= 1000
  );

alter table public.user_status drop constraint if exists user_status_geofence;
alter table public.user_status
  add constraint user_status_geofence check (
    lat between 18.60 and 19.35 and long between 72.60 and 73.15
  );

alter table public.user_status drop constraint if exists user_status_headcount;
alter table public.user_status
  add constraint user_status_headcount check (headcount between 1 and 50);

alter table public.user_status drop constraint if exists user_status_type_whitelist;
alter table public.user_status
  add constraint user_status_type_whitelist check (
    status_type in ('SAFE', 'SUPPLIES', 'CRITICAL')
  );

-- ---------------------------------------------------------------------------
-- 3. Rate limit + dedup (fires BEFORE every insert, cannot be bypassed client-side)
-- ---------------------------------------------------------------------------
create or replace function public.enforce_report_rate()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  recent integer;
  dupes  integer;
begin
  -- Max 5 reports per device per 10 minutes
  select count(*) into recent
  from (
    select 1 from public.incidents
      where reporter_uid is not distinct from new.reporter_uid
        and created_at > now() - interval '10 minutes'
    union all
    select 1 from public.user_status
      where reporter_uid is not distinct from new.reporter_uid
        and created_at > now() - interval '10 minutes'
  ) t;

  if recent >= 5 then
    raise exception 'RATE_LIMITED: too many reports from this device, try again later'
      using errcode = 'P0001';
  end if;

  -- Dedup: same device, same type, within ~110m, inside 15 minutes
  if tg_table_name = 'incidents' then
    select count(*) into dupes from public.incidents
    where reporter_uid is not distinct from new.reporter_uid
      and type = new.type
      and round(lat::numeric, 3) = round(new.lat::numeric, 3)
      and round(long::numeric, 3) = round(new.long::numeric, 3)
      and created_at > now() - interval '15 minutes';
  else
    select count(*) into dupes from public.user_status
    where reporter_uid is not distinct from new.reporter_uid
      and status_type = new.status_type
      and round(lat::numeric, 3) = round(new.lat::numeric, 3)
      and round(long::numeric, 3) = round(new.long::numeric, 3)
      and created_at > now() - interval '15 minutes';
  end if;

  if dupes > 0 then
    raise exception 'DUPLICATE: a similar report from this device is already queued'
      using errcode = 'P0001';
  end if;

  return new;
end;
$$;

drop trigger if exists incidents_rate_guard on public.incidents;
create trigger incidents_rate_guard
  before insert on public.incidents
  for each row execute function public.enforce_report_rate();

drop trigger if exists user_status_rate_guard on public.user_status;
create trigger user_status_rate_guard
  before insert on public.user_status
  for each row execute function public.enforce_report_rate();

-- ---------------------------------------------------------------------------
-- 4. Corroboration auto-verify: 2+ independent devices reporting the same
--    incident type within ~330m of each other (inside 2h) => both verified
-- ---------------------------------------------------------------------------
create or replace function public.corroborate_incident()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  distinct_reporters integer;
  peer_ids uuid[];
begin
  if new.verification_status <> 'pending' then
    return new; -- moderator inserts skip the pipeline
  end if;

  select count(distinct coalesce(reporter_uid, id::text))
  into distinct_reporters
  from public.incidents
  where type = new.type
    and verification_status in ('pending', 'verified')
    and created_at > now() - interval '2 hours'
    and round(lat::numeric, 3) between round(new.lat::numeric, 3) - 0.003
                                   and round(new.lat::numeric, 3) + 0.003
    and round(long::numeric, 3) between round(new.long::numeric, 3) - 0.003
                                    and round(new.long::numeric, 3) + 0.003;

  if distinct_reporters >= 2 then
    select array_agg(id) into peer_ids
    from public.incidents
    where type = new.type
      and verification_status = 'pending'
      and created_at > now() - interval '2 hours'
      and round(lat::numeric, 3) between round(new.lat::numeric, 3) - 0.003
                                     and round(new.lat::numeric, 3) + 0.003
      and round(long::numeric, 3) between round(new.long::numeric, 3) - 0.003
                                      and round(new.long::numeric, 3) + 0.003;

    update public.incidents
    set verification_status = 'verified',
        verified_at = now(),
        corroboration_count = distinct_reporters
    where id = any(peer_ids);
  else
    update public.incidents
    set corroboration_count = distinct_reporters
    where id = new.id;
  end if;

  return new;
end;
$$;

drop trigger if exists incidents_corroboration on public.incidents;
create trigger incidents_corroboration
  after insert on public.incidents
  for each row execute function public.corroborate_incident();

-- ---------------------------------------------------------------------------
-- 5. Auto-expiry: pending reports older than 30 minutes die quietly
-- ---------------------------------------------------------------------------
create or replace function public.expire_stale_reports()
returns void
language sql
security definer
set search_path = public
as $$
  update public.incidents
  set verification_status = 'expired'
  where verification_status = 'pending'
    and created_at < now() - interval '30 minutes';

  update public.user_status
  set verification_status = 'expired'
  where verification_status = 'pending'
    and created_at < now() - interval '30 minutes';
$$;

-- ---------------------------------------------------------------------------
-- 6. Row Level Security: public can insert (forced pending) + read;
--    only moderators can update / verify / reject
-- ---------------------------------------------------------------------------
alter table public.incidents enable row level security;
alter table public.user_status enable row level security;
alter table public.moderators  enable row level security;

drop policy if exists "incidents_public_read" on public.incidents;
create policy "incidents_public_read" on public.incidents
  for select using (verification_status <> 'pending' or public.is_moderator());

drop policy if exists "incidents_public_insert_pending" on public.incidents;
create policy "incidents_public_insert_pending" on public.incidents
  for insert to anon, authenticated
  with check (verification_status = 'pending');

drop policy if exists "incidents_moderator_update" on public.incidents;
create policy "incidents_moderator_update" on public.incidents
  for update to authenticated
  using (public.is_moderator())
  with check (public.is_moderator());

drop policy if exists "user_status_public_read" on public.user_status;
create policy "user_status_public_read" on public.user_status
  for select using (verification_status <> 'pending' or public.is_moderator());

drop policy if exists "user_status_public_insert_pending" on public.user_status;
create policy "user_status_public_insert_pending" on public.user_status
  for insert to anon, authenticated
  with check (verification_status = 'pending');

drop policy if exists "user_status_moderator_update" on public.user_status;
create policy "user_status_moderator_update" on public.user_status
  for update to authenticated
  using (public.is_moderator())
  with check (public.is_moderator());

drop policy if exists "moderators_self_read" on public.moderators;
create policy "moderators_self_read" on public.moderators
  for select using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 7. Moderation queue RPC (expires stale rows first, then returns pending)
-- ---------------------------------------------------------------------------
create or replace function public.get_moderation_queue()
returns setof public.incidents
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_moderator() then
    raise exception 'FORBIDDEN: moderator sign-in required' using errcode = '42501';
  end if;

  perform public.expire_stale_reports();

  return query
  select * from public.incidents
  where verification_status = 'pending'
  order by created_at asc;
end;
$$;

grant execute on function public.get_moderation_queue() to authenticated;
