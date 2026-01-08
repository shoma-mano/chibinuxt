import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  entries: [
    './src/index.ts',
    './src/runtime/index.ts',
    './src/types/index.ts',
  ],
  alias: {
    'nitro/runtime': './src/runtime/index.ts',
    'nitro/types': './src/types/index.ts',
    ['nitro']: 'nitro',
  },
})
