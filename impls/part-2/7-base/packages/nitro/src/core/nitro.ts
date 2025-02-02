import type { Nitro, NitroConfig } from 'nitro/types'
import { loadOptions } from './dev-server/config/loader'

export const createNitro = async (config: NitroConfig = {}) => {
  const options = await loadOptions(config)
  const nitro: Nitro = {
    options,
  }
  return nitro
}
