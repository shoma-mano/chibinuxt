import { join } from 'node:path'
import { build, mergeConfig, type UserConfig } from 'vite'
import type { ViteBuildContext } from './build'

export async function buildServer(ctx: ViteBuildContext) {
  const severConfig = mergeConfig(ctx.config, {
    build: {
      rollupOptions: {
        input: join(import.meta.dirname, '../app/entry.server.js'),
        output: {
          entryFileNames: '_entry.server.js',
        },
      },
      ssr: true,
    },
    define: {
      'import.meta.server': true,
    },
  } satisfies UserConfig)
  await build(severConfig)
}
