-- ============================================================================
-- Dashboard notifications — table, RLS, fan-out helper, and event triggers.
--
-- Run AFTER `supabase/schema.sql`. Safe to re-run: it recreates policies,
-- functions, and triggers without deleting stored notifications.
--
-- DESIGN: one row per RECIPIENT, not one row per announcement.
-- An announcement to "all Associates" fans out into one row per Associate at
-- send time. That costs a few extra rows and makes read-state trivial — each
-- person owns their own row and marks it read independently — where a shared
-- row would need a separate join table to track who has seen what, and would
-- make the RLS policy for "can I see this?" considerably harder to get right.
--
-- Auto-generated notifications come from triggers on the tables that already
-- exist (guides_submissions, tasks, volunteer_hours, profiles). They are
-- SECURITY DEFINER because the person whose action fires them is usually NOT
-- the person being notified — an Officer reviewing a guide writes a row owned
-- by the Associate, which the INSERT policy below would otherwise refuse.
-- ============================================================================


-- ============================================================================
-- 1. ENUM + TABLE
-- ============================================================================

do $$ begin
  create type public.notification_kind as enum (
    'announcement',   -- hand-written by a Director
    'submission',     -- a guide moved through review
    'feedback',       -- a reviewer left notes
    'task',           -- a task was assigned
    'hours',          -- volunteer hours were awarded
    'role'            -- role or review section changed
  );
exception when duplicate_object then null; end $$;

create table if not exists public.notifications (
  id         uuid primary key default gen_random_uuid(),
  -- The recipient. Always exactly one person; audience fan-out happens at
  -- send time in notify_fanout() below.
  user_id    uuid not null references public.profiles (id) on delete cascade,
  kind       public.notification_kind not null default 'announcement',
  title      text not null,
  body       text,
  -- Optional in-dashboard destination, e.g. '/dashboard/submit'. Rendered as
  -- a "View" link when present.
  link       text,
  -- Null until the recipient opens or dismisses it. This is what drives both
  -- the unread badge and whether the toast pops up again on next refresh.
  read_at    timestamptz,
  -- Who sent it. Null for system-generated rows.
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_idx
  on public.notifications (user_id, created_at desc);

-- Powers the unread badge count without scanning read rows.
create index if not exists notifications_unread_idx
  on public.notifications (user_id) where read_at is null;

grant select, insert, update, delete on public.notifications to authenticated;


-- ============================================================================
-- 2. ROW LEVEL SECURITY
-- ============================================================================

alter table public.notifications enable row level security;

drop policy if exists notifications_select_own   on public.notifications;
drop policy if exists notifications_update_own   on public.notifications;
drop policy if exists notifications_delete_own   on public.notifications;
drop policy if exists notifications_insert_admin on public.notifications;

-- You only ever see your own. There is deliberately no admin-read policy:
-- a Director can send announcements but cannot read what the system told an
-- individual student about their own submissions.
create policy notifications_select_own on public.notifications
  for select to authenticated
  using (user_id = auth.uid());

-- Marking read/unread is the only field a recipient changes. Rewriting the
-- title of a notification you received would be pointless but harmless; the
-- guard trigger below pins the content anyway.
create policy notifications_update_own on public.notifications
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy notifications_delete_own on public.notifications
  for delete to authenticated
  using (user_id = auth.uid());

-- Directors compose announcements through notify_fanout(), which is SECURITY
-- DEFINER and bypasses this. The policy exists so an admin can also insert a
-- single row directly if ever needed.
create policy notifications_insert_admin on public.notifications
  for insert to authenticated
  with check (public.is_admin());

-- A recipient may flip read_at and nothing else. Without this, "mark as read"
-- is also "rewrite history".
create or replace function public.guard_notification_updates()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.id         := old.id;
  new.user_id    := old.user_id;
  new.kind       := old.kind;
  new.title      := old.title;
  new.body       := old.body;
  new.link       := old.link;
  new.created_by := old.created_by;
  new.created_at := old.created_at;
  return new;
end;
$$;

drop trigger if exists notifications_guard_updates on public.notifications;
create trigger notifications_guard_updates
  before update on public.notifications
  for each row execute function public.guard_notification_updates();


-- ============================================================================
-- 3. FAN-OUT HELPER
-- ============================================================================

-- The single entry point for creating notifications, used by both the admin
-- composer and every trigger below.
--
-- Exactly one targeting mode applies, in priority order:
--   p_user_id set  -> that one person
--   p_role   set   -> everyone currently holding that role
--   neither        -> everyone with a profile
--
-- SECURITY DEFINER: triggers fire as whoever performed the action, who is
-- usually not the recipient and often not an admin.
create or replace function public.notify_fanout(
  p_kind    public.notification_kind,
  p_title   text,
  p_body    text default null,
  p_link    text default null,
  p_user_id uuid default null,
  p_role    public.user_role default null,
  p_actor   uuid default null
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  insert into public.notifications (user_id, kind, title, body, link, created_by)
  select p.id, p_kind, p_title, p_body, p_link, p_actor
  from public.profiles p
  where (p_user_id is not null and p.id = p_user_id)
     or (p_user_id is null and p_role is not null and p.role = p_role)
     or (p_user_id is null and p_role is null);

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

-- Directors call this from the composer. It re-checks is_admin() itself,
-- because notify_fanout is SECURITY DEFINER and must never be callable as a
-- "send anything to anyone" primitive by a non-admin.
create or replace function public.send_announcement(
  p_title   text,
  p_body    text default null,
  p_link    text default null,
  p_user_id uuid default null,
  p_role    public.user_role default null
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Only a Director can send an announcement.';
  end if;
  if coalesce(trim(p_title), '') = '' then
    raise exception 'An announcement needs a title.';
  end if;

  return public.notify_fanout(
    'announcement', p_title, p_body, p_link, p_user_id, p_role, auth.uid()
  );
end;
$$;

grant execute on function public.notify_fanout(
  public.notification_kind, text, text, text, uuid, public.user_role, uuid
) to authenticated;
grant execute on function public.send_announcement(
  text, text, text, uuid, public.user_role
) to authenticated;


-- ============================================================================
-- 4. EVENT TRIGGERS
-- ============================================================================

-- ---------------------------------------------------------- submissions ----
-- Covers the whole review pipeline from the author's point of view, plus the
-- hand-offs to whoever has to act next.
create or replace function public.notify_submission_events()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_officer uuid;
begin
  -- A brand-new draft: tell the Officer who owns that review section.
  if tg_op = 'INSERT' then
    select id into v_officer
    from public.profiles
    where role = 'officer' and officer_category = new.category
    limit 1;

    if v_officer is not null then
      perform public.notify_fanout(
        'submission',
        'New guide awaiting your review',
        '"' || new.title || '" was filed in your review section.',
        '/dashboard/workstation',
        v_officer, null, new.user_id
      );
    end if;
    return new;
  end if;

  -- Status didn't move — nothing worth interrupting anyone for.
  if new.status is not distinct from old.status then
    return new;
  end if;

  if new.status = 'changes_requested' then
    perform public.notify_fanout(
      'feedback',
      'Changes requested on your guide',
      '"' || new.title || '" needs another pass. Open it to read the reviewer''s notes.',
      '/dashboard/submit',
      new.user_id, null, auth.uid()
    );

  elsif new.status = 'pending_admin' then
    -- Author gets progress; every Director gets a vote request.
    perform public.notify_fanout(
      'submission',
      'Your guide cleared Officer review',
      '"' || new.title || '" is now waiting on Director approval.',
      '/dashboard/submit',
      new.user_id, null, auth.uid()
    );
    perform public.notify_fanout(
      'submission',
      'A guide needs your vote',
      '"' || new.title || '" cleared Officer review and needs 3 Director approvals.',
      '/dashboard/approvals',
      null, 'admin', auth.uid()
    );

  elsif new.status = 'approved' then
    perform public.notify_fanout(
      'submission',
      'Your guide was published',
      '"' || new.title || '" reached 3 Director approvals and is now official.',
      '/dashboard/submit',
      new.user_id, null, auth.uid()
    );

  elsif new.status = 'rejected' then
    perform public.notify_fanout(
      'submission',
      'Your guide was not accepted',
      '"' || new.title || '" was rejected by the Directors.',
      '/dashboard/submit',
      new.user_id, null, auth.uid()
    );
  end if;

  return new;
end;
$$;

drop trigger if exists submissions_notify on public.guides_submissions;
create trigger submissions_notify
  after insert or update on public.guides_submissions
  for each row execute function public.notify_submission_events();

-- ---------------------------------------------------------------- tasks ----
create or replace function public.notify_task_assigned()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.notify_fanout(
    'task',
    'New task assigned to you',
    new.title || coalesce(' — due ' || to_char(new.due_date, 'Mon DD'), ''),
    '/dashboard/tasks',
    new.assigned_to, new.assigned_role, new.created_by
  );
  return new;
end;
$$;

drop trigger if exists tasks_notify on public.tasks;
create trigger tasks_notify
  after insert on public.tasks
  for each row execute function public.notify_task_assigned();

-- ----------------------------------------------------------------- hours ---
create or replace function public.notify_hours_granted()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.notify_fanout(
    'hours',
    new.hours || ' volunteer hours awarded',
    new.reason,
    '/dashboard/hours',
    new.user_id, null, new.approved_by
  );
  return new;
end;
$$;

drop trigger if exists hours_notify on public.volunteer_hours;
create trigger hours_notify
  after insert on public.volunteer_hours
  for each row execute function public.notify_hours_granted();

-- ------------------------------------------------------------------ role ---
create or replace function public.notify_role_changed()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role then
    perform public.notify_fanout(
      'role',
      'Your role changed',
      'You are now ' || upper(new.role::text) || '. New tabs may have appeared in your sidebar.',
      '/dashboard',
      new.id, null, auth.uid()
    );
  elsif new.officer_category is distinct from old.officer_category
        and new.officer_category is not null then
    perform public.notify_fanout(
      'role',
      'Your review section changed',
      'You now review a different section. Check your Category Workstation.',
      '/dashboard/workstation',
      new.id, null, auth.uid()
    );
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_notify_role on public.profiles;
create trigger profiles_notify_role
  after update on public.profiles
  for each row execute function public.notify_role_changed();

-- ============================================================================
-- Check it worked:
--   select kind, title, user_id, read_at from public.notifications
--   order by created_at desc limit 20;
-- ============================================================================
