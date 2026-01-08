import allPresets from './all'

export const resolvePreset = (name: string) => {
  const preset = allPresets.find(preset => preset.name === name)
  return preset
}
