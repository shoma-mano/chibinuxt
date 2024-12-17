import { createSSRApp } from "vue";
import App from "./App.vue";

import { createRouter } from "./router";

const initApp = async () => {
  const app = createSSRApp(App);

  const router = createRouter();
  app.use(router);

  app.mount("#__nuxt");
};
initApp().catch(console.error);
