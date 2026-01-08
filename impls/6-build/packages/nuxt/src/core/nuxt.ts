import { join, resolve } from 'node:path'
import { createDevServer, createNitro } from 'nitro'
import { bundle } from '@nuxt/vite-builder'
import { distDir } from '../dir'

export const buildDir = resolve(process.cwd(), '.nuxt')
export const loadNuxt = async () => {
  await bundle({
    buildDir,
    clientEntry: join(distDir, 'app/entry.client.js'),
    serverEntry: join(distDir, 'app/entry.server.js'),
  })
  const nitro = await createNitro({
    renderer: resolve(distDir, 'core/runtime/nitro/renderer.js'),
  })
  const server = await createDevServer(nitro)
  return { server }
}
