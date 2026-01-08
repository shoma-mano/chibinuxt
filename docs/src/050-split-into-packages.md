# 05 Split Package

In this section, we'll split the package we created in the last section into `nuxt` and `nitro`.
Furthermore, we'll create a playground to make it possible to use `nuxt` and `nitro` in the playground.
The full code is available at [5-packages](https://github.com/shoma-mano/chibinuxt/tree/main/impls/5-packages).

::: warning How to separate packages?
We will use `pnpm workspace` to manage packages as Nuxt3 does.
If you are not familiar with `pnpm workspace`, here are the key points to understand:

- It allows you to install packages in the same repository without publishing them to the npm registry.
- To install another package in the same repository using the workspace protocol, you need to set the package as a workspace in `pnpm-workspace.yaml`. The location of `pnpm-workspace.yaml` is recognized as the workspace root.
- Once you set a package as a workspace, you can install it by adding `workspace:package-name` to `package.json`.
  :::

## What we don't cover here

We don't cover the directory structure or each package's dependencies in this section. Please refer to [5-packages](https://github.com/shoma-mano/chibinuxt/tree/main/impls/5-packages) for details.

## Before we start

These are each package's overview.

### nitro

The server features we created in previous sections are actually part of Nitro. Nitro is currently separated into a different repository. However, in chibinuxt, we will include Nitro in the same repository to create **what people think of as Nuxt**. (When Nuxt3 first became a monorepo, Nitro was in the same repository, and [it only had Nuxt and Nitro](https://github.com/nuxt/nuxt/tree/a16e13b1de918c7c9e7fec3185fef83b96489783).)

### nuxt

The `nuxt` package is responsible for transpiling SFCs to JavaScript files that Nitro uses to render HTML. It also provides directory-based routing features. Nuxi is interface to this package.

### playground

The `playground` package is a place where users can develop their applications using Nuxt and Nitro without needing to know how they work internally.

## Setup Renderer

##### package: `nitro`

To mirror original, we will implement `createDevServer` and `defineRenderer` in `nitro` package.

[`server.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/5-packages/packages/nitro/src/core/dev-server/server.ts)

```ts
export const createDevServer = () => {
  const listen = () => {
    const app = createApp()
    app.use(renderMiddleware)
    const server = createServer(toNodeListener(app))
    server.listen(3030, () => {
      console.log('Server is running on http://localhost:3030')
    })
  }
  return { listen }
}
```

[`render.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/5-packages/packages/nitro/src/runtime/render.ts)

```ts
import { join } from 'node:path'
import { readFileSync } from 'node:fs'
import { defineEventHandler } from 'h3'
import type { H3Event } from 'h3'

let renderer: RenderHandler
type RenderHandler = (event: H3Event) => Promise<void>
export const defineRenderHandler = async (_renderer: RenderHandler) => {
  renderer = _renderer
}

export const renderMiddleware = defineEventHandler(async event => {
  const { req, res } = event.node
  if (req.url === '/entry.client.js') {
    const code = readFileSync(
      join(process.env.APP_DIST_DIR!, 'entry.client.js'),
      'utf-8',
    )
    res.setHeader('Content-Type', 'application/javascript')
    res.end(code)
  }
  await renderer(event)
})
```

##### package: `nuxt`

To call `defineRenderHandler`, create `setupRenderer` function in `nuxt` package.

[`renderer.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/5-packages/packages/nuxt/src/core/runtime/nitro/renderer.ts)

```ts
import { join } from 'node:path'
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

export const setupRenderer = () => {
  defineRenderHandler(async event => {
    const renderer = await getRenderer()
    const { req, res } = event.node
    const rendered = await renderer.renderToString({ url: req.url })
    const data = renderHTML(rendered)
    res.setHeader('Content-Type', 'text/html;charset=UTF-8')
    res.end(data, 'utf-8')
  })
}

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

Call `setupRenderer` in `nuxt.ts`.
And this is temporary way, but We will use `process.env.APP_DIST_DIR` to specify the directory where the entry file is located for now.

[`nuxt.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/5-packages/packages/nuxt/src/core/nuxt.ts)

```ts{3}
export const loadNuxt = async () => {
  // this is temporary way
  process.env.APP_DIST_DIR = join(import.meta.dirname, '../../../../playground/.nitro')
  await bundle()
  setupRenderer()
  const server = createDevServer()
  return { server }
}
```

## Create nuxi

##### package: `nuxt`

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

## Change App.vue path and pages directory path

##### package: `nuxt`

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

## Move App.vue and pages directory to playground

##### package: `playground`

Move App.vue and pages directory to playground package like [this](#directory-structure-outline).

## Run the server

You can run the server by running the following command in playground.

```sh
npx nuxi
```

## Deep Dive

::: tip Note
This is Deep Dive section. You can skip this section if you are not interested in it.
:::

### Why vue must be installed in playground?

To successfully execute npx nuxi, we need to install vue in the playground, while other dependencies like `vue-router` are not required. This is because vue isn’t resolved from the node_modules in the nuxt package, even though other dependencies are.

So, why isn’t vue resolved from the node_modules in the nuxt package?  
It depends on where vite starts looking for the package. Generally, vite begins its search from the location of the file containing the import statement. In a typical case, vite would start searching from a path like `entry.client.ts` where vue is imported. If it starts there, it would find vue in the node_modules of the nuxt package because the Node.js resolution algorithm moves up to the parent directory to locate packages.  
However, that’s not what happens in this case because of [vite's dedupe option.](https://vite.dev/config/shared-options#resolve-dedupe)

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
