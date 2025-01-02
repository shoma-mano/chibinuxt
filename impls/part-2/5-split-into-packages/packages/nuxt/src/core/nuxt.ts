import { join } from 'node:path'
import { createDevServer } from 'nitro'
import { build } from '../vite/build'
import { distDir } from '../dir'
import { setupRenderer } from './runtime/nitro/renderer'

export const loadNuxt = async () => {
  await build()
  // this is temporary way
  process.env.APP_DIST_DIR = join(distDir, 'app')
  setupRenderer()
  const server = createDevServer()
  return { server }
}
