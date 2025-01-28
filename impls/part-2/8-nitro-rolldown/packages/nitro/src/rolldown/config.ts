import { defineConfig } from 'rolldown'
import type { Nitro } from '../types/nitro'

export const getRolldownConfig = (nitro: Nitro) => {
  return defineConfig({
    // join(import.meta.dirname, '../server.ts')
    input: nitro.options.entry,
    external: [
      'node:http',
      'node:fs',
      'vue-bundle-renderer/runtime',
      'vue/server-renderer',
    ],
    define: {
      __VUE_OPTIONS_API__: 'true',
    },
  })
}
