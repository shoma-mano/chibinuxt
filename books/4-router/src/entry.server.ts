import { createApp } from "vue";
import App from "./App.vue";
import { createRouter } from "./router";

export default () => {
  const app = createApp(App);
  const router = createRouter(true);
  app.use(router);
  return app;
};
