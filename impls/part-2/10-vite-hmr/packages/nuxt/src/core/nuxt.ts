import { join } from 'node:path'
import { build } from 'nitro'
import { bundle } from '../vite/build'
import { distDir } from '../dir'
import { initNitro } from './nitro'

type NuxtOptions = {
  appDir?: string
  dev?: boolean
}

type HookCallback = (...args: any[]) => void | Promise<void>

export type NuxtHooks = {
  'server:devMiddleware': (middleware: any) => void | Promise<void>
  'close': () => void | Promise<void>
}

export type Nuxt = {
  server?: any
  options: NuxtOptions
  ready?: () => Promise<void>
  hooks: Map<keyof NuxtHooks, HookCallback[]>
  hook: <T extends keyof NuxtHooks>(name: T, callback: NuxtHooks[T]) => void
  callHook: <T extends keyof NuxtHooks>(name: T, ...args: Parameters<NuxtHooks[T]>) => Promise<void>
}

const loadNuxtConfig = (): NuxtOptions => {
  // implement later
  return {
    dev: true, // default to dev mode for now
  }
}

const createNuxt = (options: NuxtOptions): Nuxt => {
  const hooks = new Map<keyof NuxtHooks, HookCallback[]>()

  const hook = <T extends keyof NuxtHooks>(name: T, callback: NuxtHooks[T]) => {
    if (!hooks.has(name)) {
      hooks.set(name, [])
    }
    hooks.get(name)!.push(callback as HookCallback)
  }

  const callHook = async <T extends keyof NuxtHooks>(name: T, ...args: Parameters<NuxtHooks[T]>) => {
    const callbacks = hooks.get(name) || []
    for (const callback of callbacks) {
      await callback(...args)
    }
  }

  const nuxt: Nuxt = {
    options,
    hooks,
    hook,
    callHook,
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

  return nuxt
}
