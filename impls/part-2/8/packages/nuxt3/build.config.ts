import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    {
      input: 'src/app',
      outDir: 'dist/app',
      builder: 'mkdist',
      declaration: 'compatible',
    },
    {
      input: 'src/index.ts',
      builder: 'rollup',
    },
  ],
  rollup: {
    commonjs: {},
    emitCJS: true,
  },
})
