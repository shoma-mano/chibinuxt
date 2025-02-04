import { join } from 'node:path'
import { mergeConfig, type UserConfig, build } from 'vite'
import type { ViteBuildContext } from './build'

export async function buildClient(ctx: ViteBuildContext) {
  const clientConfig = mergeConfig(ctx.config, {
    build: {
      rollupOptions: {
        input: join(import.meta.dirname, '../app/entry.client.js'),
        output: {
          entryFileNames: '_entry.client.js',
        },
      },
    },
    appType: 'custom',
    define: {
      'import.meta.server': false,
    },
  } satisfies UserConfig)
  await build(clientConfig)
}
