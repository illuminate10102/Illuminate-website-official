/*
  Dashboard tour — step content and "have they seen it" persistence.

  Steps are filtered by `minRole` (same floor semantics as `TabDef.minRole`
  in `lib/roles.ts`) so a Member never gets a step pointing at a stat row or
  sidebar group that role can't see. "Seen" is tracked per user *and* role in
  localStorage: a promotion changes the effective role, which no longer
  matches the stored value, so the tour replays once for the new tier and
  then goes quiet again.

  The four sidebar-group steps list their tabs with the `blurb` from the tab
  manifest, so the per-tab explanations live next to the tabs themselves
  rather than being written out a second time here.
*/

import type { Role, TabDef } from "./roles";

export type TourStep = {
  id: string;
  title: string;
  body: string;
  /** `data-tour` attribute value to spotlight, or null for a centered step. */
  target: string | null;
  /** Lowest role that sees this step — same floor semantics as `TabDef`. */
  minRole: Role;
  placement: "top" | "bottom" | "left" | "right";
  /** Renders this group's tabs and their blurbs under the body copy. */
  tabGroup?: TabDef["group"];
  /** Below `lg` this target lives inside the drawer, so open it first. */
  drawerOnMobile?: boolean;
};

export const TOUR_STEPS: TourStep[] = [
  {
    id: "welcome",
    title: "Welcome to the dashboard!",
    body: "Hello! Let's take a tour through the key features, useful tools, and resources that are centered around this dashboard!",
    target: null,
    minRole: "member",
    placement: "bottom",
  },
  {
    id: "group-personal",
    title: "Personal",
    body: "Your personal information all in one place.",
    target: "sidebar-group-Personal",
    minRole: "member",
    placement: "right",
    tabGroup: "Personal",
    drawerOnMobile: true,
  },
  {
    id: "group-contribute",
    title: "Contribute",
    body: "Be part of Illuminate — write guides and help us make the process easier.",
    target: "sidebar-group-Contribute",
    minRole: "associate",
    placement: "right",
    tabGroup: "Contribute",
    drawerOnMobile: true,
  },
  {
    id: "group-review",
    title: "Review",
    body: "Officers help manage submissions and tweak them to make top-notch content.",
    target: "sidebar-group-Review",
    minRole: "officer",
    placement: "right",
    tabGroup: "Review",
    drawerOnMobile: true,
  },
  {
    id: "group-governance",
    title: "Governance",
    body: "The behind the scenes of Project Illuminate.",
    target: "sidebar-group-Governance",
    minRole: "admin",
    placement: "right",
    tabGroup: "Governance",
    drawerOnMobile: true,
  },
  {
    id: "identity",
    title: "Your account",
    body: "Your name, your email, and the role you're at. The badge is what decides which tabs you see.",
    target: "header-identity",
    minRole: "member",
    placement: "bottom",
  },
  {
    id: "notifications",
    title: "Notifications",
    body: "This is where you'll be notified of your updates, announcements from Directors, and more.",
    target: "notification-bell",
    minRole: "member",
    placement: "bottom",
  },
  {
    id: "stat-academics",
    title: "Your Stats",
    body: "This section contains your GPA, goals, activity hours, and bookmarked guides in a simplified format. Click a tile to navigate to that specific page!",
    target: "stat-academics",
    minRole: "member",
    placement: "bottom",
  },
  {
    id: "stat-contributions",
    title: "Contributions",
    body: "Your hours, your open tasks, and their approval updates all in one place. Click a tile to navigate to that specific page!",
    target: "stat-contributions",
    minRole: "associate",
    placement: "bottom",
  },
  {
    id: "stat-review",
    title: "Review Queue",
    body: "This section contains the number of guides you need to approve. Click a tile to navigate to that specific page!",
    target: "stat-review",
    minRole: "officer",
    placement: "bottom",
  },
  {
    id: "stat-governance",
    title: "The whole org's stats",
    body: "These include the main buttons for the entire organization.",
    target: "stat-governance",
    minRole: "admin",
    placement: "bottom",
  },
  {
    id: "panel-tasks",
    title: "What's due",
    body: "These include your deadlines.",
    target: "panel-tasks",
    minRole: "associate",
    placement: "top",
  },
  {
    id: "panel-secondary",
    title: "Shortcuts",
    body: "These are one-click buttons to view your recently viewed pages.",
    target: "panel-secondary",
    minRole: "member",
    placement: "top",
  },
  {
    id: "replay",
    title: "All done!",
    body: "If you forget any of this, take a tour at the bottom of the sidebar and run it again. It'll also replay on its own if you move up a role, since you'll have new tabs to learn.",
    target: null,
    minRole: "member",
    placement: "bottom",
  },
];

const STORAGE_PREFIX = "illuminate.tourSeenRole.";

/** The role the tour was last completed or skipped at, for this user. */
export function readTourSeenRole(userId: string): Role | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_PREFIX + userId) as Role | null;
  } catch {
    return null;
  }
}

export function writeTourSeenRole(userId: string, role: Role) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_PREFIX + userId, role);
  } catch {
    /* quota or private mode — the tour just replays next visit */
  }
}
