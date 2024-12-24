import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
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
      declaration: true,
    },
  ],
  rollup: {
    commonjs: {},
    emitCJS: true,
  },
})
