import { resolve } from 'upath'
import defu from 'defu'
import type { NuxtOptions } from '@nuxt/types'
import type { Hookable, Hooks } from 'hookable'
import { createHooks } from 'hookable'
import type { Preset } from '@nuxt/un'
import { tryImport, resolvePath, detectTarget, extendPreset } from './utils'
import * as PRESETS from './presets'
import type { NodeExternalsOptions } from './rollup/plugins/externals'
import type { ServerMiddleware } from './server/middleware'

export interface NitroContext {
  timing: boolean
  inlineDynamicImports: boolean
  minify: boolean
  sourceMap: boolean
  externals: boolean | NodeExternalsOptions
  analyze: boolean
  entry: string
  node: boolean
  preset: string
  rollupConfig?: any
  renderer: string
  serveStatic: boolean
  middleware: ServerMiddleware[]
  scannedMiddleware: ServerMiddleware[]
  hooks: Hooks
  nuxtHooks: Hooks
  ignore: string[]
  env: Preset
  output: {
    dir: string
    serverDir: string
    publicDir: string
  }
  templatePath?: string
  _nuxt: {
    majorVersion: number
    dev: boolean
    rootDir: string
    srcDir: string
    buildDir: string
    generateDir: string
    staticDir: string
    serverDir: string
    routerBase: string
    publicPath: string
    isStatic: boolean
    fullStatic: boolean
    staticAssets: any
    runtimeConfig: { public: any, private: any }
  }
  _internal: {
    runtimeDir: string
    hooks: Hookable
  }
}

type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> }

export interface NitroInput extends DeepPartial<NitroContext> {}

export type NitroPreset = NitroInput | ((input: NitroInput) => NitroInput)

export function getNitroContext(
  nuxtOptions: NuxtOptions,
  input: NitroInput,
): NitroContext {
  const defaults: NitroContext = {
    timing: undefined,
    inlineDynamicImports: undefined,
    minify: undefined,
    sourceMap: undefined,
    externals: undefined,
    analyze: undefined,
    entry: undefined,
    node: undefined,
    preset: undefined,
    rollupConfig: undefined,
    renderer: undefined,
    serveStatic: undefined,
    middleware: [],
    scannedMiddleware: [],
    ignore: [],
    env: {},
    hooks: {},
    nuxtHooks: {},
    output: {
      dir: '{{ _nuxt.rootDir }}/.output',
      serverDir: '{{ output.dir }}/server',
      publicDir: '{{ output.dir }}/public',
    },
    templatePath: resolve('.', '.nuxt/views/app.template.html'),
    _nuxt: {
      majorVersion: nuxtOptions._majorVersion || 2,
      dev: nuxtOptions.dev,
      rootDir: nuxtOptions.rootDir,
      srcDir: nuxtOptions.srcDir,
      buildDir: nuxtOptions.buildDir,
      generateDir: nuxtOptions.generate.dir,
      staticDir: nuxtOptions.dir.static,
      serverDir: resolve(
        nuxtOptions.srcDir,
        (nuxtOptions.dir as any).server || 'server',
      ),
      routerBase: nuxtOptions.router.base,
      publicPath: nuxtOptions.build.publicPath,
      isStatic: nuxtOptions.target === 'static' && !nuxtOptions.dev,
      fullStatic:
        nuxtOptions.target === 'static' && !nuxtOptions._legacyGenerate,
      // @ts-ignore
      staticAssets: nuxtOptions.generate.staticAssets,
      runtimeConfig: {
        public: nuxtOptions.publicRuntimeConfig,
        private: nuxtOptions.privateRuntimeConfig,
      },
    },
    _internal: {
      runtimeDir: resolve(__dirname, './runtime'),
      hooks: createHooks(),
    },
  }

  defaults.preset
    = input.preset || process.env.NITRO_PRESET || detectTarget() || 'server'
  let presetDefaults
    = PRESETS[defaults.preset] || tryImport(nuxtOptions.rootDir, defaults.preset)
  if (!presetDefaults) {
    throw new Error('Cannot resolve preset: ' + defaults.preset)
  }
  presetDefaults = presetDefaults.default || presetDefaults

  const _presetInput = defu(input, defaults)
  // @ts-ignore
  const _preset = extendPreset(input, presetDefaults)(_presetInput)
  const nitroContext: NitroContext = defu(_preset, defaults) as any

  nitroContext.output.dir = resolvePath(nitroContext, nitroContext.output.dir)
  nitroContext.output.publicDir = resolvePath(
    nitroContext,
    nitroContext.output.publicDir,
  )
  nitroContext.output.serverDir = resolvePath(
    nitroContext,
    nitroContext.output.serverDir,
  )
  console.log('nitroContext.output.serverDir', nitroContext.output.serverDir)

  nitroContext._internal.hooks.addHooks(nitroContext.hooks)

  return nitroContext
}

export const createNitroContext = () => {
  const defaults = {
    preset: 'dev',
    timing: undefined,
    inlineDynamicImports: undefined,
    minify: undefined,
    sourceMap: undefined,
    externals: undefined,
    analyze: undefined,
    entry: undefined,
    node: undefined,
    rollupConfig: undefined,
    renderer: undefined,
    serveStatic: undefined,
    middleware: [],
    scannedMiddleware: [],
    ignore: [],
    env: {},
    hooks: {},
    nuxtHooks: {},
    templatePath: resolve('.', '.nuxt/views/app.template.html'),
    output: {
      dir: '{{ _nuxt.rootDir }}/.output',
      serverDir: '{{ output.dir }}/server',
      publicDir: '{{ output.dir }}/public',
    },
    _internal: {
      hooks: createHooks(),
      runtimeDir: resolve(__dirname, './runtime'),
    },
  } as NitroContext

  let presetDefaults = PRESETS[defaults.preset]
  if (!presetDefaults) {
    throw new Error('Cannot resolve preset: ' + defaults.preset)
  }
  presetDefaults = presetDefaults.default || presetDefaults

  // @ts-ignore
  const _preset = extendPreset({}, presetDefaults)(defaults)
  const nitroContext: NitroContext = defu(_preset, defaults) as any

  nitroContext.output.dir = resolvePath(nitroContext, nitroContext.output.dir)
  nitroContext.output.publicDir = resolvePath(
    nitroContext,
    nitroContext.output.publicDir,
  )
  nitroContext.output.serverDir = resolvePath(
    nitroContext,
    nitroContext.output.serverDir,
  )
  console.log('nitroContext.output.serverDir', nitroContext.output.serverDir)

  nitroContext._internal.hooks.addHooks(nitroContext.hooks)

  return nitroContext
}
