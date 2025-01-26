import type { NitroConfig, NitroOptions } from '../types/nitro'

export const loadOptions = async (
  config: NitroConfig,
): Promise<NitroOptions> => {
  return config as NitroOptions
}
