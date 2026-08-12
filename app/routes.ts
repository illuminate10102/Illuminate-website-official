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
  route(":category", "routes/category.tsx"),
  route(":category/:field", "routes/field.tsx"),
] satisfies RouteConfig;
