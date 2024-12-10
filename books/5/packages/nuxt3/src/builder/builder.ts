import { relative } from "path";
import fsExtra from "fs-extra";
import { Nuxt } from "../core";
import { DeterminedGlobals, determineGlobals } from "../utils";
import { templateData, compileTemplates, NuxtTemplate } from "./template";
import { createApp, NuxtApp } from "./app";
import Ignore from "./ignore";
import * as defaultTemplates from "./templates";

// export class Builder {
//   nuxt: Nuxt;
//   globals: DeterminedGlobals;
//   ignore: Ignore;
//   templates: NuxtTemplate[];
//   app: NuxtApp;

//   constructor(nuxt) {
//     this.nuxt = nuxt;
//   }

//   build() {
//     return build(this);
//   }

//   close() {
//     // TODO: close watchers
//   }
// }

// Extends VueRouter
export async function build(nuxt: Nuxt) {
  await fsExtra.emptyDir(nuxt.options.buildDir);
  await generate(nuxt);

  await bundle(nuxt);

  await nuxt.hooks.callHook("build:done");
}

export async function generate(nuxt: Nuxt) {
  const app = await createApp(nuxt);
  // Todo: Call app:created hook

  const data = templateData(nuxt, app);
  const templates = Object.values(defaultTemplates).map((t) => ({
    ...t,
    data,
  }));

  await compileTemplates(templates, nuxt.options.buildDir);
}

async function bundle(nuxt: Nuxt) {
  // @ts-ignore
  const bundle = await import("./vite/vite").then((p) => p.bundle);
  return bundle(nuxt);
}
