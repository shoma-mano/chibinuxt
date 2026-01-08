import type { NitroConfig, NitroOptions } from 'nitro/types'

export const loadOptions = async (
  config: NitroConfig,
): Promise<NitroOptions> => {
  return config as NitroOptions
}
