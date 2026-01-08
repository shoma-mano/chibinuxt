import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  entries: [
    // Main entry
    { input: 'src/index.ts' },
    // Runtime
    { input: 'src/runtime/', outDir: 'dist/runtime', format: 'esm' },
    // Types
    { input: 'src/types/', outDir: 'dist/types', format: 'esm' },
  ],
  alias: {
    'nitro/runtime': './src/runtime/index.ts',
    ['nitro']: 'nitro',
  },
  externals: ['nitro/runtime', 'nitro/types'],
})
