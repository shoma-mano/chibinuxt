import { join } from 'node:path'
import { defineConfig } from 'rolldown'

export const getRolldownConfig = () => {
  return defineConfig({
    input: join(import.meta.dirname, '../server.ts'),
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
