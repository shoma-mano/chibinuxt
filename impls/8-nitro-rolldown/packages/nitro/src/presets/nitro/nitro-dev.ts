import { join } from 'node:path'
import { defineNitroPreset } from 'nitro/kit'

export const nitroDev = defineNitroPreset({
  entry: join(import.meta.dirname, './runtime/nitro-dev.mjs'),
  output: {
    serverDir: join('.nitro', 'dev'),
  },
  name: 'nitro-dev',
})
