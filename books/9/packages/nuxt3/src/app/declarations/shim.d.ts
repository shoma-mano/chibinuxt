declare module "*.vue" {
  import { Component } from ".pnpm/vue@3.5.13_typescript@4.9.5/node_modules/vue/dist/vue";
  const component: Component;
  export default component;
}
