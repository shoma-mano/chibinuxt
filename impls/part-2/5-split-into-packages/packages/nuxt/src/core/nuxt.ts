import { join } from 'node:path'
import { createDevServer } from 'nitro'
import { build } from '../vite/build'

export const loadNuxt = async () => {
  await build()
  process.env.DIST_DIR = join(import.meta.dirname, '../dist')
  const server = createDevServer()
  return { server }
}
