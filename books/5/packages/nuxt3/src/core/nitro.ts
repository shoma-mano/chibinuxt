// eslint-disable-next-line import/named
import {
  wpfs,
  getNitroContext,
  createDevServer,
  resolveMiddleware,
  build,
  prepare,
  generate,
} from "@nuxt/nitro";
import type { Nuxt } from "./index";
import { dynamicEventHandler } from "h3";

const devMiddlewareHandler = dynamicEventHandler();
export function initNitro(nuxt: Nuxt) {
  // Create contexts
  const nitroContext = getNitroContext(nuxt.options, nuxt.options.nitro || {});
  const nitroDevContext = getNitroContext(nuxt.options, { preset: "dev" });
  // handler
  nitroDevContext.viteDevHandler = devMiddlewareHandler;

  nuxt.server = createDevServer(nitroDevContext);

  // Connect hooks
  nuxt.hooks.addHooks(nitroContext.nuxtHooks);
  nuxt.hooks.hook("close", () =>
    nitroContext._internal.hooks.callHook("close")
  );

  nuxt.hooks.addHooks(nitroDevContext.nuxtHooks);
  nuxt.hooks.hook("close", () =>
    nitroDevContext._internal.hooks.callHook("close")
  );

  // Expose process.env.NITRO_PRESET
  nuxt.options.env.NITRO_PRESET = nitroContext.preset;

  // Resolve middleware
  nuxt.hooks.hook("modules:done", () => {
    const { middleware, legacyMiddleware } = resolveMiddleware(
      nuxt.options.serverMiddleware,
      nuxt.resolver.resolvePath
    );
    nuxt.server.setLegacyMiddleware(legacyMiddleware);
    nitroContext.middleware.push(...middleware);
    nitroDevContext.middleware.push(...middleware);
  });

  // nuxt build/dev
  nuxt.hooks.hook("build:done", async () => {
    if (nuxt.options.dev) {
      await build(nitroDevContext);
    } else if (!nitroContext._nuxt.isStatic) {
      await prepare(nitroContext);
      await generate(nitroContext);
      await build(nitroContext);
    }
  });

  // nude dev
  if (nuxt.options.dev) {
    nitroDevContext._internal.hooks.hook("nitro:compiled", () => {
      nuxt.server.watch();
    });
    nuxt.hooks.hook("build:compile", ({ compiler }) => {
      compiler.outputFileSystem = wpfs;
    });
    nuxt.hooks.hook("server:devMiddleware", (m) => {
      devMiddlewareHandler.set(m);
    });
  }
}
