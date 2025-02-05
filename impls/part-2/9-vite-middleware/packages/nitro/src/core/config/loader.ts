import { loadConfig } from 'c12'
import { resolvePreset } from 'nitro/presets'
import type { NitroConfig, NitroOptions } from 'nitro/types'

export const loadOptions = async (
  config: NitroConfig,
): Promise<NitroOptions> => {
  const options = await _loadUserConfig(config)
  return options
}

const _loadUserConfig = async (configOverrides: NitroConfig = {}) => {
  const presetOverride = configOverrides.preset || 'nitro-dev'
  // const preset = resolvePreset(presetOverride)
  const loadedConfig = await loadConfig<NitroConfig>({
    extend: { extendKey: ['preset'] },
    overrides: {
      ...configOverrides,
      preset: presetOverride,
    },
    resolve(id) {
      const config = resolvePreset(id)
      if (config) {
        return {
          config,
        }
      }
    },
  })
  return loadedConfig.config as NitroOptions
}
