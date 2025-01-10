import { execSync } from 'node:child_process'
import { join } from 'node:path'

import type { Nitro } from '../../types/nitro'

export const createDevServer = (nitro: Nitro) => {
  const listen = () => {
    execSync(`node ${join(import.meta.dirname, 'dist/index.js')}`, {
      stdio: 'inherit',
    })
  }
  return { listen }
}
