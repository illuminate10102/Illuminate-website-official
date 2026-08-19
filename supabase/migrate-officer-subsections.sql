-- ============================================================================
-- Migration: Officers now review a subsection, not a whole main category.
--
-- Run this ONCE in the Supabase SQL editor, AFTER pulling the app code that
-- adds REVIEW_SECTIONS (app/lib/roles.ts). It is NOT part of schema.sql
-- because schema.sql is meant to be safely re-run at any time without
-- touching data — this script deliberately does.
--
-- What "subsection" means: `profiles.officer_category` and
-- `guides_submissions.category` used to hold a bare label like
-- "Extracurriculars". They now hold a composite key like
-- "extracurriculars:arts-performance" (see REVIEW_SECTIONS in
-- app/lib/roles.ts and the tiers in app/data/categories.ts). The column
-- types and the RLS policies that compare them are unchanged — only the
-- shape of the string changed — but existing rows still hold the old shape,
-- which this migration cleans up.
--
-- What this does:
--   1. Deletes every existing guide submission (and detaches, but does not
--      delete, any volunteer_hours row that referenced one — that
--      foreign key is ON DELETE SET NULL).
--   2. Clears officer_category for any Officer whose current value is a
--      pre-migration bare category (i.e. doesn't contain the ":" that every
--      valid review-section key has), so nobody is silently left pointed at
--      a category that no longer routes anything.
--
-- After running this, go to User Management (as a Director) and reassign
-- every Officer to a specific subsection.
-- ============================================================================

-- 1. Clear out old submissions filed under the old flat categories — there is
--    no reliable way to know which subsection each one actually belonged to,
--    so per your instruction these are wiped rather than guessed at.
delete from public.guides_submissions;

-- 2. Reset any Officer whose assignment predates subsections. A valid
--    review-section key always contains a ":" (category slug : tier slug);
--    anything without one is a leftover bare category like "Extracurriculars"
--    or "Academics".
update public.profiles
set officer_category = null
where role = 'officer'
  and officer_category is not null
  and officer_category not like '%:%';

-- Check what needs reassigning:
--
--   select email, full_name, role, officer_category
--   from public.profiles
--   where role = 'officer'
--   order by officer_category nulls first;
-- ============================================================================
