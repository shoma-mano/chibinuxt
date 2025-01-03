import { join } from 'node:path'
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
  initNitro(nuxt)
  await bundle(nuxt)
  // this is temporary workaround
  process.env.APP_DIST_DIR = options.appDir
  return nuxt
}
