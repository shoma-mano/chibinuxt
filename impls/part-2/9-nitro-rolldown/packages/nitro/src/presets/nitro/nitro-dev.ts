import { join } from 'node:path'
import { defineNitroPreset } from '../../kit/preset'

export const nitroDev = defineNitroPreset({
  entry: join(import.meta.dirname, 'runtime/nitro-dev.ts'),
  output: {
    serverDir: join(import.meta.dirname, '../../../dist'),
  },
  name: 'nitro-dev',
})
