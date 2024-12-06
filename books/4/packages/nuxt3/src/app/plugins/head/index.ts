import type { Plugin } from "nuxt/app";
import {
  createHead,
  renderHeadToString,
} from ".pnpm/@vueuse+head@0.5.1_vue@3.5.13_typescript@4.9.5_/node_modules/@vueuse/head/dist";
import { Head, Html, Body, Title, Meta, Link, Script, Style } from "./head";

export default <Plugin>function head(nuxt) {
  const { app, ssrContext } = nuxt;
  const head = createHead();

  app.use(head);

  app.component("NuxtHead", Head);
  app.component("NuxtHtml", Html);
  app.component("NuxtBody", Body);
  app.component("NuxtTitle", Title);
  app.component("NuxtMeta", Meta);
  app.component("NuxtHeadLink", Link);
  app.component("NuxtScript", Script);
  app.component("NuxtStyle", Style);

  if (process.server) {
    ssrContext.head = () => renderHeadToString(head);
  }
};
