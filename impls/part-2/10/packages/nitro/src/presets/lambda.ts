import type { NitroPreset } from '../context'

export const lambda: NitroPreset = {
  entry: '{{ _internal.runtimeDir }}/entries/lambda',
  externals: true,
}
