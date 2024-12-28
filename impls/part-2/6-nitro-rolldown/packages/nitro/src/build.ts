import { join } from 'node:path'
import { rolldown } from 'rolldown'
import { getRolldownConfig } from './rolldown/config'

export const buildNitro = async () => {
  const rolldownConfig = getRolldownConfig()
  const bundle = await rolldown(rolldownConfig)
  await bundle.write({
    file: join(import.meta.dirname, 'dist/index.js'),
  })
}
