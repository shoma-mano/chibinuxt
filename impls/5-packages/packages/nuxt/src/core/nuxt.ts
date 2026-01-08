import { join, resolve } from 'node:path'
import { createDevServer, createNitro } from 'nitro'
import { bundle } from '@nuxt/vite-builder'

export const appDistDir = join(import.meta.dirname, '../../dist/app')
export const loadNuxt = async () => {
  // this is temporary way
  await bundle({
    appDistDir,
    clientEntry: join(import.meta.dirname, '../app/entry.client.ts'),
    serverEntry: join(import.meta.dirname, '../app/entry.server.ts'),
  })
  const nitro = await createNitro({
    renderer: resolve(import.meta.dirname, './runtime/nitro/renderer.ts'),
  })
  const server = await createDevServer(nitro)
  return { server }
}
