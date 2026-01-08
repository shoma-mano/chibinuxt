import { build as _build, mergeConfig, type InlineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export interface BuildOptions {
  appDistDir: string
  clientEntry: string
  serverEntry: string
}

export const bundle = async (options: BuildOptions) => {
  const { appDistDir, clientEntry, serverEntry } = options

  const defaultConfig = {
    plugins: [vue()],
    build: {
      rollupOptions: {
        output: {
          format: 'esm',
          dir: appDistDir,
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
        input: clientEntry,
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

  const serverConfig = mergeConfig(defaultConfig, {
    build: {
      rollupOptions: {
        input: serverEntry,
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
  await _build(serverConfig)

  console.log('Build completed successfully!')
}
