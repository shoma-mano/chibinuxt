# 06 Root Component

In this section, we'll remove the hardcoded `App.vue` path by implementing a virtual module system, similar to how the real Nuxt framework resolves user components.
The full code is available at [6-root-component](https://github.com/shoma-mano/chibinuxt/tree/main/impls/6-root-component).

## The Problem

In the previous implementation (5-packages), we hardcoded the path to `App.vue` in the entry files:

```ts
import App from '../../../../playground/App.vue'
```

This is problematic because:
- The path is relative to the nuxt package, not the user's project
- It won't work when the package is installed from npm
- Users can't customize their root component location

## How Does Nuxt Framework Solve This?

The real Nuxt framework uses a template system and virtual modules:

1. **Template Generation**: Nuxt uses `addTemplate()` to generate files at build time
2. **Virtual File System**: Generated code is served through virtual modules (e.g., `#build/app-component.mjs`)
3. **Vite Aliases**: Virtual module IDs like `#build/` are aliased to the generated files

For chibinuxt, we'll implement a simplified version using Vite's virtual module plugin.

## Virtual Module Plugin

### Create the plugin

Create a virtual module plugin that maps module IDs to generated code.

[`plugins/virtual.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/6-root-component/packages/vite/src/plugins/virtual.ts)

```ts
import type { Plugin } from 'vite'

const PREFIX = 'virtual:nuxt:'

export function virtual(vfs: Record<string, string>): Plugin {
  return {
    name: 'virtual',

    resolveId(id) {
      if (id in vfs) {
        return PREFIX + id
      }
      return null
    },

    load(id) {
      if (!id.startsWith(PREFIX)) {
        return null
      }
      const idNoPrefix = id.slice(PREFIX.length)
      if (idNoPrefix in vfs) {
        return {
          code: vfs[idNoPrefix],
          map: null,
        }
      }
    },
  }
}
```

Key points:
- `vfs` (virtual file system) is a map from module ID to generated code
- `resolveId` marks virtual modules with a special prefix
- `load` returns the generated code for virtual modules

### Update Vite build

Update the build configuration to accept `appComponent` path and register the `#app` virtual module.

[`build.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/6-root-component/packages/vite/src/build.ts)

```ts
import { build as _build, mergeConfig, type InlineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { virtual } from './plugins/virtual'

export interface BuildOptions {
  buildDir: string
  clientEntry: string
  serverEntry: string
  appComponent: string
}

export const bundle = async (options: BuildOptions) => {
  const { buildDir, clientEntry, serverEntry, appComponent } = options

  // Virtual file system for #app module
  const vfs: Record<string, string> = {
    '#app': `export { default } from '${appComponent}'`,
  }

  const defaultConfig = {
    plugins: [vue(), virtual(vfs)],
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

  // ... client and server config remain the same
}
```

Key changes:
- Added `appComponent` to `BuildOptions`
- Created `vfs` with `#app` mapping to re-export the user's App.vue
- Added `virtual(vfs)` plugin to the Vite config

## Update Entry Files

### entry.client.ts

Update to import from the virtual `#app` module.

[`entry.client.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/6-root-component/packages/nuxt/src/app/entry.client.ts)

```ts
import { createSSRApp } from 'vue'
import { createRouter } from './plugins/router'
// @ts-expect-error virtual module
import App from '#app'

const initApp = async () => {
  const router = createRouter()
  const app = createSSRApp(App)
  app.use(router)
  await router.isReady()
  app.mount('#__nuxt')
}
initApp().catch(console.error)
```

### entry.server.ts

Same change for the server entry.

[`entry.server.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/6-root-component/packages/nuxt/src/app/entry.server.ts)

```ts
import { createSSRApp } from 'vue'
import { createRouter } from './plugins/router'
// @ts-expect-error virtual module
import App from '#app'

export default async (ctx: { url: string }) => {
  const app = createSSRApp(App)
  const router = createRouter()
  router.push(ctx.url)
  await router.isReady()
  app.use(router)
  return app
}
```

Key point:
- `@ts-expect-error` is used because TypeScript doesn't know about the virtual module

## Update loadNuxt

Update `loadNuxt` to pass the `appComponent` path to the vite builder.

[`nuxt.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/6-root-component/packages/nuxt/src/core/nuxt.ts)

```ts
import { join, resolve } from 'node:path'
import { createDevServer, createNitro } from 'nitro'
import { bundle } from '@nuxt/vite-builder'

export const buildDir = resolve(process.cwd(), '.nuxt')
export const loadNuxt = async () => {
  const appComponent = resolve(process.cwd(), 'App.vue')
  await bundle({
    buildDir,
    clientEntry: join(import.meta.dirname, '../app/entry.client.ts'),
    serverEntry: join(import.meta.dirname, '../app/entry.server.ts'),
    appComponent,
  })
  const nitro = await createNitro({
    renderer: resolve(import.meta.dirname, './runtime/nitro/renderer.ts'),
  })
  const server = await createDevServer(nitro)
  return { server }
}
```

Key changes:
- `appComponent` is resolved from the current working directory (user's project)
- Passed to `bundle()` as a new option

## How It Works

When the build runs:

1. `loadNuxt()` resolves `App.vue` from the user's project directory
2. The path is passed to `bundle()` as `appComponent`
3. The virtual plugin registers `#app` → `export { default } from '/path/to/playground/App.vue'`
4. When Vite encounters `import App from '#app'`, it:
   - Calls `resolveId('#app')` → returns `virtual:nuxt:#app`
   - Calls `load('virtual:nuxt:#app')` → returns the re-export code
   - Follows the re-export to bundle the actual `App.vue`

## Summary

By implementing virtual modules:

1. **No hardcoded paths**: Entry files import from `#app` instead of relative paths
2. **User-configurable**: The root component is resolved from the user's project
3. **Similar to Nuxt**: This pattern mirrors how real Nuxt handles template generation
4. **Extensible**: The same pattern will be used for routes in the next section

The router still has hardcoded page imports - we'll fix that in the next section using the same virtual module pattern.
