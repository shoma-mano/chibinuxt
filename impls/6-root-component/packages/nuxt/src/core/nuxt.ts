import { join, resolve } from 'node:path'
import { createDevServer, createNitro } from 'nitro'
import { bundle } from '@nuxt/vite-builder'

export const buildDir = resolve(process.cwd(), '.nuxt')
export const loadNuxt = async () => {
  const appComponent = resolve(process.cwd(), 'App.vue')
  await bundle({
    buildDir,
    clientEntry: join(import.meta.dirname, '../app/entry.client.ts'),
    serverEntry: join(import.meta.dirname, '../app/entry.server.ts'),
    appComponent,
  })
  const nitro = await createNitro({
    renderer: resolve(import.meta.dirname, './runtime/nitro/renderer.ts'),
  })
  const server = await createDevServer(nitro)
  return { server }
}
