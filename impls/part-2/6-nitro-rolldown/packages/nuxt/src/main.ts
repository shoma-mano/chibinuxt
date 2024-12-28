import { join } from 'node:path'
import { buildNitro, createDevServer } from 'nitro'
import { buildEntries } from './vite'

export const main = async () => {
  await buildEntries()
  await buildNitro()
  process.env.DIST_DIR = join(import.meta.dirname, 'dist')
  const server = createDevServer()
  server.listen()
}
