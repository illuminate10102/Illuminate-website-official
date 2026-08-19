-- ============================================================================
-- Illuminate — Director removal motions
-- ============================================================================
--
-- Run this in the Supabase SQL editor after schema.sql. It is idempotent, so
-- re-running it is safe.
--
-- No single Director can remove or demote a person on their own. One opens a
-- motion naming the action they want; it sits in the open state until three
-- Directors have voted yes, at which point tally_removal_votes() carries the
-- action out. This deliberately mirrors the 3-vote quorum that publishes a
-- guide (tally_guide_admin_votes() in schema.sql) — same rule, same shape.
--
-- Three ways out of an open motion:
--   * three yes votes           → executed
--   * the opener cancels it     → cancelled
--   * (nothing else — a motion never expires on its own)
--
-- Opening a vote is not itself an accusation anyone else can see: these two
-- tables are Director-only at the RLS level, and the target is never told.
-- The audit log records the outcome, not the deliberation.

-- --------------------------------------------------------------- tables ----

-- delete         — profile row and everything cascading off it is erased, and
--                  the auth user with it, so the account cannot sign in again.
-- demote_member  — dropped to Member. Their own academics, activities, and
--                  goals survive untouched; they simply lose the team tabs.
-- demote_officer — dropped to Officer, keeping their review category.
create table if not exists public.removal_motions (
  id            uuid primary key default gen_random_uuid(),
  target_id     uuid not null references public.profiles (id) on delete cascade,
  opened_by     uuid references public.profiles (id) on delete set null,
  action        text not null check (action in ('delete', 'demote_member', 'demote_officer')),
  reason        text not null,
  status        text not null default 'open' check (status in ('open', 'executed', 'cancelled')),
  -- Denormalized count of removal_votes, kept in sync by the trigger below so
  -- the UI can show "2 of 3" without a second query per row.
  approve_votes int not null default 0,
  created_at    timestamptz not null default now(),
  resolved_at   timestamptz
);

-- One open motion per person at a time. Two Directors filing competing
-- motions against the same target would split the quorum and neither would
-- ever reach three; the second filing is refused instead.
create unique index if not exists removal_motions_one_open_per_target
  on public.removal_motions (target_id)
  where status = 'open';

create index if not exists removal_motions_status_idx on public.removal_motions (status);

-- A Director may change their mind up until quorum: the vote is an upsert on
-- the unique constraint, never a second row.
create table if not exists public.removal_votes (
  id         uuid primary key default gen_random_uuid(),
  motion_id  uuid not null references public.removal_motions (id) on delete cascade,
  admin_id   uuid not null references public.profiles (id) on delete cascade,
  approve    boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint removal_votes_one_per_admin unique (motion_id, admin_id)
);

create index if not exists removal_votes_motion_idx on public.removal_votes (motion_id);

-- --------------------------------------------------------------- grants ----

-- No delete on either table: a motion is withdrawn by setting status to
-- 'cancelled', and a vote is retracted by flipping `approve` to false. Both
-- leave a record behind, which is the point.
grant select, insert, update on public.removal_motions to authenticated;
grant select, insert, update on public.removal_votes   to authenticated;

-- -------------------------------------------------------------- quorum -----

-- THE QUORUM. Recounts after every vote and, the moment three Directors have
-- voted yes, carries out whichever action the motion named. Runs as security
-- definer so it can touch profiles and auth.users regardless of who cast the
-- deciding vote — the RLS policies below are what decide who may get this far.
create or replace function public.tally_removal_votes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_motion  public.removal_motions%rowtype;
  v_target  public.profiles%rowtype;
  v_approve int;
begin
  select * into v_motion
  from public.removal_motions
  where id = new.motion_id
  for update;

  -- Cancelled or already carried out between the vote landing and this
  -- trigger running — nothing left to count.
  if v_motion.status <> 'open' then
    return new;
  end if;

  select count(*) into v_approve
  from public.removal_votes
  where motion_id = new.motion_id and approve;

  -- Waves this function's own writes past guard_removal_motion(), which
  -- otherwise refuses every status change that isn't a manual cancellation.
  perform set_config('illuminate.internal_removal', 'on', true);

  update public.removal_motions
  set approve_votes = v_approve
  where id = new.motion_id;

  if v_approve < 3 then
    return new;
  end if;

  select * into v_target from public.profiles where id = v_motion.target_id;

  if v_motion.action = 'delete' then
    insert into public.activity_log (actor_id, action, entity, entity_id, detail)
    values (
      auth.uid(), 'member_removed', 'profile', v_motion.target_id,
      coalesce(v_target.full_name, v_target.email) || ' was removed by 3 Directors — ' || v_motion.reason
    );

    -- profiles.id references auth.users on delete cascade, so removing the
    -- auth user takes the profile and everything hanging off it with it. If
    -- this function's owner can't reach auth.users (a project where the
    -- migration was run as a non-superuser), fall back to deleting the
    -- profile alone: that already leaves the account with nothing to load
    -- and no way into the dashboard.
    begin
      delete from auth.users where id = v_motion.target_id;
    exception when others then
      delete from public.profiles where id = v_motion.target_id;
    end;

  elsif v_motion.action = 'demote_member' then
    update public.profiles
    set role = 'member', officer_category = null
    where id = v_motion.target_id;

    insert into public.activity_log (actor_id, action, entity, entity_id, detail)
    values (
      auth.uid(), 'member_demoted', 'profile', v_motion.target_id,
      coalesce(v_target.full_name, v_target.email) || ' was dropped to Member by 3 Directors — ' || v_motion.reason
    );

  elsif v_motion.action = 'demote_officer' then
    update public.profiles
    set role = 'officer'
    where id = v_motion.target_id;

    insert into public.activity_log (actor_id, action, entity, entity_id, detail)
    values (
      auth.uid(), 'member_demoted', 'profile', v_motion.target_id,
      coalesce(v_target.full_name, v_target.email) || ' was dropped to Officer by 3 Directors — ' || v_motion.reason
    );
  end if;

  -- On the delete path the motion row is already gone (cascaded off the
  -- profile), so this updates nothing and that is correct.
  update public.removal_motions
  set status = 'executed', resolved_at = now()
  where id = v_motion.id;

  return new;
end;
$$;

drop trigger if exists removal_votes_tally on public.removal_votes;
create trigger removal_votes_tally
  after insert or update on public.removal_votes
  for each row execute function public.tally_removal_votes();

-- Only the Director who opened a motion may withdraw it, and only while it is
-- still open — an executed motion is history and stays that way. Everything
-- else about a motion is immutable once filed; you cannot quietly swap
-- "demote to Officer" for "delete" after two people have already voted.
create or replace function public.guard_removal_motion()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- The tally trigger runs as this same definer and needs to write
  -- approve_votes and status, so it flags itself past these checks.
  if current_setting('illuminate.internal_removal', true) = 'on' then
    return new;
  end if;

  if new.status is distinct from old.status then
    if old.status <> 'open' then
      raise exception 'That motion is already resolved.';
    end if;
    if new.status <> 'cancelled' then
      raise exception 'A motion is only ever cancelled by hand; three votes carry it out.';
    end if;
    if old.opened_by is distinct from auth.uid() then
      raise exception 'Only the Director who opened this motion can cancel it.';
    end if;
    new.resolved_at := now();
  end if;

  new.target_id := old.target_id;
  new.opened_by := old.opened_by;
  new.action    := old.action;
  new.reason    := old.reason;
  return new;
end;
$$;

drop trigger if exists removal_motions_guard on public.removal_motions;
create trigger removal_motions_guard
  before update on public.removal_motions
  for each row execute function public.guard_removal_motion();

-- ------------------------------------------------------------------ RLS ----

alter table public.removal_motions enable row level security;
alter table public.removal_votes   enable row level security;

drop policy if exists removal_motions_select on public.removal_motions;
drop policy if exists removal_motions_insert on public.removal_motions;
drop policy if exists removal_motions_update on public.removal_motions;

-- Directors only, on every operation. The person a motion names never sees it.
create policy removal_motions_select on public.removal_motions
  for select to authenticated
  using (public.is_admin());

-- You file in your own name, against somebody who isn't you.
create policy removal_motions_insert on public.removal_motions
  for insert to authenticated
  with check (
    public.is_admin()
    and opened_by = auth.uid()
    and target_id <> auth.uid()
    and status = 'open'
  );

create policy removal_motions_update on public.removal_motions
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists removal_votes_select on public.removal_votes;
drop policy if exists removal_votes_insert on public.removal_votes;
drop policy if exists removal_votes_update on public.removal_votes;

create policy removal_votes_select on public.removal_votes
  for select to authenticated
  using (public.is_admin());

-- A Director votes in their own name, only on an open motion, and never on
-- one that names them. The opener's own vote counts toward the three.
create policy removal_votes_insert on public.removal_votes
  for insert to authenticated
  with check (
    public.is_admin()
    and admin_id = auth.uid()
    and exists (
      select 1 from public.removal_motions m
      where m.id = motion_id and m.status = 'open' and m.target_id <> auth.uid()
    )
  );

create policy removal_votes_update on public.removal_votes
  for update to authenticated
  using (public.is_admin() and admin_id = auth.uid())
  with check (
    public.is_admin()
    and admin_id = auth.uid()
    and exists (
      select 1 from public.removal_motions m
      where m.id = motion_id and m.status = 'open' and m.target_id <> auth.uid()
    )
  );
