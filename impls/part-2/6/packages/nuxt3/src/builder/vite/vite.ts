import { resolve } from "path";
import { mkdir, writeFile } from "node:fs/promises";
import vue from "@vitejs/plugin-vue";
import consola from "consola";
import * as vite from "vite";
import { defineEventHandler } from "h3";
import type { Nuxt } from "../../core/nuxt";

interface ViteBuildContext {
  nuxt: Nuxt;
  config: vite.InlineConfig;
}

export async function bundle(nuxt: Nuxt) {
  const ctx: ViteBuildContext = {
    nuxt,
    config: {
      root: nuxt.options.buildDir,
      mode: "development",
      logLevel: "warn",
      resolve: {
        alias: {
          "#root": nuxt.options.rootDir,
          "#app": nuxt.options.appDir,
          "#build": nuxt.options.buildDir,
          "nuxt/app": nuxt.options.appDir,
          "nuxt/build": nuxt.options.buildDir,
          "~": nuxt.options.srcDir,
          "@": nuxt.options.srcDir,
        },
      },
      clearScreen: false,
      plugins: [vue({})],
      build: {
        emptyOutDir: false,
      },
      define: {
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: true,
      },
    },
  };

  await mkdir(nuxt.options.buildDir, { recursive: true });
  await mkdir(resolve(nuxt.options.buildDir, ".vite/temp"), {
    recursive: true,
  });

  const callBuild = async (fn, name) => {
    try {
      const start = Date.now();
      await fn(ctx);
      const time = (Date.now() - start) / 1000;
      consola.success(`${name} compiled successfully in ${time}s`);
    } catch (err) {
      consola.error(`${name} compiled with errors:`, err);
    }
  };

  if (nuxt.options.dev) {
    await Promise.all([
      callBuild(buildClient, "Client"),
      callBuild(buildServer, "Server"),
    ]);
  } else {
    await callBuild(buildClient, "Client");
    await callBuild(buildServer, "Server");
  }
}

async function buildClient(ctx: ViteBuildContext) {
  const clientConfig: vite.InlineConfig = vite.mergeConfig(ctx.config, {
    define: {
      "process.server": false,
      "process.client": true,
    },
    build: {
      outDir: "dist/client",
      assetsDir: ".",
      rollupOptions: {
        input: resolve(ctx.nuxt.options.buildDir, "./entry.client.js"),
      },
    },
    appType: "custom",
    server: {
      middlewareMode: true,
    },
  } as vite.InlineConfig);

  if (ctx.nuxt.options.dev) {
    const viteServer = await vite.createServer(clientConfig);
    ctx.nuxt.hooks.callHook(
      "server:devMiddleware",
      defineEventHandler(async (event) => {
        // Workaround: vite devmiddleware modifies req.url
        const _originalPath = event.node.req.url;
        await new Promise((resolve, reject) => {
          viteServer.middlewares.handle(
            event.node.req,
            event.node.res,
            (err) => {
              event.node.req.url = _originalPath;
              err ? reject(err) : resolve(null);
            }
          );
        });
      })
    );
  } else {
    await vite.build(clientConfig);
  }
}

async function buildServer(ctx: ViteBuildContext) {
  const serverConfig: vite.InlineConfig = vite.mergeConfig(ctx.config, {
    define: {
      "process.server": true,
      "process.client": false,
      window: undefined,
    },
    build: {
      outDir: "dist/server",
      ssr: true,
      rollupOptions: {
        input: resolve(ctx.nuxt.options.buildDir, "./entry.server.mjs"),
        output: {
          format: "esm",
          entryFileNames: "[name].mjs",
        },
      },
    },
  } as vite.InlineConfig);

  const serverDist = resolve(ctx.nuxt.options.buildDir, "dist/server");
  await mkdir(serverDist, { recursive: true });
  await writeFile(resolve(serverDist, "client.manifest.json"), "false");
  await writeFile(
    resolve(serverDist, "server.js"),
    `const entry = import('${ctx.nuxt.options.buildDir}/dist/server/entry.server.mjs').then((m) => m.default);export default entry;`
  );
  console.log("server entry created");

  await vite.build(serverConfig);

  if (ctx.nuxt.options.dev) {
    ctx.nuxt.hooks.hook("builder:watch", () => {
      vite.build(serverConfig).catch(consola.error);
    });
  }
}
