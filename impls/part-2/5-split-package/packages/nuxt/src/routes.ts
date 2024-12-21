import Hello from "../../../playground/pages/hello.vue";
import World from "../../../playground/pages/world.vue";

export const routes = [
  {
    path: "/hello",
    component: Hello,
  },
  {
    path: "/world",
    component: World,
  },
];
