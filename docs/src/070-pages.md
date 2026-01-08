# 07 Pages

In this section, we'll implement automatic route generation by scanning the `pages/` directory, removing hardcoded page imports from the router.
The full code is available at [7-pages](https://github.com/shoma-mano/chibinuxt/tree/main/impls/7-pages).

## The Problem

In the previous implementations, we hardcoded page imports in the router:

```ts
import Hello from '../../../../../playground/pages/hello.vue'
import World from '../../../../../playground/pages/world.vue'

const routes = [
  { path: '/hello', component: Hello },
  { path: '/world', component: World },
]
```

This is problematic because:
- Users can't add new pages without modifying framework code
- The paths are hardcoded to the playground location
- It doesn't follow Nuxt's file-based routing convention

## How Does Nuxt Framework Solve This?

The real Nuxt framework:

1. **Scans the pages directory**: Uses `resolvePagesRoutes()` to discover `.vue` files
2. **Generates route code**: Uses `normalizeRoutes()` and template generation
3. **Virtual modules**: Routes are served through `#build/routes` virtual module
4. **Router imports from virtual**: `import routes from '#build/routes'`

We'll implement a simplified version of this pattern.

## Page Scanner

### Create the scanner

Create a module to scan the pages directory and generate route definitions.

[`pages/scan.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/7-pages/packages/nuxt/src/pages/scan.ts)

```ts
import { readdir } from 'node:fs/promises'
import { join, parse } from 'node:path'

export interface NuxtPage {
  name: string
  path: string
  file: string
}

export async function scanPages(pagesDir: string): Promise<NuxtPage[]> {
  const files = await readdir(pagesDir)
  const pages: NuxtPage[] = []

  for (const file of files) {
    const { name, ext } = parse(file)
    if (ext !== '.vue') continue

    const routePath = name === 'index' ? '/' : `/${name}`
    pages.push({
      name,
      path: routePath,
      file: join(pagesDir, file),
    })
  }

  return pages
}

export function generateRoutesCode(pages: NuxtPage[]): string {
  const imports = pages
    .map((page, i) => `import Page${i} from '${page.file}'`)
    .join('\n')

  const routes = pages
    .map((page, i) => `  { name: '${page.name}', path: '${page.path}', component: Page${i} }`)
    .join(',\n')

  return `${imports}

export default [
${routes}
]`
}
```

Key points:
- `scanPages()` reads the pages directory and returns page metadata
- `index.vue` maps to `/`, other files map to `/{filename}`
- `generateRoutesCode()` creates JavaScript code that exports the routes array
- The generated code includes imports for each page component

### Example output

For a pages directory with `index.vue`, `hello.vue`, and `world.vue`:

```ts
import Page0 from '/path/to/pages/index.vue'
import Page1 from '/path/to/pages/hello.vue'
import Page2 from '/path/to/pages/world.vue'

export default [
  { name: 'index', path: '/', component: Page0 },
  { name: 'hello', path: '/hello', component: Page1 },
  { name: 'world', path: '/world', component: Page2 }
]
```

## Update Vite Builder

### Add routesCode to BuildOptions

Update the vite builder to accept generated routes code and register the `#routes` virtual module.

[`build.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/7-pages/packages/vite/src/build.ts)

```ts
import { build as _build, mergeConfig, type InlineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { virtual } from './plugins/virtual'

export interface BuildOptions {
  buildDir: string
  clientEntry: string
  serverEntry: string
  appComponent: string
  routesCode: string
}

export const bundle = async (options: BuildOptions) => {
  const { buildDir, clientEntry, serverEntry, appComponent, routesCode } = options

  // Virtual file system for #app and #routes modules
  const vfs: Record<string, string> = {
    '#app': `export { default } from '${appComponent}'`,
    '#routes': routesCode,
  }

  const defaultConfig = {
    plugins: [vue(), virtual(vfs)],
    // ... rest remains the same
  }
  // ...
}
```

Key changes:
- Added `routesCode` to `BuildOptions`
- Register `#routes` virtual module with the generated routes code

## Update Router

### Import from virtual module

Update the router to import routes from the `#routes` virtual module.

[`router.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/7-pages/packages/nuxt/src/app/plugins/router.ts)

```ts
import {
  createRouter as _createRouter,
  createMemoryHistory,
  createWebHistory,
} from 'vue-router'

import routes from '#routes'

export const createRouter = () => {
  const history = import.meta.server
    ? createMemoryHistory()
    : createWebHistory()
  const router = _createRouter({
    history,
    routes,
  })
  return router
}
```

Key changes:
- Removed hardcoded page imports
- Import `routes` from `#routes` virtual module
- The routes are now dynamically generated based on the pages directory

## Update loadNuxt

### Scan pages and generate routes

Update `loadNuxt` to scan pages and pass the generated code to the vite builder.

[`nuxt.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/7-pages/packages/nuxt/src/core/nuxt.ts)

```ts
import { join, resolve } from 'node:path'
import { createDevServer, createNitro } from 'nitro'
import { bundle } from '@nuxt/vite-builder'
import { scanPages, generateRoutesCode } from '../pages/scan'

export const buildDir = resolve(process.cwd(), '.nuxt')
export const loadNuxt = async () => {
  const appComponent = resolve(process.cwd(), 'App.vue')
  const pagesDir = resolve(process.cwd(), 'pages')

  // Scan pages and generate routes code
  const pages = await scanPages(pagesDir)
  const routesCode = generateRoutesCode(pages)

  await bundle({
    clientEntry: join(import.meta.dirname, '../app/entry.client.ts'),
    serverEntry: join(import.meta.dirname, '../app/entry.server.ts'),
    buildDir,
    appComponent,
    routesCode,
  })
  const nitro = await createNitro({
    renderer: resolve(import.meta.dirname, './runtime/nitro/renderer.ts'),
  })
  const server = await createDevServer(nitro)
  return { server }
}
```

Key changes:
- Import `scanPages` and `generateRoutesCode` from the pages module
- Resolve `pagesDir` from the current working directory
- Scan pages and generate routes code before bundling
- Pass `routesCode` to the bundle function

## How It Works

When the build runs:

1. `loadNuxt()` calls `scanPages()` to discover pages in `pages/` directory
2. `generateRoutesCode()` creates JavaScript code with imports and route definitions
3. The generated code is passed to `bundle()` as `routesCode`
4. The virtual plugin registers `#routes` → generated routes code
5. When Vite encounters `import routes from '#routes'`, it serves the generated code
6. The router uses the dynamically generated routes

## Testing

Create pages in the playground:

```
playground/
├── App.vue
└── pages/
    ├── index.vue
    ├── hello.vue
    └── world.vue
```

Run the server:

```sh
npx nuxi
```

All routes will be automatically available:
- `/` → `index.vue`
- `/hello` → `hello.vue`
- `/world` → `world.vue`

## Summary

By implementing automatic page scanning:

1. **File-based routing**: Pages are discovered from the filesystem
2. **No hardcoded imports**: Routes are generated at build time
3. **User-friendly**: Adding a new page is as simple as creating a `.vue` file
4. **Similar to Nuxt**: This pattern mirrors how real Nuxt handles page routing

### Current Limitations

This implementation is simplified compared to real Nuxt:
- No nested routes (subdirectories)
- No dynamic routes (`[id].vue`)
- No route metadata or middleware

These features would be added in a more complete implementation using the same pattern - scan the filesystem, generate code, serve through virtual modules.
