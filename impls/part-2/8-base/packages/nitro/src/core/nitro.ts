import { loadOptions } from '../config/loader'
import type { Nitro } from '../types/nitro'

export const createNitro = () => {
  const options = loadOptions()
  const nitro: Nitro = {
    options,
  }
  return nitro
}
