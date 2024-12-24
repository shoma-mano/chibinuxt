import { join } from 'node:path'
import { readFileSync, writeFileSync } from 'node:fs'
import { build as _build, mergeConfig, type InlineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export const build = async () => {
  try {
    const distDir = join(import.meta.dirname, 'dist')

    const defaultConfig = {
      plugins: [vue()],
      build: {
        rollupOptions: {
          output: {
            format: 'esm',
          },
          preserveEntrySignatures: 'exports-only',
          treeshake: false,
        },
        emptyOutDir: false,
        outDir: distDir,
      },
      define: {
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true',
      },
    } satisfies InlineConfig

    const clientConfig = mergeConfig(defaultConfig, {
      build: {
        rollupOptions: {
          input: join(import.meta.dirname, 'entry.client.ts'),
          output: {
            entryFileNames: 'entry.client.js',
          },
        },
        manifest: 'manifest.json',
      },
      appType: 'custom',
      define: {
        'import.meta.server': false,
      },

    } satisfies InlineConfig)
    await _build(clientConfig)
    const clientManifest = readFileSync(join(distDir, 'manifest.json'), 'utf-8')
    writeFileSync(join(distDir, 'manifest.mjs'), `export default ${clientManifest}`)

    const severConfig = mergeConfig(defaultConfig, {
      build: {
        rollupOptions: {
          input: join(import.meta.dirname, 'entry.server.ts'),
          output: {
            entryFileNames: 'entry.server.js',
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
  }
  catch (error) {
    console.error('Build failed:', error)
    process.exit(1)
  }
}
