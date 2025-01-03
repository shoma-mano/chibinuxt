import { join } from 'node:path'
import { getServer } from 'nitro'
import { build } from './vite'

export const main = async () => {
  await build()
  process.env.DIST_DIR = join(import.meta.dirname, 'dist')
  const server = getServer()
  server.listen(3030, () => {
    console.log('Server listening on http://localhost:3030')
  })
}
