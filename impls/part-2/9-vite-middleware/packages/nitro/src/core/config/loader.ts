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
  const preset = resolvePreset(presetOverride)
  const loadedConfig = await loadConfig<NitroConfig>({
    overrides: configOverrides,
    defaults: preset,
  })
  return loadedConfig.config as NitroOptions
}
