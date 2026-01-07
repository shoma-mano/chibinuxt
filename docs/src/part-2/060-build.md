# 2-2 Build

In this section, we'll introduce a build step for the nuxt package using `unbuild`.
The full code is available at [6-build](https://github.com/shoma-mano/chibinuxt/tree/main/impls/part-2/6-build).

## Why do we need a build step?

In the previous section, we ran `npx nuxi` directly with TypeScript files using `bun` as a shebang. While this works for development, it has several problems:

1. **Performance**: Running TypeScript directly with bun adds overhead for transpilation on every execution.
2. **Dependency resolution**: When the nuxt package is installed as a dependency, the internal structure and paths need to be properly resolved.
3. **Production readiness**: Published npm packages should ship pre-built JavaScript files, not raw TypeScript.

In actual Nuxt, the framework is pre-built before being published, and users run the compiled JavaScript. We'll mirror this approach using `unbuild`.

## Implementing the build step

### build.config.ts

##### package: `nuxt`

Create [`build.config.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/part-2/6-build/packages/nuxt/build.config.ts) to configure unbuild:

```ts
import { defineBuildConfig, type BuildEntry } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  entries: [
    // Core
    { input: 'src/index' },
    // App
    { input: 'src/app/', outDir: 'dist/app/', ext: 'js' },
    // Runtime dirs
    ...['core', 'pages'].map(
      name =>
        ({
          input: `src/${name}/runtime/`,
          outDir: `dist/${name}/runtime`,
          format: 'esm',
          ext: 'js',
        }) as BuildEntry,
    ),
    { input: 'src/vite/index.ts' },
    { input: 'src/bin.ts' },
  ],
  externals: ['nuxt/vite'],
  alias: {
    ['nuxt']: 'nuxt',
  },
})
```

Key points:
- `declaration: true` generates TypeScript declaration files (`.d.ts`)
- Multiple entries are defined for different parts of the package
- `src/app/` is built with `.js` extension to be used at runtime
- Runtime directories are built separately to preserve their structure
- `nuxt/vite` is marked as external to prevent bundling issues

### Update package.json exports

##### package: `nuxt`

Update [`package.json`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/part-2/6-build/packages/nuxt/package.json) to expose the vite module through exports:

```json
{
  "bin": {
    "nuxi": "dist/bin.mjs"
  },
  "exports": {
    "./vite": {
      "import": "./dist/vite/index.mjs"
    }
  },
  "scripts": {
    "prepack": "unbuild"
  },
  "devDependencies": {
    "unbuild": "^3.2.0"
  }
}
```

Key changes:
- The bin now points to `dist/bin.mjs` (built JavaScript) instead of the TypeScript source
- Added exports field to expose `nuxt/vite` subpath
- Added `prepack` script to run unbuild before publishing

### Create dir.ts helper

##### package: `nuxt`

Create [`dir.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/part-2/6-build/packages/nuxt/src/dir.ts) to correctly resolve the dist directory after build:

```ts
import { dirname, join } from 'node:path'

let _distDir = join(import.meta.dirname)
if (_distDir.match(/(chunks|shared)$/)) {
  _distDir = dirname(_distDir)
}
export const distDir = _distDir
```

When unbuild bundles the code, some files may end up in `chunks` or `shared` subdirectories. This helper ensures we always get the correct base dist directory.

### Update bin.ts shebang

##### package: `nuxt`

Change the shebang from bun to node in [`bin.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/part-2/6-build/packages/nuxt/src/bin.ts):

Before (5-packages):
```ts
#!/usr/bin/env bun
```

After (6-build):
```ts
#!/usr/bin/env node
```

Since the code is now pre-built to JavaScript, we can use Node.js directly without bun.

### Update build.ts paths

##### package: `nuxt`

Update the bundle function in [`build.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/part-2/6-build/packages/nuxt/src/vite/build.ts) to use the new distDir and built file paths:

```ts
import { join } from 'node:path'
import { build as _build, mergeConfig, type InlineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { distDir } from '../dir'

export const bundle = async () => {
  try {
    const defaultConfig = {
      plugins: [vue()],
      build: {
        rollupOptions: {
          output: {
            format: 'esm',
            dir: join(distDir, 'app'),
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

    const severConfig = mergeConfig(defaultConfig, {
      build: {
        rollupOptions: {
          input: join(import.meta.dirname, '../app/entry.server.js'),
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
  } catch (error) {
    console.error('Build failed:', error)
    process.exit(1)
  }
}
```

Key changes:
- Import `distDir` from the new helper
- Output directory is now `join(distDir, 'app')` instead of using environment variable
- Input paths changed from `.ts` to `.js` since we're now using pre-built files

### Update nuxt.ts imports

##### package: `nuxt`

Update the imports in [`nuxt.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/part-2/6-build/packages/nuxt/src/core/nuxt.ts) to use the package exports:

```ts
import { join } from 'node:path'
import { createDevServer } from 'nitro'
import { bundle } from 'nuxt/vite'
import { distDir } from '../dir'
import { setupRenderer } from './runtime/nitro/renderer'

export const loadNuxt = async () => {
  // this is temporary way
  process.env.APP_DIST_DIR = join(distDir, 'app')
  await bundle()
  setupRenderer()
  const server = createDevServer()
  return { server }
}
```

Key changes:
- Import `bundle` from `nuxt/vite` instead of relative path
- Use `distDir` for APP_DIST_DIR

### Create vite/index.ts

##### package: `nuxt`

Create an index file [`vite/index.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/part-2/6-build/packages/nuxt/src/vite/index.ts) to re-export the bundle function:

```ts
export { bundle } from './build'
```

This file serves as the entry point for the `nuxt/vite` export.

## Run the build

First, build the nuxt package:

```sh
cd packages/nuxt
pnpm run prepack
```

Then run the server from playground:

```sh
cd playground
npx nuxi
```

## Summary

By introducing a build step:

1. **Cleaner architecture**: The package structure mirrors how published npm packages work
2. **Subpath exports**: We can expose specific modules like `nuxt/vite` through package.json exports
3. **Better performance**: Pre-built JavaScript runs faster than transpiling TypeScript at runtime
4. **Production ready**: The package is now structured similarly to real Nuxt

This build system will become more important as we add more features, as it allows us to properly separate compile-time and runtime code.
