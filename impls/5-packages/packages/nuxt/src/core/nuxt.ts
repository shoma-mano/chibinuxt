import { join } from 'node:path'
import { createDevServer } from 'nitro'
import { bundle } from '@nuxt/vite-builder'
import { setupRenderer } from './runtime/nitro/renderer'

export const loadNuxt = async () => {
  // this is temporary way
  const appDistDir = join(import.meta.dirname, '../../dist/app')
  process.env.APP_DIST_DIR = appDistDir
  await bundle({
    appDistDir,
    clientEntry: join(import.meta.dirname, '../app/entry.client.ts'),
    serverEntry: join(import.meta.dirname, '../app/entry.server.ts'),
  })
  setupRenderer()
  const server = createDevServer()
  return { server }
}
