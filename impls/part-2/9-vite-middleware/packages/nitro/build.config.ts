import { defineBuildConfig } from 'unbuild'

export const subpaths = ['core', 'kit', 'presets', 'rollup', 'runtime', 'types']

export default defineBuildConfig({
  declaration: true,
  entries: [
    // Core
    { input: 'src/core/index.ts' },
    // './src/runtime/index.ts',
    // Runtime
    { input: 'src/runtime/', outDir: 'dist/runtime', format: 'esm' },
    // Presets
    { input: 'src/presets/', outDir: 'dist/presets', format: 'esm' },
    // Kit
    { input: 'src/kit/index.ts' },
    // Rolldown
    { input: 'src/rolldown/index.ts' },
    // Types
    { input: 'src/types/index.ts' },
  ],
  alias: {
    'nitro/runtime': './src/runtime/index.ts',
    ['nitro']: 'nitro',
  },
  externals: [...subpaths.map(subpath => `nitro/${subpath}`)],
})
