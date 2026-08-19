-- ============================================================================
-- Illuminate dashboard — complete schema, triggers, and Row Level Security.
--
-- Run this whole file once in the Supabase SQL editor (Dashboard → SQL Editor
-- → New query → paste → Run). It is idempotent: re-running it drops and
-- recreates the policies and triggers, but never touches your data.
--
-- Reading order:
--   1. Enums
--   2. Tables
--   2b. Table grants      (RLS narrows access; grants create it — need both)
--   3. Helper functions   (SECURITY DEFINER — these break RLS recursion)
--   4. Triggers           (profile bootstrap + privilege guards)
--   5. Row Level Security (the real permission system)
--   6. Storage            (private transcript bucket + its policies)
--   7. First Director     (automatic — see seed_admin_email() in section 3)
--
-- SECURITY NOTE ON HELPERS: the `current_user_role()` helper is SECURITY
-- DEFINER on purpose. A policy on `profiles` that queries `profiles` to find
-- the caller's role recurses forever; a definer function reads the row with
-- RLS bypassed and returns just the role, which is safe because it exposes
-- nothing but the caller's own tier.
-- ============================================================================


-- ============================================================================
-- 1. ENUMS
-- ============================================================================

do $$ begin
  create type public.user_role as enum ('member', 'associate', 'officer', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.submission_status as enum (
    'pending_officer',
    'changes_requested',
    'pending_admin',
    'approved',
    'rejected'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.task_priority as enum ('high', 'medium', 'low');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.task_status as enum ('todo', 'in_progress', 'done');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.goal_horizon as enum ('short_term', 'long_term');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.goal_status as enum ('not_started', 'in_progress', 'done');
exception when duplicate_object then null; end $$;


-- ============================================================================
-- 2. TABLES
-- ============================================================================

-- One row per auth user. Created automatically by the trigger in section 4 —
-- never insert into this by hand.
create table if not exists public.profiles (
  id               uuid primary key references auth.users (id) on delete cascade,
  email            text not null,
  full_name        text,
  avatar_url       text,
  grade_level      text,
  interests        text,
  role             public.user_role not null default 'member',
  -- Only meaningful for Officers: the single guide subsection they review,
  -- e.g. "extracurriculars:arts-performance" — a "<category slug>:<tier
  -- slug>" key from app/data/categories.ts, never a bare main category like
  -- "extracurriculars". See app/lib/roles.ts (REVIEW_SECTIONS).
  officer_category text,
  created_at       timestamptz not null default now()
);

create table if not exists public.academic_records (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  course_name text not null,
  grade       text not null,
  credits     numeric(4, 2) not null default 1 check (credits > 0),
  semester    text not null default 'Unsorted',
  created_at  timestamptz not null default now()
);

create table if not exists public.transcripts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  -- Path inside the private `transcripts` storage bucket: "<user id>/<file>".
  file_path   text not null,
  file_name   text not null,
  note        text,
  uploaded_at timestamptz not null default now()
);

create table if not exists public.ap_scores (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references public.profiles (id) on delete cascade,
  subject            text not null,
  score              smallint not null check (score between 1 and 5),
  exam_year          smallint not null,
  -- Path inside the private `ap-score-reports` bucket, "<user id>/<file>". Optional.
  score_report_path  text,
  score_report_name  text,
  created_at         timestamptz not null default now()
);

create table if not exists public.standardized_test_scores (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles (id) on delete cascade,
  -- One of STANDARD_TESTS' keys (app/data/standardizedTests.ts), or 'Custom'.
  test_type         text not null,
  -- Only set when test_type = 'Custom'.
  custom_test_name  text,
  score             numeric(6, 1) not null check (score >= 0),
  max_score         numeric(6, 1) not null check (max_score > 0),
  test_date         date not null,
  created_at        timestamptz not null default now(),
  constraint standardized_test_scores_score_in_range check (score <= max_score)
);

create table if not exists public.extracurriculars (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles (id) on delete cascade,
  category      text not null,
  activity_name text not null,
  position      text,
  hours         numeric(6, 1) not null default 0 check (hours >= 0),
  achievements  text,
  created_at    timestamptz not null default now()
);

create table if not exists public.goals (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  title       text not null,
  detail      text,
  horizon     public.goal_horizon not null default 'short_term',
  status      public.goal_status not null default 'not_started',
  target_date date,
  created_at  timestamptz not null default now()
);

create table if not exists public.guides_submissions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  title       text not null,
  doc_url     text not null,
  -- A "<category slug>:<tier slug>" review-section key (see REVIEW_SECTIONS
  -- in app/lib/roles.ts) — it is what routes the submission to exactly one
  -- Officer, whose officer_category must match this exactly.
  category    text not null,
  status      public.submission_status not null default 'pending_officer',
  notes       text,
  feedback    text,
  reviewed_by uuid references public.profiles (id) on delete set null,
  reviewed_at timestamptz,
  -- Set by the Officer the moment they pass this to the Directors. This is
  -- the amount that gets granted automatically once 3 Directors approve —
  -- Directors vote on this number, they don't set their own.
  officer_suggested_hours numeric(5, 1),
  -- Denormalized tallies of guide_admin_votes, kept in sync by
  -- tally_guide_admin_votes() below. Associates and Officers read these
  -- directly (they can't see guide_admin_votes itself) so "2 of 3 Directors
  -- so far" can show up on their dashboards without a second RLS surface.
  admin_approve_votes int not null default 0,
  admin_reject_votes  int not null default 0,
  admin_changes_votes int not null default 0,
  created_at  timestamptz not null default now()
);

-- Every Director's individual vote on a submission sitting in pending_admin.
-- A guide is only published — and its hours only granted — once one outcome
-- (approve / reject / changes_requested) collects 3 votes; see
-- tally_guide_admin_votes(). Directors may change their mind and re-vote
-- (upsert on the unique constraint below) up until quorum is reached.
create table if not exists public.guide_admin_votes (
  id            uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.guides_submissions (id) on delete cascade,
  admin_id      uuid not null references public.profiles (id) on delete cascade,
  decision      text not null check (decision in ('approve', 'reject', 'changes_requested')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint guide_admin_votes_one_per_admin unique (submission_id, admin_id)
);

-- Idempotent column additions for databases that already ran an earlier
-- version of this file — `create table if not exists` above only applies to
-- a brand-new install, it does nothing to a `guides_submissions` table that
-- already exists without these columns.
alter table public.guides_submissions add column if not exists officer_suggested_hours numeric(5, 1);
alter table public.guides_submissions add column if not exists admin_approve_votes int not null default 0;
alter table public.guides_submissions add column if not exists admin_reject_votes  int not null default 0;
alter table public.guides_submissions add column if not exists admin_changes_votes int not null default 0;

create table if not exists public.tasks (
  id            uuid primary key default gen_random_uuid(),
  -- Exactly one of these two is set: a named person, or a whole tier.
  assigned_to   uuid references public.profiles (id) on delete cascade,
  assigned_role public.user_role,
  created_by    uuid references public.profiles (id) on delete set null,
  title         text not null,
  detail        text,
  priority      public.task_priority not null default 'medium',
  due_date      date,
  status        public.task_status not null default 'todo',
  category      text,
  created_at    timestamptz not null default now(),
  constraint tasks_have_a_target check (assigned_to is not null or assigned_role is not null)
);

create table if not exists public.volunteer_hours (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  guide_id    uuid references public.guides_submissions (id) on delete set null,
  hours       numeric(5, 1) not null check (hours > 0),
  reason      text not null,
  approved_by uuid references public.profiles (id) on delete set null,
  date        date not null default current_date,
  created_at  timestamptz not null default now()
);

-- Append-only. Nothing in the app or these policies grants update or delete.
create table if not exists public.activity_log (
  id         uuid primary key default gen_random_uuid(),
  actor_id   uuid references public.profiles (id) on delete set null,
  action     text not null,
  entity     text not null,
  entity_id  uuid,
  detail     text,
  created_at timestamptz not null default now()
);

create index if not exists academic_records_user_idx  on public.academic_records (user_id);
create index if not exists transcripts_user_idx       on public.transcripts (user_id);
create index if not exists ap_scores_user_idx         on public.ap_scores (user_id);
create index if not exists standardized_scores_user_idx on public.standardized_test_scores (user_id);
create index if not exists extracurriculars_user_idx  on public.extracurriculars (user_id);
create index if not exists goals_user_idx             on public.goals (user_id);
create index if not exists submissions_user_idx       on public.guides_submissions (user_id);
create index if not exists submissions_category_idx   on public.guides_submissions (category);
create index if not exists submissions_status_idx     on public.guides_submissions (status);
create index if not exists guide_admin_votes_submission_idx on public.guide_admin_votes (submission_id);
create index if not exists tasks_assigned_to_idx      on public.tasks (assigned_to);
create index if not exists tasks_assigned_role_idx    on public.tasks (assigned_role);
create index if not exists volunteer_hours_user_idx   on public.volunteer_hours (user_id);
create index if not exists activity_log_created_idx   on public.activity_log (created_at desc);


-- ============================================================================
-- 2b. TABLE GRANTS
-- ============================================================================
--
-- RLS decides WHICH ROWS a caller may touch. It does not grant access to the
-- table itself — without the grants below, every request fails with
-- "permission denied for table X" before a single policy is consulted.
--
-- `authenticated` is the role Supabase runs a logged-in user's requests as.
-- `anon` deliberately gets nothing: the dashboard has no public data, so a
-- signed-out visitor should be refused at the table level.
--
-- These are safe grants: every one of these tables has RLS enabled above, so
-- a caller still only ever sees the rows their policies allow.

grant usage on schema public to authenticated;

grant select, insert, update, delete on public.profiles           to authenticated;
grant select, insert, update, delete on public.academic_records   to authenticated;
grant select, insert, update, delete on public.transcripts        to authenticated;
grant select, insert, update, delete on public.ap_scores          to authenticated;
grant select, insert, update, delete on public.standardized_test_scores to authenticated;
grant select, insert, update, delete on public.extracurriculars   to authenticated;
grant select, insert, update, delete on public.goals              to authenticated;
grant select, insert, update, delete on public.guides_submissions to authenticated;
-- No delete: a vote is retracted by casting a different one (upsert), never
-- removed outright. Only the tally trigger (running as the table owner,
-- which bypasses RLS/grants) clears votes when a submission re-enters
-- pending_admin for a fresh round.
grant select, insert, update         on public.guide_admin_votes    to authenticated;
grant select, insert, update, delete on public.tasks              to authenticated;
grant select, insert, update, delete on public.volunteer_hours    to authenticated;

-- Append-only: no update or delete, matching the policies in section 5.
grant select, insert on public.activity_log to authenticated;

-- The signup trigger inserts into profiles as the `supabase_auth_admin` role,
-- which owns auth.users. Without this it cannot reach public.profiles and
-- every signup fails with "Database error saving new user".
grant usage on schema public to supabase_auth_admin;
grant insert, select on public.profiles to supabase_auth_admin;


-- ============================================================================
-- 3. HELPER FUNCTIONS
-- ============================================================================

-- The caller's role, read with RLS bypassed so profile policies can call it
-- without recursing. Returns 'member' for anyone without a profile row.
create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role from public.profiles where id = auth.uid()),
    'member'::public.user_role
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_role() = 'admin';
$$;

-- The review-section key this Officer reviews (e.g.
-- "extracurriculars:arts-performance"), or null for everyone else.
create or replace function public.current_officer_category()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select officer_category
  from public.profiles
  where id = auth.uid() and role = 'officer';
$$;

-- Rank comparison, so policies can say "associate or above" in one call.
create or replace function public.role_at_least(minimum public.user_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select array_position(
           array['member', 'associate', 'officer', 'admin']::public.user_role[],
           public.current_user_role()
         )
      >= array_position(
           array['member', 'associate', 'officer', 'admin']::public.user_role[],
           minimum
         );
$$;

-- The one email that gets Director on signup, so the platform has a first
-- admin without a manual SQL step. Everyone else still starts as Member and
-- has to be promoted from the User Management tab.
--
-- >>> CHANGE THIS EMAIL to whichever address you'll actually sign up with. <<<
-- It's read in exactly two places below (the signup trigger, and the
-- one-time backfill in section 7) — both need to match if you edit this.
create or replace function public.seed_admin_email()
returns text
language sql
immutable
as $$
  select 'illuminate10102@gmail.com';
$$;

-- RLS policies call these helpers on the caller's behalf, so the caller needs
-- execute permission or every policy evaluation fails.
grant execute on function public.current_user_role()        to authenticated;
grant execute on function public.is_admin()                 to authenticated;
grant execute on function public.current_officer_category() to authenticated;
grant execute on function public.role_at_least(public.user_role) to authenticated;
grant execute on function public.seed_admin_email()         to authenticated, supabase_auth_admin;


-- ============================================================================
-- 4. TRIGGERS
-- ============================================================================

-- Every new auth user gets a profile in the same transaction, seeded from the
-- metadata the signup form passes in options.data. Everyone starts as Member,
-- except the seed admin address above, which starts as Director.
--
-- Google sign-in populates this same raw_user_meta_data with `full_name` and
-- `avatar_url` (Supabase normalizes Google's OIDC claims to those two keys),
-- so a Google account gets a real name and photo with no extra code here.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, grade_level, interests, role)
  values (
    new.id,
    new.email,
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), ''),
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'avatar_url', '')), ''),
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'grade_level', '')), ''),
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'interests', '')), ''),
    case
      when lower(new.email) = lower(public.seed_admin_email()) then 'admin'::public.user_role
      else 'member'::public.user_role
    end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Users may edit their own name, grade, interests, and avatar. Role and
-- officer_category are privileges, not preferences: only a Director changes
-- them. The UPDATE policy alone can't express "any column except these two",
-- so the rule lives here.
create or replace function public.guard_profile_privileges()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (new.role is distinct from old.role
      or new.officer_category is distinct from old.officer_category)
     and not public.is_admin() then
    raise exception 'Only a Director can change a role or officer category.';
  end if;

  -- id and email are owned by auth.users; keep them immutable here.
  new.id := old.id;
  new.email := old.email;
  return new;
end;
$$;

drop trigger if exists profiles_guard_privileges on public.profiles;
create trigger profiles_guard_privileges
  before update on public.profiles
  for each row execute function public.guard_profile_privileges();

-- An assignee may tick a task off; they may not rewrite its priority, due
-- date, or who it belongs to. Directors may change anything.
create or replace function public.guard_task_updates()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_admin() then
    return new;
  end if;

  if new.title        is distinct from old.title
     or new.detail    is distinct from old.detail
     or new.priority  is distinct from old.priority
     or new.due_date  is distinct from old.due_date
     or new.category  is distinct from old.category
     or new.assigned_to   is distinct from old.assigned_to
     or new.assigned_role is distinct from old.assigned_role
     or new.created_by    is distinct from old.created_by then
    raise exception 'Only a Director can edit a task. You can change its status.';
  end if;

  return new;
end;
$$;

drop trigger if exists tasks_guard_updates on public.tasks;
create trigger tasks_guard_updates
  before update on public.tasks
  for each row execute function public.guard_task_updates();

-- Officers move a draft along; they never publish it and never reject it.
-- Those are Director decisions — and, since guide_admin_votes was added,
-- not even a single Director's decision: approving, rejecting, and sending
-- back for changes at the Director stage now all require 3 matching votes
-- (see tally_guide_admin_votes() below). This guard is what makes that a
-- real rule instead of a UI convention — a Director who tries to flip
-- new.status directly on a pending_admin row (skipping the vote) is
-- rejected here, even though is_admin() would otherwise let them do
-- anything to this table.
create or replace function public.guard_submission_review()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- The only legitimate way out of pending_admin is tally_guide_admin_votes()
  -- resolving a vote; it marks its own update with this transaction-local
  -- flag right before running it, so this guard can tell "the system decided
  -- this" apart from "a Director just tried to skip the vote."
  if current_setting('illuminate.internal_update', true) = 'on' then
    return new;
  end if;

  if public.is_admin() then
    if old.status = 'pending_admin' and new.status is distinct from old.status then
      raise exception 'Cast a vote instead — it takes 3 Directors to move a guide out of review.';
    end if;
    return new;
  end if;

  -- The author may withdraw or re-file while it is still untouched.
  if old.user_id = auth.uid() and old.status = 'pending_officer' then
    return new;
  end if;

  if public.current_user_role() = 'officer' then
    -- Once it's left pending_officer — sent to the Directors or bounced back
    -- for changes — it's out of the Officer's hands. Without this, an
    -- Officer could reach back in and yank a submission out of an in-flight
    -- Director vote by setting it to changes_requested directly.
    if old.status <> 'pending_officer' then
      raise exception 'This guide has already moved past your review.';
    end if;
    if new.status not in ('pending_officer', 'changes_requested', 'pending_admin') then
      raise exception 'Only the Directors can approve or reject a guide.';
    end if;
    if new.user_id is distinct from old.user_id
       or new.category is distinct from old.category
       or new.doc_url is distinct from old.doc_url then
      raise exception 'An Officer can change status and feedback only.';
    end if;
    if new.status = 'pending_admin' and (new.officer_suggested_hours is null or new.officer_suggested_hours <= 0) then
      raise exception 'Enter how many hours the Associate should receive before passing this to the Directors.';
    end if;
    return new;
  end if;

  raise exception 'You are not allowed to review this submission.';
end;
$$;

drop trigger if exists submissions_guard_review on public.guides_submissions;
create trigger submissions_guard_review
  before update on public.guides_submissions
  for each row execute function public.guard_submission_review();

-- Whenever a submission (re-)enters pending_admin — the Officer's initial
-- hand-off, or a Director manually restarting review — any votes and
-- tallies from a previous round are stale and must not carry over.
create or replace function public.reset_guide_admin_votes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'pending_admin' and old.status is distinct from new.status then
    delete from public.guide_admin_votes where submission_id = new.id;
    new.admin_approve_votes := 0;
    new.admin_reject_votes := 0;
    new.admin_changes_votes := 0;
  end if;
  return new;
end;
$$;

drop trigger if exists guides_submissions_reset_votes on public.guides_submissions;
create trigger guides_submissions_reset_votes
  before update on public.guides_submissions
  for each row execute function public.reset_guide_admin_votes();

-- THE QUORUM. Recomputes the three tallies after every vote is cast or
-- changed, and — the moment any one outcome reaches 3 — applies it: status
-- flips, and on approval the Associate's hours are granted automatically
-- using the Officer's suggested amount. This is the only code path allowed
-- to move a submission out of pending_admin; see the internal_update flag
-- in guard_submission_review() above.
create or replace function public.tally_guide_admin_votes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_submission public.guides_submissions%rowtype;
  v_approve int;
  v_reject int;
  v_changes int;
begin
  select * into v_submission
  from public.guides_submissions
  where id = new.submission_id
  for update;

  -- Resolved (or reset) between this vote being cast and this trigger
  -- running — nothing left to tally.
  if v_submission.status <> 'pending_admin' then
    return new;
  end if;

  select
    count(*) filter (where decision = 'approve'),
    count(*) filter (where decision = 'reject'),
    count(*) filter (where decision = 'changes_requested')
  into v_approve, v_reject, v_changes
  from public.guide_admin_votes
  where submission_id = new.submission_id;

  perform set_config('illuminate.internal_update', 'on', true);

  update public.guides_submissions
  set admin_approve_votes = v_approve,
      admin_reject_votes = v_reject,
      admin_changes_votes = v_changes
  where id = new.submission_id;

  if v_approve >= 3 then
    update public.guides_submissions
    set status = 'approved', reviewed_at = now()
    where id = new.submission_id;

    if v_submission.officer_suggested_hours is not null and v_submission.officer_suggested_hours > 0 then
      insert into public.volunteer_hours (user_id, guide_id, hours, reason, approved_by, date)
      values (
        v_submission.user_id,
        v_submission.id,
        v_submission.officer_suggested_hours,
        '"' || v_submission.title || '" — approved by 3 Directors',
        null,
        current_date
      );
    end if;
  elsif v_reject >= 3 then
    update public.guides_submissions
    set status = 'rejected', reviewed_at = now()
    where id = new.submission_id;
  elsif v_changes >= 3 then
    update public.guides_submissions
    set status = 'changes_requested', reviewed_at = now()
    where id = new.submission_id;
  end if;

  return new;
end;
$$;

drop trigger if exists guide_admin_votes_tally on public.guide_admin_votes;
create trigger guide_admin_votes_tally
  after insert or update on public.guide_admin_votes
  for each row execute function public.tally_guide_admin_votes();


-- ============================================================================
-- 5. ROW LEVEL SECURITY
-- ============================================================================

alter table public.profiles           enable row level security;
alter table public.academic_records   enable row level security;
alter table public.transcripts        enable row level security;
alter table public.ap_scores          enable row level security;
alter table public.standardized_test_scores enable row level security;
alter table public.extracurriculars   enable row level security;
alter table public.goals              enable row level security;
alter table public.guides_submissions enable row level security;
alter table public.guide_admin_votes  enable row level security;
alter table public.tasks              enable row level security;
alter table public.volunteer_hours    enable row level security;
alter table public.activity_log       enable row level security;

-- ---------------------------------------------------------------- profiles --
drop policy if exists profiles_select_own    on public.profiles;
drop policy if exists profiles_select_staff  on public.profiles;
drop policy if exists profiles_update_own    on public.profiles;
drop policy if exists profiles_update_admin  on public.profiles;

-- Anyone can read their own row.
create policy profiles_select_own on public.profiles
  for select to authenticated
  using (id = auth.uid());

-- Officers and Directors read the directory: they need author names on
-- submissions and the full list to assign tasks and roles. Members and
-- Associates cannot enumerate other people.
create policy profiles_select_staff on public.profiles
  for select to authenticated
  using (public.role_at_least('officer'));

-- Own profile edits. The guard trigger blocks role/category changes here.
create policy profiles_update_own on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy profiles_update_admin on public.profiles
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ------------------------------------------------- personal, owner-only ----
-- academic_records, transcripts, ap_scores, standardized_test_scores,
-- extracurriculars, and goals are private to the student. Nobody else reads
-- them — not Officers, not Directors.
drop policy if exists academic_records_own on public.academic_records;
create policy academic_records_own on public.academic_records
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists transcripts_own on public.transcripts;
create policy transcripts_own on public.transcripts
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists ap_scores_own on public.ap_scores;
create policy ap_scores_own on public.ap_scores
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists standardized_test_scores_own on public.standardized_test_scores;
create policy standardized_test_scores_own on public.standardized_test_scores
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists extracurriculars_own on public.extracurriculars;
create policy extracurriculars_own on public.extracurriculars
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists goals_own on public.goals;
create policy goals_own on public.goals
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ------------------------------------------------------ guide submissions --
drop policy if exists submissions_select_own      on public.guides_submissions;
drop policy if exists submissions_select_officer  on public.guides_submissions;
drop policy if exists submissions_select_admin    on public.guides_submissions;
drop policy if exists submissions_insert_author   on public.guides_submissions;
drop policy if exists submissions_update_author   on public.guides_submissions;
drop policy if exists submissions_update_officer  on public.guides_submissions;
drop policy if exists submissions_update_admin    on public.guides_submissions;
drop policy if exists submissions_delete          on public.guides_submissions;

create policy submissions_select_own on public.guides_submissions
  for select to authenticated
  using (user_id = auth.uid());

-- THE OFFICER FILTER. An Officer sees their assigned subsection and nothing
-- else — the client-side `.eq("category", …)` is a convenience, this is the
-- rule. Changing the officer_category in `profiles` instantly changes what
-- this returns. This equality check doesn't care what shape the string is —
-- it worked when officer_category held a bare category like "Extracurriculars"
-- and it works unchanged now that it holds a "category:tier" key.
create policy submissions_select_officer on public.guides_submissions
  for select to authenticated
  using (
    public.current_user_role() = 'officer'
    and category = public.current_officer_category()
  );

create policy submissions_select_admin on public.guides_submissions
  for select to authenticated
  using (public.is_admin());

-- Associates and above may file guides, always as themselves, always at the
-- start of the pipeline.
create policy submissions_insert_author on public.guides_submissions
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and public.role_at_least('associate')
    and status = 'pending_officer'
  );

-- Authors may revise while nobody has picked it up. The guard trigger keeps
-- them from promoting their own draft.
create policy submissions_update_author on public.guides_submissions
  for update to authenticated
  using (user_id = auth.uid() and status = 'pending_officer')
  with check (user_id = auth.uid());

create policy submissions_update_officer on public.guides_submissions
  for update to authenticated
  using (
    public.current_user_role() = 'officer'
    and category = public.current_officer_category()
  )
  with check (
    public.current_user_role() = 'officer'
    and category = public.current_officer_category()
  );

create policy submissions_update_admin on public.guides_submissions
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy submissions_delete on public.guides_submissions
  for delete to authenticated
  using (
    public.is_admin()
    or (user_id = auth.uid() and status = 'pending_officer')
  );

-- ------------------------------------------------------------- admin votes --
-- Only Directors ever see this table — Associates and Officers get the
-- denormalized admin_*_votes counts on guides_submissions instead, which
-- tell them "how many" without exposing "who voted which way."
drop policy if exists guide_admin_votes_select on public.guide_admin_votes;
drop policy if exists guide_admin_votes_insert on public.guide_admin_votes;
drop policy if exists guide_admin_votes_update on public.guide_admin_votes;

create policy guide_admin_votes_select on public.guide_admin_votes
  for select to authenticated
  using (public.is_admin());

-- A Director may only cast a vote in their own name, and only while the
-- submission is still open for voting.
create policy guide_admin_votes_insert on public.guide_admin_votes
  for insert to authenticated
  with check (
    public.is_admin()
    and admin_id = auth.uid()
    and exists (
      select 1 from public.guides_submissions gs
      where gs.id = submission_id and gs.status = 'pending_admin'
    )
  );

-- Changing your mind before quorum is fine; the row simply doesn't exist to
-- update once the submission has left pending_admin.
create policy guide_admin_votes_update on public.guide_admin_votes
  for update to authenticated
  using (public.is_admin() and admin_id = auth.uid())
  with check (
    public.is_admin()
    and admin_id = auth.uid()
    and exists (
      select 1 from public.guides_submissions gs
      where gs.id = submission_id and gs.status = 'pending_admin'
    )
  );

-- ------------------------------------------------------------------ tasks --
drop policy if exists tasks_select_mine   on public.tasks;
drop policy if exists tasks_select_admin  on public.tasks;
drop policy if exists tasks_insert_admin  on public.tasks;
drop policy if exists tasks_update_mine   on public.tasks;
drop policy if exists tasks_update_admin  on public.tasks;
drop policy if exists tasks_delete_admin  on public.tasks;

-- Assigned to me personally, or broadcast to my tier.
create policy tasks_select_mine on public.tasks
  for select to authenticated
  using (
    assigned_to = auth.uid()
    or assigned_role = public.current_user_role()
  );

create policy tasks_select_admin on public.tasks
  for select to authenticated
  using (public.is_admin());

create policy tasks_insert_admin on public.tasks
  for insert to authenticated
  with check (public.is_admin());

-- Assignees can tick tasks off; the guard trigger limits them to `status`.
create policy tasks_update_mine on public.tasks
  for update to authenticated
  using (
    assigned_to = auth.uid()
    or assigned_role = public.current_user_role()
  )
  with check (
    assigned_to = auth.uid()
    or assigned_role = public.current_user_role()
  );

create policy tasks_update_admin on public.tasks
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy tasks_delete_admin on public.tasks
  for delete to authenticated
  using (public.is_admin());

-- -------------------------------------------------------- volunteer hours --
drop policy if exists hours_select_own    on public.volunteer_hours;
drop policy if exists hours_select_admin  on public.volunteer_hours;
drop policy if exists hours_insert_admin  on public.volunteer_hours;
drop policy if exists hours_update_admin  on public.volunteer_hours;
drop policy if exists hours_delete_admin  on public.volunteer_hours;

create policy hours_select_own on public.volunteer_hours
  for select to authenticated
  using (user_id = auth.uid());

create policy hours_select_admin on public.volunteer_hours
  for select to authenticated
  using (public.is_admin());

-- Directors award hours in their own name — except hours tied to a guide
-- (guide_id is not null), which are only ever granted automatically by
-- tally_guide_admin_votes() once 3 Directors approve. That function runs as
-- the table owner and bypasses RLS entirely, so this policy only needs to
-- stop a client-initiated insert from doing the same thing unilaterally.
create policy hours_insert_admin on public.volunteer_hours
  for insert to authenticated
  with check (public.is_admin() and approved_by = auth.uid() and guide_id is null);

create policy hours_update_admin on public.volunteer_hours
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy hours_delete_admin on public.volunteer_hours
  for delete to authenticated
  using (public.is_admin());

-- ----------------------------------------------------------- activity log --
drop policy if exists activity_select_admin on public.activity_log;
drop policy if exists activity_insert_self  on public.activity_log;

create policy activity_select_admin on public.activity_log
  for select to authenticated
  using (public.is_admin());

-- Anyone can append, but only ever as themselves. No update or delete policy
-- exists, which is what makes this table append-only.
create policy activity_insert_self on public.activity_log
  for insert to authenticated
  with check (actor_id = auth.uid());


-- ============================================================================
-- 6. STORAGE — private transcript bucket
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('transcripts', 'transcripts', false)
on conflict (id) do nothing;

-- Objects are keyed "<user id>/<timestamp>-<filename>", so the first path
-- segment is the owner. That is what these policies check.
drop policy if exists transcripts_read   on storage.objects;
drop policy if exists transcripts_write  on storage.objects;
drop policy if exists transcripts_delete on storage.objects;

create policy transcripts_read on storage.objects
  for select to authenticated
  using (
    bucket_id = 'transcripts'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy transcripts_write on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'transcripts'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy transcripts_delete on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'transcripts'
    and (storage.foldername(name))[1] = auth.uid()::text
  );


-- ============================================================================
-- 6b. STORAGE — private AP score report bucket
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('ap-score-reports', 'ap-score-reports', false)
on conflict (id) do nothing;

-- Objects are keyed "<user id>/<timestamp>-<filename>", so the first path
-- segment is the owner. That is what these policies check.
drop policy if exists ap_score_reports_read   on storage.objects;
drop policy if exists ap_score_reports_write  on storage.objects;
drop policy if exists ap_score_reports_delete on storage.objects;

create policy ap_score_reports_read on storage.objects
  for select to authenticated
  using (
    bucket_id = 'ap-score-reports'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy ap_score_reports_write on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'ap-score-reports'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy ap_score_reports_delete on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'ap-score-reports'
    and (storage.foldername(name))[1] = auth.uid()::text
  );


-- ============================================================================
-- 7. FIRST DIRECTOR — automatic
-- ============================================================================
--
-- Whoever signs up with the address returned by seed_admin_email() (set in
-- section 3, currently illuminate10102@gmail.com) becomes a Director on
-- signup automatically — no manual SQL needed for a fresh project.
--
-- The line below only matters if you already had a profile for that address
-- BEFORE adding this script — e.g. you signed up under the old schema, or
-- you're changing seed_admin_email() to a different address after the fact.
-- It's a no-op otherwise, and safe to re-run.
update public.profiles
set role = 'admin', officer_category = null
where lower(email) = lower(public.seed_admin_email())
  and role <> 'admin';

-- To promote anyone else, use the User Management tab once logged in as a
-- Director — you should never need the SQL editor for role changes again.
--
-- To check it worked:
--
--   select email, role, officer_category from public.profiles order by created_at;
-- ============================================================================
