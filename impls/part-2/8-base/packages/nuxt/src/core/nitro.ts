import { createDevServer, createNitro } from 'nitro'
import type { Nuxt } from './nuxt'
import { setupRenderer } from './runtime/nitro/renderer'

export const initNitro = async (nuxt: Nuxt) => {
  const nitro = createNitro()
  nuxt.server = createDevServer(nitro)
  await setupRenderer(nuxt)
}
