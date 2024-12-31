import { join } from 'node:path'
import { createDevServer } from 'nitro'
import { build } from '../vite/build'
import { distDir } from '../dir'

export const loadNuxt = async () => {
  await build()
  process.env.APP_DIST_DIR = join(distDir, 'app')
  const server = createDevServer()
  return { server }
}
