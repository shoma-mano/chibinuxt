import { join } from 'node:path'
import { build } from 'nitro'
import { bundle } from '@nuxt/vite-builder'
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
  const appDir = join(distDir, 'app')
  options.appDir = appDir
  const nuxt = createNuxt(options)
  const nitro = await initNitro(nuxt)
  await bundle({
    appDistDir: appDir,
    clientEntry: join(distDir, 'app/entry.client.js'),
    serverEntry: join(distDir, 'app/entry.server.js'),
  })
  await build(nitro)
  return nuxt
}
