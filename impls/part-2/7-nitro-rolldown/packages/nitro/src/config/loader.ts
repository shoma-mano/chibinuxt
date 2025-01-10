import { loadConfig } from 'c12'
import type { NitroConfig, NitroOptions } from '../types/nitro'

export const loadOptions = async (
  config: NitroConfig,
): Promise<NitroOptions> => {
  const options = await _loadUserConfig(config)
  return options
}

const _loadUserConfig = async (configOverrides: NitroConfig = {}) => {
  const loadedConfig = await loadConfig<NitroConfig>({
    overrides: configOverrides,
    defaults: {
      entry: 'src/index.ts',
    },
  })
  return loadedConfig.config as NitroOptions
}
