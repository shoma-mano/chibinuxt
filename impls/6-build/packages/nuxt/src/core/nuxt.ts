import { join, resolve } from 'node:path'
import { createDevServer, createNitro } from 'nitro'
import { bundle } from 'nuxt/vite'
import { distDir } from '../dir'

export const loadNuxt = async () => {
  const appDistDir = join(distDir, 'app')
  process.env.APP_DIST_DIR = appDistDir
  await bundle()
  const nitro = await createNitro({
    renderer: resolve(distDir, 'core/runtime/nitro/renderer.js'),
  })
  const server = await createDevServer(nitro)
  return { server }
}
