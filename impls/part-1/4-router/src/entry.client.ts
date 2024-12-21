import { createSSRApp } from "vue";
import App from "./App.vue";

import { createRouter } from "./router";

const initApp = async () => {
  const router = createRouter();
  const app = createSSRApp(App);
  app.use(router);
  await router.isReady();
  app.mount("#__nuxt");
};
initApp().catch(console.error);
