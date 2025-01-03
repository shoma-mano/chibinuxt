import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    {
      input: 'src/runtime',
      declaration: 'node16',
      outDir: 'dist/runtime',
      builder: 'mkdist',
    },
    {
      input: 'src/index',
      declaration: 'compatible',
      builder: 'rollup',
    },
  ],
  rollup: {
    commonjs: {},
    emitCJS: true,
  },
})
