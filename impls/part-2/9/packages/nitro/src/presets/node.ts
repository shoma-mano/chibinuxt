import type { NitroPreset } from '../context'

export const node: NitroPreset = {
  entry: '{{ _internal.runtimeDir }}/entries/node',
  externals: true,
}
