# 05 Split Package

In this section, we'll split the package we created in the last section into `nuxt`, `nitro`, and `vite`.
Furthermore, we'll create a playground to make it possible to use `nuxt` and `nitro` in the playground.
The full code is available at [5-packages](https://github.com/shoma-mano/chibinuxt/tree/main/impls/5-packages).

::: warning How to separate packages?
We will use `pnpm workspace` to manage packages as Nuxt 4 does.
If you are not familiar with `pnpm workspace`, here are the key points to understand:

- It allows you to install packages in the same repository without publishing them to the npm registry.
- To install another package in the same repository using the workspace protocol, you need to set the package as a workspace in `pnpm-workspace.yaml`. The location of `pnpm-workspace.yaml` is recognized as the workspace root.
- Once you set a package as a workspace, you can install it by adding `workspace:package-name` to `package.json`.
:::

## What we don't cover here

We don't cover the directory structure or each package's dependencies in this section. Please refer to [5-packages](https://github.com/shoma-mano/chibinuxt/tree/main/impls/5-packages) for details.

## Package Overview

### nitro

The server features we created in previous sections are actually part of Nitro. Nitro is currently separated into a different repository. However, in chibinuxt, we will include Nitro in the same repository to create **what people think of as Nuxt**. (When Nuxt3 first became a monorepo, Nitro was in the same repository, and [it only had Nuxt and Nitro](https://github.com/nuxt/nuxt/tree/a16e13b1de918c7c9e7fec3185fef83b96489783).)

### vite

The `@nuxt/vite-builder` package handles the Vite build process. It bundles client and server entries using Vite and outputs them to the `.nuxt` directory.

### nuxt

The `nuxt` package is responsible for transpiling SFCs to JavaScript files that Nitro uses to render HTML. It also provides directory-based routing features. Nuxi is interface to this package.

### playground

The `playground` package is a place where users can develop their applications using Nuxt and Nitro without needing to know how they work internally.

## Nitro

### Types

First, let's define the types that Nitro uses. We'll organize types following the structure of the real Nitro.

[`types/nitro.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/5-packages/packages/nitro/src/types/nitro.ts)

```ts
export interface Nitro {
  options: NitroOptions
}

export interface NitroOptions {
  renderer?: string
}

export interface NitroConfig {
  renderer?: string
}
```

[`types/runtime/nitro.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/5-packages/packages/nitro/src/types/runtime/nitro.ts)

```ts
import type { App as H3App, H3Event } from 'h3'

export interface NitroApp {
  h3App: H3App
}

export interface RenderResponse {
  body: any
  statusCode: number
  statusMessage: string
  headers: Record<string, string>
}

export type RenderHandler = (
  event: H3Event,
) => Partial<RenderResponse> | Promise<Partial<RenderResponse>>
```

### createNitro

Create `createNitro` function that creates a Nitro instance with configuration.

[`nitro.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/5-packages/packages/nitro/src/nitro.ts)

```ts
import type { Nitro, NitroConfig } from 'nitro/types'

export async function createNitro(config: NitroConfig = {}): Promise<Nitro> {
  const nitro: Nitro = {
    options: {
      renderer: config.renderer,
    },
  }
  return nitro
}
```

### useNitroApp

Create `useNitroApp` to manage the h3 app instance as a singleton.

[`runtime/internal/app.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/5-packages/packages/nitro/src/runtime/internal/app.ts)

```ts
import { createApp } from 'h3'
import type { NitroApp } from 'nitro/types'

function createNitroApp(): NitroApp {
  const h3App = createApp()
  return { h3App }
}

export const nitroApp: NitroApp = createNitroApp()

export function useNitroApp(): NitroApp {
  return nitroApp
}
```

### defineRenderHandler

Create `defineRenderHandler` to wrap render handlers in h3 event handlers.

[`runtime/internal/render.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/5-packages/packages/nitro/src/runtime/internal/render.ts)

```ts
import { eventHandler } from 'h3'
import type { RenderHandler } from 'nitro/types'

export function defineRenderHandler(handler: RenderHandler) {
  return eventHandler(async event => {
    const response = await handler(event)
    return response.body
  })
}
```

### createDevServer

Create `createDevServer` that accepts a Nitro instance and dynamically imports the renderer.

[`dev/server.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/5-packages/packages/nitro/src/dev/server.ts)

```ts
import { createServer } from 'node:http'
import { toNodeListener } from 'h3'
import type { Nitro } from 'nitro/types'
import { useNitroApp } from '../runtime/app'

export async function createDevServer(nitro: Nitro) {
  const listen = async () => {
    const { h3App } = useNitroApp()
    const renderer = await import(nitro.options.renderer!).then(m => m.default)
    h3App.use(renderer)
    const server = createServer(toNodeListener(h3App))
    server.listen(3030, () => {
      console.log('Server is running on http://localhost:3030')
    })
  }
  return { listen }
}
```

Key points:

- The dev server dynamically imports the renderer from the path specified in `nitro.options.renderer`
- The renderer is expected to be a default export

## Vite

### bundle

Create `@nuxt/vite-builder` package to handle Vite builds. The build output is written to the `buildDir` (`.nuxt` directory in the playground).

[`build.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/5-packages/packages/vite/src/build.ts)

```ts
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
```

Key points:

- `BuildOptions` interface defines `buildDir` for output directory (`.nuxt`) and paths for entry files
- `outDir: buildDir` outputs both client and server bundles directly to the `.nuxt` directory
- `ssr: true` is required for server config to properly build SSR bundles

## Nuxt

### Renderer

Create the renderer that handles both client entry serving and SSR rendering. The renderer reads built files from `buildDir` (`.nuxt` directory).

[`renderer.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/5-packages/packages/nuxt/src/core/runtime/nitro/renderer.ts)

```ts
import { join } from 'node:path'
import { readFileSync } from 'node:fs'
import { defineRenderHandler } from 'nitro/runtime'
import { createRenderer } from 'vue-bundle-renderer/runtime'
import { renderToString } from 'vue/server-renderer'
import { buildDir } from '../../nuxt'

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

type Rendered = {
  html: string
  renderResourceHeaders: () => Record<string, string>
  renderResourceHints: () => string
  renderStyles: () => string
  renderScripts: () => string
}
function renderHTML({
  html,
  renderResourceHints,
  renderStyles,
  renderScripts,
}: Rendered) {
  return htmlTemplate({
    HEAD: renderResourceHints() + renderStyles(),
    APP: html + renderScripts(),
  })
}

interface HtmlTemplateParams {
  HEAD: string
  APP: string
}
function htmlTemplate({ HEAD, APP }: HtmlTemplateParams): string {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    ${HEAD}
  </head>
  <body>
    <div id="__nuxt">${APP}</div>
    <script type="module" src="/entry.client.js"></script>
  </body>
  </html>
    `
}
```

Key points:

- The renderer is a default export using `defineRenderHandler`
- Uses `buildDir` (`.nuxt`) to locate built files instead of package dist directory
- Client entry (`/entry.client.js`) serving is handled in nuxt's renderer, not in nitro

### loadNuxt

Create `loadNuxt` that wires everything together.

[`nuxt.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/5-packages/packages/nuxt/src/core/nuxt.ts)

```ts
import { join, resolve } from 'node:path'
import { createDevServer, createNitro } from 'nitro'
import { bundle } from '@nuxt/vite-builder'

export const buildDir = resolve(process.cwd(), '.nuxt')

export const loadNuxt = async () => {
  await bundle({
    buildDir,
    clientEntry: join(import.meta.dirname, '../app/entry.client.ts'),
    serverEntry: join(import.meta.dirname, '../app/entry.server.ts'),
  })
  const nitro = await createNitro({
    renderer: resolve(import.meta.dirname, './runtime/nitro/renderer.ts'),
  })
  const server = await createDevServer(nitro)
  return { server }
}
```

Key points:

- `buildDir` is set to `.nuxt` in the current working directory (playground)
- `buildDir` is exported so the renderer can access it
- `createNitro` receives the renderer path
- `createDevServer` receives the nitro instance

### nuxi

To make it possible for users to access nuxt, we will create nuxi as a interface to nuxt.
nuxi is sometimes thought of as a short name for Nuxt CLI, but it also means [Nuxt Interface](https://github.com/nuxt/cli/discussions/7).

[`package.json`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/5-packages/packages/nuxt/package.json)

```json
"bin": {
  "nuxi": "src/bin.ts"
},
```

[`bin.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/5-packages/packages/nuxt/src/bin.ts)

```ts
#!/usr/bin/env bun

import { loadNuxt } from './core/nuxt'

const main = async () => {
  const nuxt = await loadNuxt()
  nuxt.server.listen()
}
main().catch(console.error)
```

we use bun for shebang in `bin.ts` for now to execute typescript directly from playground.

### Update paths for playground

Since `App.vue` is located in the playground and not in the same directory, we need to update the paths for `App.vue` and the pages directory.
We will fix it later, but for now, we will hard code the path to the playground.

[`entry.server.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/5-packages/packages/nuxt/src/app/entry.server.ts)
[`entry.client.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/5-packages/packages/nuxt/src/app/entry.client.ts)

```ts
import App from '../../../../playground/App.vue'
```

[`router.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/5-packages/packages/nuxt/src/app/plugins/router.ts)

```ts
import Hello from '../../../../../playground/pages/hello.vue'
import World from '../../../../../playground/pages/world.vue'
```

## Playground

Move App.vue and pages directory to playground package.

## Run the server

You can run the server by running the following command in playground.

```sh
npx nuxi
```

## Build Output

After running `npx nuxi`, the Vite build outputs files to the `.nuxt` directory in the playground:

```txt
playground/.nuxt/
├── entry.client.js
└── entry.server.js
```

This is similar to how the real Nuxt framework outputs build artifacts to the `.nuxt` directory.

## Deep Dive

::: tip Note
This is Deep Dive section. You can skip this section if you are not interested in it.
:::

### Why vue must be installed in playground?

To successfully execute npx nuxi, we need to install vue in the playground, while other dependencies like `vue-router` are not required. This is because vue isn't resolved from the node_modules in the nuxt package, even though other dependencies are.

So, why isn't vue resolved from the node_modules in the nuxt package?
It depends on where vite starts looking for the package. Generally, vite begins its search from the location of the file containing the import statement. In a typical case, vite would start searching from a path like `entry.client.ts` where vue is imported. If it starts there, it would find vue in the node_modules of the nuxt package because the Node.js resolution algorithm moves up to the parent directory to locate packages.
However, that's not what happens in this case because of [vite's dedupe option.](https://vite.dev/config/shared-options#resolve-dedupe)

[This is the code that determines the basedir where vite starts looking for the package.](https://github.com/vitejs/vite/blob/e1b520c4fbb3d65a06b04ce8fb3acfa71f253ee9/packages/vite/src/node/plugins/resolve.ts#L709-L721)

```ts{3}
let basedir: string
if (dedupe.includes(pkgId)) {
  basedir = root
} else if (
  importer &&
  path.isAbsolute(importer) &&
  // css processing appends `*` for importer
  (importer[importer.length - 1] === '*' || fs.existsSync(cleanUrl(importer)))
) {
  basedir = path.dirname(importer)
} else {
  basedir = root
}
```

vue is included in the dedupe array by default to prevent it from being resolved from multiple paths. As a result, vite starts looking for vue from the root directory. In this context, the root directory is the current working directory (cwd), which corresponds to the playground directory.

This is why we need to install vue in the playground and ensure it is placed in the playground's node_modules.
