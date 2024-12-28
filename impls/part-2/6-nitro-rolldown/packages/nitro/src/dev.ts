import { execSync } from 'node:child_process'
import { join } from 'node:path'

export const createDevServer = () => {
  const listen = () => {
    execSync(`node ${join(import.meta.dirname, 'dist/index.js')}`, { stdio: 'inherit' })
  }
  return { listen }
}
