import { join } from 'node:path'
import { build as _build, mergeConfig, type InlineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import type { Nuxt } from '../core/nuxt'

export const bundle = async (nuxt: Nuxt) => {
  try {
    const defaultConfig = {
      plugins: [vue()],
      build: {
        rollupOptions: {
          output: {
            format: 'esm',
            dir: nuxt.options?.appDir,
          },
          preserveEntrySignatures: 'exports-only',
          treeshake: false,
        },
        emptyOutDir: false,
      },
      define: {
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true',
      },
    } satisfies InlineConfig

    const clientConfig = mergeConfig(defaultConfig, {
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
    } satisfies InlineConfig)
    await _build(clientConfig)

    const severConfig = mergeConfig(defaultConfig, {
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
    } satisfies InlineConfig)
    await _build(severConfig)

    console.log('Build completed successfully!')
  } catch (error) {
    console.error('Build failed:', error)
    process.exit(1)
  }
}
