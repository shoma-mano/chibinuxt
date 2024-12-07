import type { IncomingHttpHeaders } from 'http'

import isPlainObject from 'lodash/isPlainObject'
import consola from 'consola'
import Hookable from 'hookable'

import { getNuxtConfig, Configuration, NormalizedConfiguration } from '../config'

import { version } from '../../package.json'

import ModuleContainer from './module'
import Resolver from './resolver'
import { initNitro } from './nitro'

declare global {
  namespace NodeJS {
    interface Global {
      __NUXT_DEV__: boolean
    }
  }
}

// export interface _Nuxt {
//   _ready?: Promise<this>
//   _initCalled?: boolean

//   error?: Error & { statusCode?: number, headers?: IncomingHttpHeaders }
//   options: NormalizedConfiguration
//   resolver: Resolver
//   server?: any
//   renderer?: any
//   render?: any['app']
//   hooks:Hookable<any>
//   showReady?: () => void
//   init: () => void
// }

// export const createNuxt = (options: Configuration = {}) => {
//   const hooks = createHooks<any>()

//   const nuxt: _Nuxt = {
//     hooks,
//     _ready: undefined,
//     _initCalled: false,
//     error: undefined,
//     options: getNuxtConfig(options) as any,
//     resolver: new Resolver(),
//     server: undefined,
//     renderer: undefined,
//     render: undefined,
//     showReady: undefined,
//     init: () => initNuxt(nuxt)
//   }

//   return nuxt
// }

// const initNuxt = async (nuxt: _Nuxt) => {
//   if (nuxt._initCalled) {
//     return this
//   }
//   nuxt._initCalled = true

//   // Add hooks
//   if (nuxt.options.hooks instanceof Function) {
//     nuxt.options.hooks(nuxt.hooks)
//   } else if (isPlainObject(nuxt.options.hooks)) {
//     nuxt.hooks.addHooks(nuxt.options.hooks)
//   }

//   // Await for server
//   await initNitro(nuxt)

//   // Await for modules
//   // await this.moduleContainer.ready()

//   // Call ready hook
//   await nuxt.hooks.callHook('ready', this)

//   return nuxt
// }

export default class Nuxt extends Hookable {
  _ready?: Promise<this>
  _initCalled?: boolean

  error?: Error & { statusCode?: number, headers?: IncomingHttpHeaders }
  options: NormalizedConfiguration
  resolver: Resolver
  moduleContainer: ModuleContainer
  server?: any
  renderer?: any
  render?: any['app']
  showReady?: () => void

  constructor (options: Configuration = {}) {
    super(consola)

    // Assign options and apply defaults
    this.options = getNuxtConfig(options)

    // Create instance of core components
    this.resolver = new Resolver(this)
    this.moduleContainer = new ModuleContainer(this)

    // Call ready
    if (this.options._ready !== false) {
      this.ready().catch((err) => {
        consola.fatal(err)
      })
    }
  }

  static get version () {
    return `v${version}` + (global.__NUXT_DEV__ ? '-development' : '')
  }

  ready () {
    if (!this._ready) {
      this._ready = this._init()
    }
    return this._ready
  }

  async _init () {
    if (this._initCalled) {
      return this
    }
    this._initCalled = true

    // Add hooks
    if (this.options.hooks instanceof Function) {
      this.options.hooks(this.hook)
    } else if (isPlainObject(this.options.hooks)) {
      this.addHooks(this.options.hooks)
    }

    // Await for server
    await initNitro(this)

    // Await for modules
    await this.moduleContainer.ready()

    // Call ready hook
    await this.callHook('ready', this)

    return this
  }

  async close (callback?: () => any | Promise<any>) {
    await this.callHook('close', this)

    if (typeof callback === 'function') {
      await callback()
    }
  }
}
