import { defineBuildConfig, type BuildEntry } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  entries: [
    // Core
    { input: 'src/index.mts' },
    // App
    { input: 'src/app/', outDir: 'dist/app/', ext: 'js' },
    // Runtime dirs
    ...['core', 'pages'].map(
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
  alias: {
    ['nuxt']: 'nuxt', // this is necessary for resolveAlias not to change id (https://github.com/unjs/unbuild/blob/997497b356b2ebe19112d2f6436a349a74885d68/src/builders/rollup/config.ts#L65)
  },
})
