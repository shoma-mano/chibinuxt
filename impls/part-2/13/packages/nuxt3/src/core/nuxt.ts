import type { IncomingHttpHeaders } from 'node:http'

import type { Hookable } from 'hookable'
import { createHooks } from 'hookable'

import { getNuxtConfig } from '../config'
import type { Configuration, NormalizedConfiguration } from '../config'

import { version } from '../../package.json'

import { initNitro } from './nitro'

export interface Nuxt {
  _ready?: Promise<this | undefined>
  _initCalled?: boolean

  error?: Error & { statusCode?: number, headers?: IncomingHttpHeaders }
  options: NormalizedConfiguration
  version: string
  server?: any
  renderer?: any
  render?: any['app']
  hooks: Hookable<any>
  showReady?: () => void
  init: () => Promise<Nuxt | undefined>
  close: (callback?: () => any | Promise<any>) => Promise<void>
}

export const createNuxt = (options: Configuration = {}) => {
  const hooks = createHooks<any>()

  const normalizedOptions = getNuxtConfig(options)

  const nuxt: Nuxt = {
    hooks,
    _initCalled: false,
    options: normalizedOptions as any,
    init: () => initNuxt(nuxt),
    get version() {
      return (
        `v${version}` + ((global as any).__NUXT_DEV__ ? '-development' : '')
      )
    },
    async close(callback?: () => any | Promise<any>) {
      await hooks.callHook('close', this)

      if (typeof callback === 'function') {
        await callback()
      }
    },
  }

  return nuxt
}

const initNuxt = async (nuxt: Nuxt) => {
  if (nuxt._initCalled) {
    return this
  }
  nuxt._initCalled = true

  // Await for server
  initNitro(nuxt)

  // Call ready hook
  await nuxt.hooks.callHook('ready', this)

  return nuxt
}
