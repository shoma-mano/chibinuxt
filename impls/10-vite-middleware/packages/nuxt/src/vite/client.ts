import { join } from 'node:path'
import { mergeConfig, type UserConfig, build, createServer, type Connect } from 'vite'
import type { ViteBuildContext } from './build'

export async function buildClient(ctx: ViteBuildContext) {
  const define = {
    'import.meta.server': 'false',
    '__VUE_OPTIONS_API__': 'true',
    '__VUE_PROD_DEVTOOLS__': 'false',
    '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': 'false',
  }

  const clientConfig = mergeConfig(ctx.config, {
    build: {
      rollupOptions: {
        input: join(import.meta.dirname, '../app/entry.client.js'),
        output: {
          entryFileNames: '_entry.client.js',
        },
      },
    },
    appType: 'custom',
    define,
    optimizeDeps: {
      esbuildOptions: {
        define,
      },
    },
  } satisfies UserConfig)

  if (ctx.nuxt.options.dev) {
    // Dev mode: create Vite dev server as middleware (no HMR yet)
    const devConfig = mergeConfig(clientConfig, {
      server: {
        middlewareMode: true,
        hmr: false,
      },
    })
    const viteServer = await createServer(devConfig)

    const viteMiddleware: Connect.NextHandleFunction = (req, res, next) => {
      viteServer.middlewares.handle(req, res, next)
    }

    await ctx.nuxt.callHook('server:devMiddleware', viteMiddleware)

    ctx.nuxt.hook('close', async () => {
      await viteServer.close()
    })
  }
  else {
    // Production mode: build
    await build(clientConfig)
  }
}
