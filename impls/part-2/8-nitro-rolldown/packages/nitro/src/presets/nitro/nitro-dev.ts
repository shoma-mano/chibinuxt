import { join } from 'node:path'
import { defineNitroPreset } from 'nitro/kit'

export const nitroDev = defineNitroPreset({
  entry: join(import.meta.dirname, './runtime/nitro-dev.mjs'),
  output: {
    serverDir: join(import.meta.dirname, './runtime'),
  },
  name: 'nitro-dev',
})
