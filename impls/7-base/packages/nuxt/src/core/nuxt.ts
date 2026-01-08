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
  // this is temporary workaround for telling renderer where to find the distDir
  process.env.APP_DIST_DIR = options.appDir
  const nuxt = createNuxt(options)
  await initNitro(nuxt)
  await bundle(nuxt)
  return nuxt
}
