import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("about", "routes/about.tsx"),
  route("get-involved", "routes/get-involved.tsx"),
  route("resources", "routes/resources.tsx"),
  route("testing", "routes/testing.tsx"),
  route("summer", "routes/summer.tsx"),
  route("academics", "routes/academics.tsx"),

  // Not linked from the footer or the main nav pills — reachable only via
  // the Academics dropdown's Subjects flyout, the Academics page's
  // Subjects section, and the search bar.
  route("academics/subjects", "routes/subjects.tsx"),
  route("academics/subjects/:subject/:course", "routes/subject-course.tsx"),
  route("meet-the-team", "routes/meet-the-team.tsx"),
  route("account", "routes/account.tsx"),
  route("saved", "routes/saved.tsx"),

  // The dashboard shell owns the sidebar, the header, and the auth gate; every
  // tab below it renders into its <Outlet>. Tabs above Member also wrap
  // themselves in <RequireRole>, which is what catches a typed-in URL.
  route("dashboard", "routes/dashboard.tsx", [
    index("routes/dashboard/index.tsx"),
    route("academics", "routes/dashboard/academics.tsx"),
    route("transcripts", "routes/dashboard/transcripts.tsx"),
    route("activities", "routes/dashboard/activities.tsx"),
    route("resources", "routes/dashboard/resources.tsx"),
    route("goals", "routes/dashboard/goals.tsx"),
    // Calendar tab temporarily removed — route left registered so a direct
    // link doesn't 404, just no longer linked from the sidebar. See the
    // matching comment on the Calendar TabDef in lib/roles.ts.
    route("calendar", "routes/dashboard/calendar.tsx"),
    route("submit", "routes/dashboard/submit.tsx"),
    route("tasks", "routes/dashboard/tasks.tsx"),
    route("hours", "routes/dashboard/hours.tsx"),
    route("workstation", "routes/dashboard/workstation.tsx"),
    route("users", "routes/dashboard/users.tsx"),
    route("approvals", "routes/dashboard/approvals.tsx"),
    route("assign", "routes/dashboard/assign.tsx"),
    route("announcements", "routes/dashboard/announcements.tsx"),
    route("activity", "routes/dashboard/activity.tsx"),
    route("settings", "routes/dashboard/settings.tsx"),
  ]),

  // Catch-alls stay last so /dashboard/* never falls through to them.
  route(":category", "routes/category.tsx"),
  route(":category/:field", "routes/field.tsx"),
] satisfies RouteConfig;
