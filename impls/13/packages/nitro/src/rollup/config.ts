import { dirname, join, resolve } from 'node:path'
import type { InputOptions, OutputOptions } from 'rollup'
import defu from 'defu'
import nodeResolve from '@rollup/plugin-node-resolve'
import alias from '@rollup/plugin-alias'
import * as un from '@nuxt/un'

import type { NitroContext } from '../context'
import { resolvePath } from '../utils'

import { externals } from './plugins/externals'
import { esbuild } from './plugins/esbuild'
import { dirnames, staticAssets } from './plugins/static'
import { middleware } from './plugins/middleware'

export type RollupConfig = InputOptions & { output: OutputOptions }
export const getRollupConfig = (nitroContext: NitroContext) => {
  const extensions: string[] = ['.ts', '.mjs', '.js', '.json', '.node']

  const nodePreset = nitroContext.node === false ? un.nodeless : un.node

  const env = un.env(nodePreset, {}, nitroContext.env)

  const rollupConfig: RollupConfig = {
    input: resolvePath(nitroContext, nitroContext.entry!),
    output: {
      dir: nitroContext.output.serverDir,
      entryFileNames: 'index.js',
      chunkFileNames() {
        return join('chunks', '[name].js')
      },
      inlineDynamicImports: nitroContext.inlineDynamicImports,
      format: 'esm',
      exports: 'auto',
      intro: '',
      outro: '',
      sourcemap: nitroContext.sourceMap,
      sourcemapExcludeSources: true,
      sourcemapPathTransform(relativePath, sourcemapPath) {
        return resolve(dirname(sourcemapPath), relativePath)
      },
    },
    external: env.external,
    plugins: [],
    onwarn(warning, rollupWarn) {
      if (!['CIRCULAR_DEPENDENCY', 'EVAL'].includes(warning.code!)) {
        rollupWarn(warning)
      }
    },
  }

  if (!Array.isArray(rollupConfig.plugins)) {
    return
  }

  // ESBuild
  rollupConfig.plugins.push(
    esbuild({
      sourceMap: true,
    }),
  )

  // Static
  rollupConfig.plugins.push(dirnames())
  rollupConfig.plugins.push(staticAssets(nitroContext))

  // Middleware
  rollupConfig.plugins.push(
    middleware(() => {
      return nitroContext.serveStatic ? [{ route: '/', handle: '~runtime/server/static' }] : [{ route: '/', handle: '~runtime/server/static' }]
    }),
  )

  // Alias Plugin
  rollupConfig.plugins.push(
    alias({
      entries: {
        '~runtime': nitroContext._internal.runtimeDir,
        '~build': nitroContext._nuxt.buildDir,
      },
    }),
  )

  // Externals Plugin
  if (nitroContext.externals) {
    const externalOption = defu(nitroContext.externals as any, {
      outDir: nitroContext.output.serverDir,
      ignore: [
        nitroContext._internal.runtimeDir,
        ...(nitroContext._nuxt.dev ? [] : [nitroContext._nuxt.buildDir]),
        ...nitroContext.middleware.map(m => m.handle),
        nitroContext._nuxt.serverDir,
      ],
      trace: true,
      traceOptions: {
        base: nitroContext._nuxt.rootDir,
      },
    })
    rollupConfig.plugins.push(externals(externalOption))
  }

  // https://github.com/rollup/plugins/tree/master/packages/node-resolve
  rollupConfig.plugins.push(
    nodeResolve({
      extensions,
      preferBuiltins: true,
      rootDir: nitroContext._nuxt.rootDir,
      mainFields: ['main'], // Force resolve CJS (@vue/runtime-core ssrUtils)
    }),
  )

  return rollupConfig
}
