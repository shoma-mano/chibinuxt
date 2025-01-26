import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  entries: ['./src/core/index.ts', './src/runtime/index.ts'],
  alias: {
    'nitro/runtime': './src/runtime/index.ts',
    ['nitro']: 'nitro',
  },
})
