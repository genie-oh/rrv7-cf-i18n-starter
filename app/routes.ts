import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("/:locale", "routes/home.tsx"),
  route("/:locale/sample", "routes/sample.tsx"),
] satisfies RouteConfig;
