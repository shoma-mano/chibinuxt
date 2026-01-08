# 08 Build

In this section, we'll introduce a build step for the packages using `unbuild`.
The full code is available at [8-build](https://github.com/shoma-mano/chibinuxt/tree/main/impls/8-build).

## Why do we need a build step?

In actual Nuxt, the framework is pre-built using [unbuild](https://github.com/unjs/unbuild) before being published. We'll mirror this approach to make chibinuxt closer to the real Nuxt.

## Implementing the build step

### Nitro build.config.ts

##### package: `nitro`

Create [`build.config.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/8-build/packages/nitro/build.config.ts) to configure unbuild for nitro:

```ts
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  entries: [
    // Main entry
    { input: 'src/index.ts' },
    // Runtime
    { input: 'src/runtime/', outDir: 'dist/runtime', format: 'esm' },
    // Types
    { input: 'src/types/', outDir: 'dist/types', format: 'esm' },
  ],
  alias: {
    'nitro/runtime': './src/runtime/index.ts',
    ['nitro']: 'nitro',
  },
  externals: ['nitro/runtime', 'nitro/types'],
})
```

Key points:

- Three separate entries for main, runtime, and types directories
- Aliases are defined to resolve `nitro/runtime` subpath imports during build
- `externals` prevents bundling of self-referencing imports

### Vite build.config.ts

##### package: `vite`

Create [`build.config.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/8-build/packages/vite/build.config.ts) to configure unbuild for vite:

```ts
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  entries: ['./src/index.ts'],
})
```

### Nuxt build.config.ts

##### package: `nuxt`

Create [`build.config.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/8-build/packages/nuxt/build.config.ts) to configure unbuild:

```ts
import { defineBuildConfig, type BuildEntry } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  entries: [
    // Core
    { input: 'src/index.ts' },
    // App
    { input: 'src/app/', outDir: 'dist/app/', ext: 'js' },
    // Runtime
    { input: 'src/core/runtime/', outDir: 'dist/core/runtime', format: 'esm', ext: 'js' },
    // Bin
    { input: 'src/bin.ts' },
  ],
  alias: {
    ['nuxt']: 'nuxt',
  },
})
```

Key points:

- `declaration: true` generates TypeScript declaration files (`.d.ts`)
- Multiple entries are defined for different parts of the package
- `src/app/` is built with `.js` extension to be used at runtime
- Runtime directory is built separately to preserve its structure

### Update package.json

##### package: `nuxt`

Update [`package.json`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/8-build/packages/nuxt/package.json):

```json
{
  "bin": {
    "nuxi": "dist/bin.mjs"
  },
  "exports": {
    ".": {
      "import": "./dist/index.mjs"
    }
  },
  "scripts": {
    "prepack": "unbuild"
  },
  "devDependencies": {
    "unbuild": "3.3.1"
  }
}
```

Key changes:

- The bin now points to `dist/bin.mjs` (built JavaScript) instead of the TypeScript source
- Added `exports` field for proper module resolution
- Added `prepack` script to run unbuild before publishing

### Update nuxt.ts

##### package: `nuxt`

Update [`nuxt.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/8-build/packages/nuxt/src/core/nuxt.ts) to use distDir and built file paths:

```ts
import { dirname, join, resolve } from 'node:path'
import { createDevServer, createNitro } from 'nitro'
import { bundle } from '@nuxt/vite-builder'
import { scanPages, generateRoutesCode } from '../pages/scan'

// Get the dist directory (handles chunks subdirectory from unbuild)
let distDir = import.meta.dirname
if (distDir.match(/(chunks|shared)$/)) {
  distDir = dirname(distDir)
}

export const buildDir = resolve(process.cwd(), '.nuxt')
export const loadNuxt = async () => {
  const appComponent = resolve(process.cwd(), 'App.vue')
  const pagesDir = resolve(process.cwd(), 'pages')

  // Scan pages and generate routes code
  const pages = await scanPages(pagesDir)
  const routesCode = generateRoutesCode(pages)

  await bundle({
    clientEntry: join(distDir, 'app/entry.client.js'),
    serverEntry: join(distDir, 'app/entry.server.js'),
    buildDir,
    appComponent,
    routesCode,
  })
  const nitro = await createNitro({
    renderer: join(distDir, 'core/runtime/nitro/renderer.js'),
  })
  const server = await createDevServer(nitro)
  return { server }
}
```

Key changes:

- `distDir` is computed inline (handles `chunks` or `shared` subdirectories from unbuild)
- Input paths changed from `.ts` to `.js` since we're now using pre-built files
- Renderer path points to built `.js` file
- Includes page scanning and route generation from 7-pages

### Update renderer.ts

##### package: `nuxt`

Update [`renderer.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/8-build/packages/nuxt/src/core/runtime/nitro/renderer.ts) to resolve buildDir directly:

```ts
import { join, resolve } from 'node:path'
import { readFileSync } from 'node:fs'
import { defineRenderHandler } from 'nitro/runtime'
import { createRenderer } from 'vue-bundle-renderer/runtime'
import { renderToString } from 'vue/server-renderer'

const buildDir = resolve(process.cwd(), '.nuxt')

let renderer: ReturnType<typeof createRenderer>
const getRenderer = async () => {
  if (renderer) return renderer
  const createApp = await import(
    join(buildDir, 'entry.server.js')
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
      join(buildDir, 'entry.client.js'),
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

- `buildDir` is resolved directly using `process.cwd()` since the renderer runs in the user's project context
- No need for environment variables or importing from other modules

### Create index.ts

##### package: `nuxt`

Create [`index.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/8-build/packages/nuxt/src/index.ts) to export public API:

```ts
export { loadNuxt, buildDir } from './core/nuxt'
```

## Run the build

Run the following command in the root of 8-build:

```sh
pnpm start
```

This command will:

1. Build all packages (`pnpm build` runs `pnpm --filter './packages/**' prepack`)
2. Start the dev server (`pnpm dev` runs `cd ./playground && pnpm dev`)

## Summary

By introducing a build step:

1. **Cleaner architecture**: The package structure mirrors how published npm packages work
2. **Better performance**: Pre-built JavaScript runs faster than transpiling TypeScript at runtime
3. **Production ready**: The packages are now structured similarly to real Nuxt and Nitro
4. **Proper exports**: Packages expose proper entry points through package.json exports
5. **Includes all features**: Virtual modules for App.vue and automatic page routing from previous sections

This build system will become more important as we add more features, as it allows us to properly separate compile-time and runtime code.
