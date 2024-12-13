import { createApp } from "vue";

export default () => {
  const app = createApp({
    render: (h) => h("p", "Hello World"),
  });
  return app;
};
