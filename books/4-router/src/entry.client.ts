import { createSSRApp } from "vue";
import App from "./App.vue";

import { createRouter } from "./router";

const initApp = async () => {
  const router = createRouter();
  await router.isReady();
  const app = createSSRApp(App);
  app.use(router);
  app.mount("#__nuxt");
};
initApp().catch(console.error);
