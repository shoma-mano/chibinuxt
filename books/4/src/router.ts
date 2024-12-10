import {
  RouteRecordRaw,
  createRouter as _createRouter,
  createMemoryHistory,
  createWebHistory,
} from "vue-router";
import Hello from "./pages/hello.vue";
import World from "./pages/world.vue";

export const routes = [] satisfies RouteRecordRaw[];

export const createRouter = (isServer?: boolean) => {
  const routes = [
    {
      path: "/hello",
      component: Hello,
    },
    {
      path: "/world",
      component: World,
    },
  ] satisfies RouteRecordRaw[];
  const history = isServer ? createMemoryHistory() : createWebHistory();
  const router = _createRouter({
    history,
    routes,
  });
  return router;
};
