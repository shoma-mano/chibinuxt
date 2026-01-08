import { defineBuildConfig, type BuildEntry } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  entries: [
    // Core
    { input: 'src/index' },
    // App
    { input: 'src/app/', outDir: 'dist/app/', ext: 'js' },
    // Runtime dirs
    ...['core'].map(
      name =>
        ({
          input: `src/${name}/runtime/`,
          outDir: `dist/${name}/runtime`,
          format: 'esm',
          ext: 'js',
        }) as BuildEntry,
    ),
    { input: 'src/bin.ts' },
  ],
})
