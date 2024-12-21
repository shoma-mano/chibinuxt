import { createApp } from "vue";
import App from "./root-component";
import { createRouter } from "./router";

export default async (ctx: { url: string }) => {
  const app = createApp(App);
  const router = createRouter();
  router.push(ctx.url);
  await router.isReady();
  app.use(router);
  return app;
};
