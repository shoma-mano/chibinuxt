import type { UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import type { Nuxt } from '../core/nuxt'
import { buildClient } from './client'
import { buildServer } from './server'

export interface ViteBuildContext {
  nuxt: Nuxt
  config: UserConfig
}

export const bundle = async (nuxt: Nuxt) => {
  const ctx: ViteBuildContext = {
    nuxt,
    config: {
      plugins: [vue()],
      build: {
        rollupOptions: {
          output: {
            format: 'esm',
            dir: nuxt.options.appDir,
          },
          preserveEntrySignatures: 'exports-only',
          treeshake: false,
        },
        emptyOutDir: false,
      },
    },
  }
  await buildClient(ctx)
  await buildServer(ctx)
}
