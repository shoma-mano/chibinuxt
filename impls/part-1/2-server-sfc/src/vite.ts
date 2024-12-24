import { join } from 'node:path'
import { build as _build } from 'vite'
import vue from '@vitejs/plugin-vue'

export const build = async () => {
  try {
    await _build({
      plugins: [vue()],
      build: {
        rollupOptions: {
          input: join(import.meta.dirname, 'entry.server.ts'),
          output: {
            format: 'esm',
            dir: join(import.meta.dirname, 'dist'),
            entryFileNames: 'entry.server.js',
          },
          preserveEntrySignatures: 'exports-only',
          treeshake: false,
        },
      },
    })
    console.log('Build completed successfully!')
  }
  catch (error) {
    console.error('Build failed:', error)
    process.exit(1)
  }
}
