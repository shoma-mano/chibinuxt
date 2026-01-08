import type { Nitro, NitroConfig } from '../types'

export const createNitro = async (config: NitroConfig = {}) => {
  const nitro: Nitro = {
    options: {
      renderer: config.renderer,
    },
  }
  return nitro
}
