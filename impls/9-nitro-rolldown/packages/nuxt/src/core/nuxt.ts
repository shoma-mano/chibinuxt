import { dirname, join, resolve } from 'node:path'
import { build, createDevServer, createNitro } from 'nitro'
import { bundle } from '@nuxt/vite-builder'
import { scanPages, generateRoutesCode } from '../pages/scan'

// Get the dist directory (handles chunks subdirectory from unbuild)
let distDir = import.meta.dirname
if (distDir.match(/(chunks|shared)$/)) {
  distDir = dirname(distDir)
}

export const buildDir = resolve(process.cwd(), '.nuxt')
export const loadNuxt = async () => {
  const appComponent = resolve(process.cwd(), 'App.vue')
  const pagesDir = resolve(process.cwd(), 'pages')

  // Scan pages and generate routes code
  const pages = await scanPages(pagesDir)
  const routesCode = generateRoutesCode(pages)

  await bundle({
    clientEntry: join(distDir, 'app/entry.client.js'),
    serverEntry: join(distDir, 'app/entry.server.js'),
    buildDir,
    appComponent,
    routesCode,
  })

  const nitro = await createNitro({
    renderer: join(distDir, 'core/runtime/nitro/renderer.js'),
  })

  // Build nitro server with rolldown
  await build(nitro)

  const server = createDevServer(nitro)
  return { server }
}
