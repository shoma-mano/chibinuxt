import { Nuxt } from "../core";
import { resolveFiles } from "../core/resolver";
import { NuxtApp } from "./app";

export interface NuxtPlugin {
  src: string;
  mode: "server" | "client" | "all";
}

const MODES_REGEX = /\.(server|client)(\.\w+)*$/;
const getPluginMode = (src) => {
  const [, mode = "all"] = src.match(MODES_REGEX) || [];

  return mode;
};

export function resolvePlugins(nuxt: Nuxt, app: NuxtApp) {
  return resolveFiles(nuxt, "plugins/**/*.{js,ts}", app.dir).then((plugins) =>
    plugins.map((src) => {
      return {
        src,
        mode: getPluginMode(src),
      };
    })
  );
}
