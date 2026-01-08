import type { Nitro, NitroConfig } from './types'

export async function createNitro(config: NitroConfig = {}): Promise<Nitro> {
  const nitro: Nitro = {
    options: {
      renderer: config.renderer,
    },
  }
  return nitro
}
