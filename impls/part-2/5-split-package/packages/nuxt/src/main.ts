import { join } from 'node:path'
import { createDevServer } from 'nitro'
import { build } from './vite'

export const main = async () => {
  await build()
  process.env.DIST_DIR = join(import.meta.dirname, 'dist')
  const server = createDevServer()
  server.listen()
}
