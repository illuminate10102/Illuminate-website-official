import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("about", "routes/about.tsx"),
  route("get-involved", "routes/get-involved.tsx"),
  route("resources", "routes/resources.tsx"),
  route(":category", "routes/category.tsx"),
  route(":category/:field", "routes/field.tsx"),
] satisfies RouteConfig;
