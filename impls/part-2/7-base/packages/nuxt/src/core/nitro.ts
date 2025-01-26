import { resolve } from 'node:path'
import { createDevServer, createNitro } from 'nitro'
import { distDir } from '../dir'
import type { Nuxt } from './nuxt'

export const initNitro = async (nuxt: Nuxt) => {
  const nitro = await createNitro({
    renderer: resolve(distDir, 'core/runtime/nitro/renderer.js'),
  })
  nuxt.server = await createDevServer(nitro)
}
