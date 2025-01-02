import { createDevServer, createNitro } from 'nitro'
import type { Nuxt } from './nuxt'

export const initNitro = (nuxt: Nuxt) => {
  const nitro = createNitro()
  nuxt.server = createDevServer(nitro)
}
