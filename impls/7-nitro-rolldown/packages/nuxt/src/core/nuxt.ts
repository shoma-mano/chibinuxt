import { join } from 'node:path'
import { build } from 'nitro'
import { bundle } from '../vite/build'
import { distDir } from '../dir'
import { initNitro } from './nitro'

type NuxtOptions = {
  appDir?: string
}

export type Nuxt = {
  server?: any
  options?: NuxtOptions
  ready?: () => Promise<void>
}

const loadNuxtConfig = (): NuxtOptions => {
  // implement later
  return {}
}

const createNuxt = (options: NuxtOptions): Nuxt => {
  const nuxt: Nuxt = {
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
  return nuxt
}
