import { build as _build, mergeConfig, type InlineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export interface BuildOptions {
  buildDir: string
  clientEntry: string
  serverEntry: string
}

export const bundle = async (options: BuildOptions) => {
  const { buildDir, clientEntry, serverEntry } = options

  const defaultConfig = {
    plugins: [vue()],
    build: {
      outDir: buildDir,
      emptyOutDir: false,
      rollupOptions: {
        output: {
          format: 'esm',
        },
        preserveEntrySignatures: 'exports-only',
        treeshake: false,
      },
    },
    define: {
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true',
    },
  } satisfies InlineConfig

  const clientConfig = mergeConfig(defaultConfig, {
    build: {
      rollupOptions: {
        input: clientEntry,
        output: {
          entryFileNames: 'entry.client.js',
        },
      },
    },
    appType: 'custom',
    define: {
      'import.meta.server': false,
    },
  } satisfies InlineConfig)
  await _build(clientConfig)

  const serverConfig = mergeConfig(defaultConfig, {
    build: {
      rollupOptions: {
        input: serverEntry,
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
  await _build(serverConfig)
}
