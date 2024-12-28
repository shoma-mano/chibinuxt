# 1-5 Split Package

In this section, we'll split the package we created in the last section into `nuxt` and `nitro`.
Furthermore, we'll create a playground to make it possible to use `nuxt` and `nitro` in the playground.
The full code is available at [5-split-package](https://github.com/shoma-mano/chibinuxt/tree/main/impls/part-1/5-split-package).

::: warning How to separate packages?
We will use `pnpm workspace` to manage packages as Nuxt3 does.
If you are not familiar with `pnpm workspace`, here are the key points to understand:

- It allows you to install packages in the same repository without publishing them to the npm registry.
- To install another package in the same repository using the workspace protocol, you need to set the package as a workspace in `pnpm-workspace.yaml`. The location of `pnpm-workspace.yaml` is recognized as the workspace root.
- Once you set a package as a workspace, you can install it by adding `workspace:package-name` to `package.json`.
  :::

## Directory structure outline

Please refer to [5-split-package](https://github.com/shoma-mano/chibinuxt/tree/main/impls/part-1/5-split-package) for more details.

`pnpm-workspace.yaml`

```yaml
packages:
  - packages/*
  - playground
```

**Directory structure outline**

```sh
.
├── packages
│   ├── nitro
│   │    ├── package.json
│   │    └── src
│   │        ├── dev.ts
│   │        ├── index.ts
│   │        └── render.ts
│   └── nuxt
│       ├── package.json
│       └── src
│           ├── bin.ts
│           ├── dist
│           ├── entry.client.ts
│           ├── entry.server.ts
│           ├── main.ts
│           ├── router.ts
│           ├── type.d.ts
│           └── vite.ts
├── playground
│   ├── package.json
│   ├── App.vue
│   └── pages
└── pnpm-workspace.yaml
```

## About Nitro

The render and server features we created in previous sections are actually part of Nitro. Nitro is currently separated into a different repository. However, in chibinuxt, we will include Nitro in the same repository to create what people think of as Nuxt. (When Nuxt3 first became a monorepo, Nitro was in the same repository, and [it only had Nuxt and Nitro](https://github.com/nuxt/nuxt/tree/a16e13b1de918c7c9e7fec3185fef83b96489783).)

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

For nuxt to enable to use server created in Nitro, expose `createDevServer` function in Nitro.

package: `nitro`  
file: `dev.ts`

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

## Create playground to try nuxt and nitro

The playground is a place where users can develop their applications using Nuxt and Nitro without needing to know how they work internally.
In other words, it is a place for developing web applications using Nuxt, just like how we usually develop web applications with Nuxt.

## Run the server

If you run the server, you can see client side routing works and server returns HTML based on requested URL.
