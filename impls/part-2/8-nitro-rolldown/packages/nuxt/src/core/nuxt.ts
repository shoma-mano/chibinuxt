import { join } from 'node:path'
import type { Hookable } from 'hookable'
import { createHooks } from 'hookable'
import { build } from 'nitro'
import { bundle } from '../vite/build'
import { distDir } from '../dir'
import type { NuxtHooks } from '../schema'
import { initNitro } from './nitro'

type NuxtOptions = {
  appDir?: string
}

export type Nuxt = {
  server?: any
  options?: NuxtOptions
  ready?: () => Promise<void>
  hooks: Hookable<NuxtHooks>
  hook: Nuxt['hooks']['hook']
  callHook: Nuxt['hooks']['callHook']
}

const loadNuxtConfig = (): NuxtOptions => {
  // implement later
  return {}
}

const createNuxt = (options: NuxtOptions): Nuxt => {
  const hooks = createHooks<NuxtHooks>()

  const nuxt: Nuxt = {
    callHook: hooks.callHook,
    hooks,
    hook: hooks.hook,
    options,
  }
  return nuxt
}

export const loadNuxt = async () => {
  const options = loadNuxtConfig()
  options.appDir = join(distDir, 'app')
  const nuxt = createNuxt(options)
  const nitro = await initNitro(nuxt)
  await bundle(nuxt)
  await build(nitro)

  // this is temporary workaround
  process.env.APP_DIST_DIR = options.appDir
  return nuxt
}
