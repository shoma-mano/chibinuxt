import { createSSRApp } from "vue";
import App from "./App.vue";

const initApp = async () => {
  const app = createSSRApp(App);
  app.mount("#__nuxt");
};
initApp().catch(console.error);
