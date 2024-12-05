import type { IncomingHttpHeaders } from 'http'

import isPlainObject from 'lodash/isPlainObject'
import consola from 'consola'
import { Hookable, createHooks } from 'hookable'

import { getNuxtConfig, Configuration, NormalizedConfiguration } from '../config'

import { version } from '../../package.json'

import Resolver from './resolver'
import { initNitro } from './nitro'

declare global {
  namespace NodeJS {
    interface Global {
      __NUXT_DEV__: boolean
    }
  }
}

export interface Nuxt {
  _ready?: Promise<this>
  _initCalled?: boolean

  error?: Error & { statusCode?: number, headers?: IncomingHttpHeaders }
  options: NormalizedConfiguration
  resolver?: Resolver
  version: string
  server?: any
  renderer?: any
  render?: any['app']
  hooks:Hookable<any>
  showReady?: () => void
  init: () => Promise<Nuxt>
  ready: () => Promise<Nuxt>
  close: (callback?: () => any | Promise<any>) => Promise<void>
}

export const createNuxt = (options: Configuration = {}) => {
  const hooks = createHooks<any>()

  const normalizedOptions = getNuxtConfig(options)
  const deletes = [
    'mode', 'modern', 'modules', 'messages', 'vue', 'vueMeta', 'css','loadingIndicator','loading','modes',
    'plugins', 'extendPlugins', 'layouts', 'ErrorPage','pageTransition','features','layoutTransition','head',
    'buildModules', '_modules', 'serverMiddleware','editor','hooks','watchers','_build','__normalized__',
    '_routerBaseSpecified','test','debug','fetch','_nuxtConfigFile','vite','_nuxtConfigFiles','export','telemetry',
    'documentPath','cli','server','render','ssr','target','ignoreOptions','ignorePrefix','watch','alias','styleExtensions',
    'publicRuntimeConfig','privateRuntimeConfig','globals'
  ]
  for (const key of deletes) {
    delete normalizedOptions[key]
  }

  normalizedOptions.router= {
    base: "/",
  }

  normalizedOptions.generate = {
    dir:"/Users/mano/playground/nuxts/nuxt/books/0/playground/dist",
    staticAssets: {
      base: "/_nuxt/static",
      dir: "static",
    },
  }

  // nitroで使用している
  // env dir router globalName
  // どこで使われているかまだわからない
  // _majorVersion appDir
  // resolvePageRoutesで使用
  // extensions
  // getNitroContextで使用
  // generate build srcDir buildDir
  // Builderのconstructorで使用
  // ignore

  const nuxt: Nuxt = {
    hooks,
    _ready: undefined,
    _initCalled: false,
    error: undefined,
    options: normalizedOptions as any,
    server: undefined,
    renderer: undefined,
    render: undefined,
    showReady: undefined,
    ready: () => {
      if (!nuxt._ready) {
        nuxt._ready = initNuxt(nuxt)
      }
      return nuxt._ready
    },
    init: () => initNuxt(nuxt),
    get version () {
      return `v${version}` + (global.__NUXT_DEV__ ? '-development' : '')
    },
    async close (callback?: () => any | Promise<any>) {
      await hooks.callHook('close', this)

      if (typeof callback === 'function') {
        await callback()
      }
    }
  }
  console.log('nuxt normalized options', nuxt.options)
  nuxt.resolver = new Resolver(nuxt)

  return nuxt
}

const initNuxt = async (nuxt: Nuxt) => {
  if (nuxt._initCalled) {
    return this
  }
  nuxt._initCalled = true

  // Add hooks
  if (nuxt.options.hooks instanceof Function) {
    nuxt.options.hooks(nuxt.hooks)
  } else if (isPlainObject(nuxt.options.hooks)) {
    nuxt.hooks.addHooks(nuxt.options.hooks)
  }

  // Await for server
  await initNitro(nuxt)

  // Await for modules
  // await this.moduleContainer.ready()

  // Call ready hook
  await nuxt.hooks.callHook('ready', this)

  return nuxt
}
