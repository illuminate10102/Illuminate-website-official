/*
  Role hierarchy, guide review sections, and the sidebar tab manifest.

  This module is the single source of truth for "who can see what". The
  sidebar, the route guards, and the Supabase RLS policies all describe the
  same four tiers:

    member  <  associate  <  officer  <  admin

  Every tier inherits the tabs of the tiers below it, so `minRole` on a tab is
  a floor, not an exact match.
*/

import { categories } from "~/data/categories";

export const ROLES = ["member", "associate", "officer", "admin"] as const;

export type Role = (typeof ROLES)[number];

/** Higher number = more access. Used for all `>=` comparisons. */
const RANK: Record<Role, number> = {
  member: 0,
  associate: 1,
  officer: 2,
  admin: 3,
};

/** Badge text shown next to the user's name in the dashboard header. */
export const ROLE_LABEL: Record<Role, string> = {
  member: "MEMBER",
  associate: "ASSOCIATE",
  officer: "OFFICER",
  admin: "DIRECTOR",
};

export const ROLE_BLURB: Record<Role, string> = {
  member: "Track your own academics, activities, and goals.",
  associate: "Write guides, take on tasks, and earn volunteer hours.",
  officer: "Review Associate submissions in your assigned category.",
  admin: "Full command over roles, approvals, hours, and tasks.",
};

export function roleAtLeast(role: Role | null | undefined, minimum: Role): boolean {
  if (!role) return false;
  return RANK[role] >= RANK[minimum];
}

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}

/** Normalizes anything coming out of the database into a known role. */
export function toRole(value: unknown): Role {
  return isRole(value) ? value : "member";
}

/* ───────────────────────── guide review sections ───────────────────────── */

/*
  An Officer is never assigned a whole main category (e.g. "Extracurriculars")
  — that's too broad a queue for one person. They're assigned one *subsection*
  of a category (e.g. "Arts & Performance" within Extracurriculars), which is
  exactly the category → tier structure already defined in `data/categories.ts`.

  Both `profiles.officer_category` and `guides_submissions.category` store the
  same composite key: `"<category slug>:<tier slug>"` (e.g.
  "extracurriculars:arts-performance"). Officers only ever see submissions
  whose `category` matches their `officer_category` exactly — the RLS policy
  in supabase/schema.sql does a plain string equality check — so this key
  format must stay in sync between the two. Edit `data/categories.ts` and
  nowhere else; this list is derived from it.
*/
export type ReviewSection = {
  /** The value stored in `profiles.officer_category` / `guides_submissions.category`. */
  key: string;
  categorySlug: string;
  categoryLabel: string;
  tierSlug: string;
  tierLabel: string;
};

export const REVIEW_SECTIONS: ReviewSection[] = categories.flatMap((category) =>
  category.tiers.map((tier) => ({
    key: `${category.slug}:${tier.slug}`,
    categorySlug: category.slug,
    categoryLabel: category.label,
    tierSlug: tier.slug,
    tierLabel: tier.label,
  })),
);

/** Review sections grouped by main category, in category order — built for `<optgroup>` pickers. */
export function groupedReviewSections(): { categoryLabel: string; sections: ReviewSection[] }[] {
  const groups: { categoryLabel: string; sections: ReviewSection[] }[] = [];
  for (const section of REVIEW_SECTIONS) {
    const group = groups.find((g) => g.categoryLabel === section.categoryLabel);
    if (group) group.sections.push(section);
    else groups.push({ categoryLabel: section.categoryLabel, sections: [section] });
  }
  return groups;
}

export function reviewSection(key: string | null | undefined): ReviewSection | undefined {
  return REVIEW_SECTIONS.find((s) => s.key === key);
}

/** Human-readable "Category — Subsection" for a review section key. Falls back to the raw key. */
export function reviewSectionLabel(key: string | null | undefined): string {
  if (!key) return "";
  const section = reviewSection(key);
  return section ? `${section.categoryLabel} — ${section.tierLabel}` : key;
}

/** A guide's or Officer's category is always a review-section key, but stored as plain text. */
export type GuideCategory = string;

/** Categories used by the personal extracurricular tracker (a separate taxonomy). */
export const ACTIVITY_CATEGORIES = [
  "Arts & Performance",
  "STEM",
  "Athletics",
  "Community Service",
  "Leadership",
  "Academic Competition",
  "Work & Internships",
  "Other",
] as const;

export type ActivityCategory = (typeof ACTIVITY_CATEGORIES)[number];

/* ───────────────────────── statuses & priorities ───────────────────────── */

export const SUBMISSION_STATUSES = [
  "pending_officer",
  "changes_requested",
  "pending_admin",
  "approved",
  "rejected",
] as const;

export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number];

export const SUBMISSION_STATUS_LABEL: Record<SubmissionStatus, string> = {
  pending_officer: "Pending Officer Review",
  changes_requested: "Changes Requested",
  pending_admin: "Pending Admin Approval",
  approved: "Approved",
  rejected: "Rejected",
};

export const TASK_PRIORITIES = ["high", "medium", "low"] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const TASK_STATUSES = ["todo", "in_progress", "done"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
};

export const GOAL_HORIZONS = ["short_term", "long_term"] as const;
export type GoalHorizon = (typeof GOAL_HORIZONS)[number];

export const GOAL_STATUSES = ["not_started", "in_progress", "done"] as const;
export type GoalStatus = (typeof GOAL_STATUSES)[number];

/* ───────────────────────── sidebar manifest ───────────────────────── */

export type TabDef = {
  /** Path segment under /dashboard. Empty string is the index tab. */
  to: string;
  label: string;
  /** lucide-react icon name, resolved in the Sidebar. */
  icon: string;
  minRole: Role;
  /** Sidebar section heading this tab sits under. */
  group: "Personal" | "Contribute" | "Review" | "Governance";
  /** One line on what the tab is for. Read by the dashboard tour. */
  blurb: string;
};

export const TABS: TabDef[] = [
  { to: "", label: "Overview", icon: "LayoutDashboard", minRole: "member", group: "Personal",
    blurb: "All your information in one place for you to see!" },
  { to: "academics", label: "Academic Records", icon: "GraduationCap", minRole: "member", group: "Personal",
    blurb: "Insert your courses and GPA, all logged into our dashboard." },
  { to: "transcripts", label: "Transcripts", icon: "FileText", minRole: "member", group: "Personal",
    blurb: "Insert or construct your transcript within this page." },
  { to: "activities", label: "Extracurriculars", icon: "Trophy", minRole: "member", group: "Personal",
    blurb: "Track your clubs, nonprofits, and startups." },
  { to: "resources", label: "Guides", icon: "BookOpen", minRole: "member", group: "Personal",
    blurb: "Need quick access to guides? Come to this page." },
  { to: "goals", label: "Personal Goals", icon: "Target", minRole: "member", group: "Personal",
    blurb: "Set all your goals and deadlines to keep yourself accountable." },
  // Temporarily removed from the sidebar/tour — the route at
  // /dashboard/calendar and its component are untouched, this tab just
  // isn't in the manifest that drives navigation right now. Re-add this
  // entry (in its old spot, after "goals") to bring it back.
  // { to: "calendar", label: "Calendar", icon: "CalendarDays", minRole: "member", group: "Personal",
  //   blurb: "Your due dates and Illuminate events in one month view." },

  { to: "submit", label: "Submit Content", icon: "Send", minRole: "associate", group: "Contribute",
    blurb: "Write a guide and send it up to your Officer." },
  { to: "tasks", label: "Tasks & Events", icon: "ListChecks", minRole: "associate", group: "Contribute",
    blurb: "Deadlines given by Directors." },
  { to: "hours", label: "Volunteer Hours", icon: "Clock", minRole: "associate", group: "Contribute",
    blurb: "Hours you've been awarded for the work you've done. We're a registered nonprofit, so they officially count." },

  { to: "workstation", label: "Category Workstation", icon: "ClipboardCheck", minRole: "officer", group: "Review",
    blurb: "All the submissions within your subsection." },

  { to: "users", label: "User Management", icon: "Users", minRole: "admin", group: "Governance",
    blurb: "Everyone on the team and what role they hold." },
  { to: "approvals", label: "Approval & Hours Desk", icon: "BadgeCheck", minRole: "admin", group: "Governance",
    blurb: "Vote on guides and award hours. It takes three Directors to publish." },
  { to: "assign", label: "Task Assignment", icon: "ListChecks", minRole: "admin", group: "Governance",
    blurb: "Hand out tasks to Associates and set the deadlines." },
  { to: "announcements", label: "Announcements", icon: "Megaphone", minRole: "admin", group: "Governance",
    blurb: "Send reminders, deadlines, and general updates to everyone." },
  { to: "activity", label: "Activity & Audit Log", icon: "Activity", minRole: "admin", group: "Governance",
    blurb: "All the actions that have occurred within the website." },
  { to: "settings", label: "System Settings", icon: "Settings", minRole: "admin", group: "Governance",
    blurb: "Site-wide switches and information." },
];

export const TAB_GROUPS: TabDef["group"][] = ["Personal", "Contribute", "Review", "Governance"];

export function tabsForRole(role: Role): TabDef[] {
  return TABS.filter((tab) => roleAtLeast(role, tab.minRole));
}
