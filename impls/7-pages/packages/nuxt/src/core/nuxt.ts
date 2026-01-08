import { join, resolve } from 'node:path'
import { createDevServer, createNitro } from 'nitro'
import { bundle } from '@nuxt/vite-builder'
import { scanPages, generateRoutesCode } from '../pages/scan'

export const buildDir = resolve(process.cwd(), '.nuxt')
export const loadNuxt = async () => {
  const appComponent = resolve(process.cwd(), 'App.vue')
  const pagesDir = resolve(process.cwd(), 'pages')

  // Scan pages and generate routes code
  const pages = await scanPages(pagesDir)
  const routesCode = generateRoutesCode(pages)

  await bundle({
    clientEntry: join(import.meta.dirname, '../app/entry.client.ts'),
    serverEntry: join(import.meta.dirname, '../app/entry.server.ts'),
    buildDir,
    appComponent,
    routesCode,
  })
  const nitro = await createNitro({
    renderer: resolve(import.meta.dirname, './runtime/nitro/renderer.ts'),
  })
  const server = await createDevServer(nitro)
  return { server }
}
