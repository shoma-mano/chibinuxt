import { resolve } from 'node:path'
import { createDevServer, createNitro } from 'nitro'
import { fromNodeMiddleware } from 'h3'
import { distDir } from '../dir'
import type { Nuxt } from './nuxt'

export const initNitro = async (nuxt: Nuxt) => {
  const nitro = await createNitro({
    renderer: resolve(distDir, 'core/runtime/nitro/renderer.js'),
  })

  // Hook to register dev middleware
  nuxt.hook('server:devMiddleware', (middleware) => {
    nitro.options.devHandlers.unshift({
      handler: fromNodeMiddleware(middleware),
    })
  })

  nuxt.server = createDevServer(nitro)
  return nitro
}
