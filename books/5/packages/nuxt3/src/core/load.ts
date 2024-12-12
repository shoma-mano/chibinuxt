import path from "path";

import { createNuxt } from "./nuxt";

const OVERRIDES = {
  dry: { dev: false, server: false },
  dev: { dev: true, _build: true },
  build: { dev: false, server: false, _build: true },
  start: { dev: false, _start: true },
};

export interface LoadOptions {
  for?: keyof typeof OVERRIDES;
  ready?: boolean;
  envConfig?: Record<string, any>;
  rootDir?: string;
  configFile?: string | undefined;
  configContext?: Record<string, any>;
  configOverrides?: Record<string, any>;
  createRequire?: (module: NodeJS.Module) => NodeJS.Require;
}

export async function loadNuxt(loadOptions: LoadOptions | LoadOptions["for"]) {
  // Normalize loadOptions
  if (typeof loadOptions === "string") {
    loadOptions = { for: loadOptions };
  }
  const { ready = true } = loadOptions as any;
  const _for = loadOptions!.for || "dry";

  // Get overrides
  const override = OVERRIDES[_for];

  // Unsupported purpose
  if (!override) {
    throw new Error("Unsupported for: " + _for);
  }

  // Load Config
  // const config = await loadNuxtConfig(loadOptions)
  const config = {
    rootDir: path.resolve("."),
  };
  console.log("config", config);
  // delete config._envConfig

  // Apply config overrides
  Object.assign(config, override);

  // Initiate Nuxt
  const nuxt = createNuxt(config);
  if (ready) {
    await nuxt.ready();
  }

  return nuxt;
}
