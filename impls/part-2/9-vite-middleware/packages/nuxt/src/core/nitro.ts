import { resolve } from 'node:path'
import { createDevServer, createNitro } from 'nitro'
import { fromNodeMiddleware } from 'h3'
import { distDir } from '../dir'
import type { Nuxt } from './nuxt'

export const initNitro = async (nuxt: Nuxt) => {
  const rendererPath = nuxt.options.dev
    ? resolve(distDir, 'core/runtime/nitro/dev-renderer.js')
    : resolve(distDir, 'core/runtime/nitro/renderer.js')

  const nitro = await createNitro({
    renderer: rendererPath,
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
