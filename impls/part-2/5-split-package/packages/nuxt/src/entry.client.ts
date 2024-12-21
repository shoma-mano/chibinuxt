import { createSSRApp } from "vue";
import App from "./root-component";
import { createRouter } from "./router";

const initApp = async () => {
  console.log("initApp");
  const router = createRouter();
  console.log("router", router);
  const app = createSSRApp(App);
  app.use(router);
  await router.isReady();
  console.log("router.isReady");
  app.mount("#__nuxt");
};
initApp().catch(console.error);
