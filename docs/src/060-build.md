# 06 Build

In this section, we'll introduce a build step for the packages using `unbuild`.
The full code is available at [6-build](https://github.com/shoma-mano/chibinuxt/tree/main/impls/6-build).

## Why do we need a build step?

In actual Nuxt, the framework is pre-built using [unbuild](https://github.com/unjs/unbuild) before being published. We'll mirror this approach to make chibinuxt closer to the real Nuxt.

## Implementing the build step

### Nitro build.config.ts

##### package: `nitro`

Create [`build.config.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/6-build/packages/nitro/build.config.ts) to configure unbuild for nitro:

```ts
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  entries: [
    './src/index.ts',
    './src/runtime/index.ts',
    './src/types/index.ts',
  ],
  alias: {
    'nitro/runtime': './src/runtime/index.ts',
    'nitro/types': './src/types/index.ts',
    ['nitro']: 'nitro',
  },
})
```

Key points:

- Three separate entries for main, runtime, and types
- Aliases are defined to resolve `nitro/runtime` and `nitro/types` subpath imports during build

### Vite build.config.ts

##### package: `vite`

Create [`build.config.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/6-build/packages/vite/build.config.ts) to configure unbuild for vite:

```ts
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  entries: ['./src/index.ts'],
})
```

### Nuxt build.config.ts

##### package: `nuxt`

Create [`build.config.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/6-build/packages/nuxt/build.config.ts) to configure unbuild:

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
    { input: 'src/bin.ts' },
  ],
})
```

Key points:

- `declaration: true` generates TypeScript declaration files (`.d.ts`)
- Multiple entries are defined for different parts of the package
- `src/app/` is built with `.js` extension to be used at runtime
- Runtime directories are built separately to preserve their structure

### Update package.json

##### package: `nuxt`

Update [`package.json`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/6-build/packages/nuxt/package.json):

```json
{
  "bin": {
    "nuxi": "dist/bin.mjs"
  },
  "scripts": {
    "prepack": "unbuild"
  },
  "dependencies": {
    "@nuxt/vite-builder": "workspace:*",
    "nitro": "workspace:*"
  },
  "devDependencies": {
    "unbuild": "^3.2.0"
  }
}
```

Key changes:

- The bin now points to `dist/bin.mjs` (built JavaScript) instead of the TypeScript source
- Added `prepack` script to run unbuild before publishing
- Uses `@nuxt/vite-builder` from workspace

### Create dir.ts helper

##### package: `nuxt`

Create [`dir.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/6-build/packages/nuxt/src/dir.ts) to correctly resolve the dist directory after build:

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

Change the shebang from bun to node in [`bin.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/6-build/packages/nuxt/src/bin.ts):

Before (5-packages):
```ts
#!/usr/bin/env bun
```

After (6-build):
```ts
#!/usr/bin/env node
```

Since the code is now pre-built to JavaScript, we can use Node.js directly without bun.

### Update nuxt.ts

##### package: `nuxt`

Update [`nuxt.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/6-build/packages/nuxt/src/core/nuxt.ts) to use distDir and built file paths:

```ts
import { join, resolve } from 'node:path'
import { createDevServer, createNitro } from 'nitro'
import { bundle } from '@nuxt/vite-builder'
import { distDir } from '../dir'

export const loadNuxt = async () => {
  const appDistDir = join(distDir, 'app')
  process.env.APP_DIST_DIR = appDistDir
  await bundle({
    appDistDir,
    clientEntry: join(distDir, 'app/entry.client.js'),
    serverEntry: join(distDir, 'app/entry.server.js'),
  })
  const nitro = await createNitro({
    renderer: resolve(distDir, 'core/runtime/nitro/renderer.js'),
  })
  const server = await createDevServer(nitro)
  return { server }
}
```

Key changes:

- Import `distDir` from the new helper
- Import `bundle` from `@nuxt/vite-builder` (separate package)
- Output directory is now `join(distDir, 'app')`
- Input paths changed from `.ts` to `.js` since we're now using pre-built files
- Renderer path points to built `.js` file

### Update renderer.ts

##### package: `nuxt`

Update [`renderer.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/6-build/packages/nuxt/src/core/runtime/nitro/renderer.ts) to use environment variable for dist path:

```ts
import { join } from 'node:path'
import { readFileSync } from 'node:fs'
import { defineRenderHandler } from 'nitro/runtime'
import { createRenderer } from 'vue-bundle-renderer/runtime'
import { renderToString } from 'vue/server-renderer'

let renderer: ReturnType<typeof createRenderer>
const getRenderer = async () => {
  if (renderer) return renderer
  const createApp = await import(
    join(process.env.APP_DIST_DIR!, 'entry.server.js')
  ).then(m => m.default)
  renderer = createRenderer(createApp, {
    renderToString,
    manifest: {},
  })
  return renderer
}

export default defineRenderHandler(async event => {
  const { req, res } = event.node
  if (req.url === '/entry.client.js') {
    const code = readFileSync(
      join(process.env.APP_DIST_DIR!, 'entry.client.js'),
      'utf-8',
    )
    res.setHeader('Content-Type', 'application/javascript')
    res.end(code)
    return { statusCode: 200, statusMessage: 'OK', headers: {} }
  }
  const renderer = await getRenderer()
  const rendered = await renderer.renderToString({ url: req.url })
  const body = renderHTML(rendered)
  res.setHeader('Content-Type', 'text/html;charset=UTF-8')
  return {
    body,
  }
})

// ... renderHTML and htmlTemplate functions remain the same
```

Key change:

- Uses `process.env.APP_DIST_DIR` instead of importing `appDistDir` directly (since it's set by nuxt.ts at runtime)

## Run the build

First, build all packages:

```sh
cd packages/nitro && pnpm unbuild
cd packages/vite && pnpm unbuild
cd packages/nuxt && pnpm unbuild
```

Then run the server from playground:

```sh
cd playground
npx nuxi
```

## Summary

By introducing a build step:

1. **Cleaner architecture**: The package structure mirrors how published npm packages work
2. **Separate vite package**: The `@nuxt/vite-builder` is now a separate workspace package
3. **Better performance**: Pre-built JavaScript runs faster than transpiling TypeScript at runtime
4. **Production ready**: The packages are now structured similarly to real Nuxt and Nitro
5. **Proper subpath exports**: Nitro exposes `nitro/runtime` and `nitro/types` through package.json exports

This build system will become more important as we add more features, as it allows us to properly separate compile-time and runtime code.
