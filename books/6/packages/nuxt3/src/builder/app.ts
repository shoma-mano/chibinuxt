import { resolve } from "path";
import defu from "defu";
import { resolvePagesRoutes } from "./pages";
import type { NuxtRoute } from "./pages";
import type { Nuxt } from "../core";

interface NuxtPlugin {
  src: string;
  mode: "server" | "client" | "all";
}

export interface NuxtApp {
  main?: string;
  routes: NuxtRoute[];
  dir: string;
  plugins: NuxtPlugin[];
  pages?: {
    dir: string;
  };
}

export async function createApp(
  nuxt: Nuxt,
  options: Partial<NuxtApp> = {}
): Promise<NuxtApp> {
  // Create base app object
  const app = defu(options, {
    dir: nuxt.options.srcDir,
    routes: [],
    plugins: [],
  }) as NuxtApp;

  // Resolve pages/
  app.routes?.push(...(await resolvePagesRoutes(nuxt, app)));

  // Fallback app.main
  if (!app.main) app.main = resolve(nuxt.options.appDir, "app.pages.vue");

  return app;
}
