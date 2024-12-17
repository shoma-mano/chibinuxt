import { join, resolve } from "path";
import { dirname } from "path";
import { InputOptions, OutputOptions } from "rollup";
import defu from "defu";
import nodeResolve from "@rollup/plugin-node-resolve";
import alias from "@rollup/plugin-alias";
import type { Preset } from "@nuxt/un";
import * as un from "@nuxt/un";

import { NitroContext } from "../context";
import { resolvePath, MODULE_DIR } from "../utils";

import { externals } from "./plugins/externals";
import { esbuild } from "./plugins/esbuild";

export type RollupConfig = InputOptions & { output: OutputOptions };

export const getRollupConfig = (nitroContext: NitroContext) => {
  const extensions: string[] = [".ts", ".mjs", ".js", ".json", ".node"];

  const nodePreset = nitroContext.node === false ? un.nodeless : un.node;

  const builtinPreset: Preset = {
    alias: {
      // General
      debug: "un/npm/debug",
      depd: "un/npm/depd",
      // Vue 2
      encoding: "un/mock/proxy",
      he: "un/mock/proxy",
      resolve: "un/mock/proxy",
      "source-map": "un/mock/proxy",
      "lodash.template": "un/mock/proxy",
      "serialize-javascript": "un/mock/proxy",
      // Vue 3
      "@babel/parser": "un/mock/proxy",
      "@vue/compiler-core": "un/mock/proxy",
      "@vue/compiler-dom": "un/mock/proxy",
      "@vue/compiler-ssr": "un/mock/proxy",
    },
  };

  const env = un.env(nodePreset, builtinPreset, nitroContext.env);

  delete env.alias["node-fetch"]; // FIX ME

  const rollupConfig: RollupConfig = {
    input: resolvePath(nitroContext, nitroContext.entry),
    output: {
      dir: nitroContext.output.serverDir,
      entryFileNames: "index.js",
      chunkFileNames() {
        return join("chunks", "[name].js");
      },
      inlineDynamicImports: nitroContext.inlineDynamicImports,
      format: "esm",
      exports: "auto",
      intro: "",
      outro: "",
      preferConst: true,
      sourcemap: nitroContext.sourceMap,
      sourcemapExcludeSources: true,
      sourcemapPathTransform(relativePath, sourcemapPath) {
        return resolve(dirname(sourcemapPath), relativePath);
      },
    },
    external: env.external,
    plugins: [],
    onwarn(warning, rollupWarn) {
      if (!["CIRCULAR_DEPENDENCY", "EVAL"].includes(warning.code)) {
        rollupWarn(warning);
      }
    },
  };

  if (!rollupConfig.plugins) return;

  // ESBuild
  rollupConfig.plugins.push(
    esbuild({
      sourceMap: true,
    })
  );

  rollupConfig.plugins.push(
    alias({
      entries: {
        "~runtime": nitroContext._internal.runtimeDir,
        "~build": nitroContext._nuxt.buildDir,
      },
    })
  );

  const moduleDirectories = [
    resolve(nitroContext._nuxt.rootDir, "node_modules"),
    resolve(MODULE_DIR, "node_modules"),
    resolve(MODULE_DIR, "../node_modules"),
    "node_modules",
  ];

  // Externals Plugin
  if (nitroContext.externals) {
    const external = defu(nitroContext.externals as any, {
      outDir: nitroContext.output.serverDir,
      ignore: [
        nitroContext._internal.runtimeDir,
        ...(nitroContext._nuxt.dev ? [] : [nitroContext._nuxt.buildDir]),
        ...nitroContext.middleware.map((m) => m.handle),
        nitroContext._nuxt.serverDir,
      ],
      traceOptions: {
        base: nitroContext._nuxt.rootDir,
      },
    });
    rollupConfig.plugins.push(externals(external));
  }

  // https://github.com/rollup/plugins/tree/master/packages/node-resolve
  rollupConfig.plugins.push(
    nodeResolve({
      extensions,
      preferBuiltins: true,
      rootDir: nitroContext._nuxt.rootDir,
      moduleDirectories,
      mainFields: ["main"], // Force resolve CJS (@vue/runtime-core ssrUtils)
    })
  );

  return rollupConfig;
};
