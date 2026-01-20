import { defineBuildConfig, type BuildEntry } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  entries: [
    // Core
    { input: 'src/index.ts' },
    // App
    { input: 'src/app/', outDir: 'dist/app/', ext: 'js' },
    // Runtime
    { input: 'src/core/runtime/', outDir: 'dist/core/runtime', format: 'esm', ext: 'js' },
    // Bin
    { input: 'src/bin.ts' },
  ],
  alias: {
    ['nuxt']: 'nuxt',
  },
})
