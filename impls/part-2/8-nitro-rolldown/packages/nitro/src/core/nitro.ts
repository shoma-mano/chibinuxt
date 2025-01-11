import { loadOptions } from '../config/loader'
import type { Nitro, NitroConfig } from '../types/nitro'

export const createNitro = async (config: NitroConfig = {}) => {
  const options = await loadOptions(config)
  const nitro: Nitro = {
    options,
  }
  return nitro
}
