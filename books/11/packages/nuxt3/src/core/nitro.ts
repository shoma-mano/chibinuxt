// eslint-disable-next-line import/named
import { wpfs, getNitroContext, createDevServer, resolveMiddleware, build, prepare, generate } from '@nuxt/nitro'
import type { Nuxt } from './index'

export function initNitro (nuxt: Nuxt) {
  // Create contexts
  const nitroContext = getNitroContext(nuxt.options, nuxt.options.nitro || {})
  const nitroDevContext = getNitroContext(nuxt.options, { preset: 'dev' })

  nuxt.server = createDevServer(nitroDevContext)

  // Connect hooks
  nuxt.addHooks(nitroContext.nuxtHooks)
  nuxt.hook('close', () => nitroContext._internal.hooks.callHook('close'))

  nuxt.addHooks(nitroDevContext.nuxtHooks)
  nuxt.hook('close', () => nitroDevContext._internal.hooks.callHook('close'))

  // Expose process.env.NITRO_PRESET
  nuxt.options.env.NITRO_PRESET = nitroContext.preset

  // Resolve middleware
  nuxt.hook('modules:done', () => {
    const { middleware, legacyMiddleware } =
      resolveMiddleware(nuxt.options.serverMiddleware, nuxt.resolver.resolvePath)
    nuxt.server.setLegacyMiddleware(legacyMiddleware)
    nitroContext.middleware.push(...middleware)
    nitroDevContext.middleware.push(...middleware)
  })

  // nuxt build/dev
  nuxt.hook('build:done', async () => {
    if (nuxt.options.dev) {
      await build(nitroDevContext)
    } else if (!nitroContext._nuxt.isStatic) {
      await prepare(nitroContext)
      await generate(nitroContext)
      await build(nitroContext)
    }
  })

  // nude dev
  if (nuxt.options.dev) {
    nitroDevContext._internal.hooks.hook('nitro:compiled', () => { nuxt.server.watch() })
    nuxt.hook('build:compile', ({ compiler }) => { compiler.outputFileSystem = wpfs })
    nuxt.hook('server:devMiddleware', (m) => { nuxt.server.setDevMiddleware(m) })
  }
}
