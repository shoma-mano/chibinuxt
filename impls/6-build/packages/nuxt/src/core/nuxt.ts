import { join } from 'node:path'
import { createDevServer } from 'nitro'
import { bundle } from 'nuxt/vite'
import { distDir } from '../dir'
import { setupRenderer } from './runtime/nitro/renderer'

export const loadNuxt = async () => {
  // this is temporary way
  process.env.APP_DIST_DIR = join(distDir, 'app')
  await bundle()
  setupRenderer()
  const server = createDevServer()
  return { server }
}
