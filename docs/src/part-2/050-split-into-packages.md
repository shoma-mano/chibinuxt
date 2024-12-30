# 2-1 Split Package

In this section, we'll split the package we created in the last section into `nuxt` and `nitro`.
Furthermore, we'll create a playground to make it possible to use `nuxt` and `nitro` in the playground.
The full code is available at [5-split-into-packages](https://github.com/shoma-mano/chibinuxt/tree/main/impls/part-2/5-split-into-packages).

::: warning How to separate packages?
We will use `pnpm workspace` to manage packages as Nuxt3 does.
If you are not familiar with `pnpm workspace`, here are the key points to understand:

- It allows you to install packages in the same repository without publishing them to the npm registry.
- To install another package in the same repository using the workspace protocol, you need to set the package as a workspace in `pnpm-workspace.yaml`. The location of `pnpm-workspace.yaml` is recognized as the workspace root.
- Once you set a package as a workspace, you can install it by adding `workspace:package-name` to `package.json`.
  :::

## What we don't cover here

- **About Directory structure**  
  Please refer to [5-split-into-packages](https://github.com/shoma-mano/chibinuxt/tree/main/impls/part-2/5-split-into-packages).

- **About Each package's dependencies**  
  We don't explain what dependencies are listed in each package's `package.json` here, so please refer to [5-split-into-packages](https://github.com/shoma-mano/chibinuxt/tree/main/impls/part-2/5-split-into-packages). If you have a question about why `vue` must be installed in `playground`, we explain it in the [Deep Dive](#deep-dive) section.

## Before we start

These are each package's overview.

### nitro

The render and server features we created in previous sections are actually part of Nitro. Nitro is currently separated into a different repository. However, in chibinuxt, we will include Nitro in the same repository to create **what people think of as Nuxt**. (When Nuxt3 first became a monorepo, Nitro was in the same repository, and [it only had Nuxt and Nitro](https://github.com/nuxt/nuxt/tree/a16e13b1de918c7c9e7fec3185fef83b96489783).)

### nuxt

The `nuxt` package is responsible for transpiling SFCs to JavaScript files that Nitro uses to render HTML. It also provides directory-based routing features. Nuxi is interface to this package.

### playground

The `playground` package is a place where users can develop their applications using Nuxt and Nitro without needing to know how they work internally.
In other words, it is a place for developing web applications using Nuxt, just like how we usually develop web applications with Nuxt.

## Tell nitro where to find the entry file

##### package: `nuxt`

To separate the render feature into Nitro, we need to tell Nitro where to find the entry file. We will use `process.env.DIST_DIR` to specify the directory where the entry file is located for now.

`main.ts`

```ts{3}
export const main = async () => {
  await build()
  process.env.DIST_DIR = join(import.meta.dirname, 'dist')
  const server = createDevServer()
  server.listen()
}
```

## Create nuxi

##### package: `nuxt`

To make it possible for users to access nuxt, we will create nuxi as a interface to nuxt.
nuxi is sometimes thought of as a short name for Nuxt CLI, but it also means [Nuxt Interface](https://github.com/nuxt/cli/discussions/7).

`package.json`

```json
"bin": {
  "nuxi": "src/bin.ts"
},
```

`bin.ts`

```ts
#!/usr/bin/env -S npx tsx
import { main } from './main'

main()
```

we use tsx for shebang in `bin.ts` for now to execute typescript directly from playground.

## Change App.vue path and pages directory path

##### package: `nuxt`

We need to change the path of `App.vue` and the pages directory path in nuxt.
We will fix it later, but for now, we will hard code the path to the playground.

`entry.server.ts`  
`entry.client.ts`

```ts
import App from '../../../playground/App.vue'
```

`router.ts`

```ts
import Hello from '../../../playground/pages/hello.vue'
import World from '../../../playground/pages/world.vue'
```

## Change entry file path in nitro

##### package: `nitro`

nitro needs to use the entry file path specified by nuxt. So we need to change the entry file path in nitro.

`render.ts`

```ts{2}
const createApp = await import(
  join(process.env.DIST_DIR!, "entry.server.js")
).then((m) => m.default);
```

```ts{2}
const code = readFileSync(
  join(process.env.DIST_DIR!, "entry.client.js"),
  "utf-8",
);
```

## Expose `createDevServer` function from nitro to nuxt

##### package: `nitro`

For nuxt to enable to use server created in Nitro, expose `createDevServer` function in Nitro.

`dev.ts`

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
