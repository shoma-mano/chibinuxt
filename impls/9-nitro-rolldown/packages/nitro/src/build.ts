import { join } from 'node:path'
import { rolldown } from 'rolldown'
import type { Nitro } from 'nitro/types'
import { getRolldownConfig } from './rolldown/config'

export const build = async (nitro: Nitro) => {
  const rolldownConfig = getRolldownConfig(nitro)
  const bundle = await rolldown(rolldownConfig)
  await bundle.write({
    file: join(nitro.options.output!.serverDir!, 'index.js'),
  })
  console.log('Nitro build completed')
}
