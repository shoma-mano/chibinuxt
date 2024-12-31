import { join } from 'node:path'
import { createDevServer } from 'nitro'
import { build } from '../vite/build'

type NuxtOptions = {
  appDir?: string
}

export type Nuxt = {
  server?: any
  options?: NuxtOptions
  ready?: () => Promise<void>
}

const loadNuxtConfig = (): NuxtOptions => {
  return {}
}

const initNuxt = async (nuxt: Nuxt) => {
  nuxt.options.appDir = join(import.meta.dirname, '../app')
}

const createNuxt = (options: NuxtOptions): Nuxt => {
  const nuxt: Nuxt = {
    options,
    ready: () => initNuxt(nuxt),
  }
  return nuxt
}

export const loadNuxt = async () => {
  const options = loadNuxtConfig()
  await build()
  process.env.DIST_DIR = join(import.meta.dirname, '../dist')
  const server = createDevServer()
  return { server }
}
