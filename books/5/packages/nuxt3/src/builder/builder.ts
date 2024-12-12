import fsExtra from "fs-extra";
import type { Nuxt } from "../core";
import { templateData, compileTemplates } from "./template";
import { createApp } from "./app";
import * as defaultTemplates from "./templates";

export async function build(nuxt: Nuxt) {
  await fsExtra.emptyDir(nuxt.options.buildDir);
  await generate(nuxt);

  await bundle(nuxt);

  await nuxt.hooks.callHook("build:done");
}

export async function generate(nuxt: Nuxt) {
  const app = await createApp(nuxt);
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
