import { join } from 'node:path'
import { createDevServer } from 'nitro'
import { bundle } from '../vite/build'
import { setupRenderer } from './runtime/nitro/renderer'

export const loadNuxt = async () => {
  // this is temporary way
  process.env.APP_DIST_DIR = join(import.meta.dirname, '../../../../playground/.nitro')
  await bundle()
  setupRenderer()
  const server = createDevServer()
  return { server }
}
