import allPresets from './all'

export const resolvePreset = (name: string) => {
  const preset = allPresets.find(preset => preset.name === name)
  if (!preset) {
    throw new Error(`Preset not found: ${name}`)
  }
  return preset
}
