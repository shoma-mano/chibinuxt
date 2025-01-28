import { join } from 'node:path'
import { rolldown } from 'rolldown'
import { getRolldownConfig } from '../../rolldown/config'
import type { Nitro } from '../../types/nitro'

export const build = async (nitro: Nitro) => {
  const rolldownConfig = getRolldownConfig(nitro)
  const bundle = await rolldown(rolldownConfig)
  await bundle.write({
    file: join(nitro.options.output!.serverDir!, 'index.js'),
  })
}
