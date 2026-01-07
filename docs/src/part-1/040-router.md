# 1-4 Router

In this section, we'll integrate Vue Router to enable SSR based on the URL and client-side routing.
Full Code is available at [4-router](https://github.com/shoma-mano/chibinuxt/tree/main/impls/part-1/4-router)

## First, create routes in pages directory and add links in App.vue

[`pages/hello.vue`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/part-1/4-router/src/pages/hello.vue)

```vue
<script setup lang="ts"></script>
<template>
  <h1>Hello,</h1>
</template>
```

[`pages/world.vue`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/part-1/4-router/src/pages/world.vue)

```vue
<script setup lang="ts"></script>
<template>
  <h1>World!</h1>
</template>
```

[`App.vue`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/part-1/4-router/src/App.vue)

```vue
<script lang="ts" setup>
import { RouterView, RouterLink } from 'vue-router'
</script>
<template>
  <main>
    <RouterView></RouterView>
    <RouterLink to="/hello">Go to Hello</RouterLink>
    <RouterLink to="/world">Go to World</RouterLink>
  </main>
</template>
```

## Next, create a router.ts

We will make feature to automatically make routes from pages directory in the future, but we need to define routes manually for now.
In Sever Side, we can not use createWebHistory, so we need switch history based on `import.meta.server`.

[`router.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/part-1/4-router/src/router.ts)

```ts
import {
  type RouteRecordRaw,
  createRouter as _createRouter,
  createMemoryHistory,
  createWebHistory,
} from 'vue-router'
import Hello from './pages/hello.vue'
import World from './pages/world.vue'

export const createRouter = () => {
  const routes = [
    {
      path: '/hello',
      component: Hello,
    },
    {
      path: '/world',
      component: World,
    },
  ] satisfies RouteRecordRaw[]
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

## Add build config to enable to use import.meta.server

[`vite.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/part-1/4-router/src/vite.ts)

```ts{10-13,24-27}
const clientConfig = mergeConfig(defaultConfig, {
  build: {
    rollupOptions: {
      input: join(import.meta.dirname, 'entry.client.ts'),
      output: {
        entryFileNames: 'entry.client.js',
      },
    },
  },
  define: {
    'import.meta.server': false,
  },
} satisfies InlineConfig)

const severConfig = mergeConfig(defaultConfig, {
  build: {
    rollupOptions: {
      input: join(import.meta.dirname, 'entry.server.ts'),
      output: {
        entryFileNames: 'entry.server.js',
      },
    },
  },
  define: {
    'import.meta.server': true,
  },
} satisfies InlineConfig)
```

[`type.d.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/part-1/4-router/src/type.d.ts)

This is necessary to avoid type error, because `import.meta.server` is not defined in default.

```ts
interface ImportMeta {
  server: boolean
}
```

## Install router in entry.server.ts and entry.client.ts

[`entry.server.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/part-1/4-router/src/entry.server.ts)

We need to push initial URL manually in server side.
And router.isReady is necessary to avoid hydration error.
Will explain about ctx later.

```ts
export default async (ctx: { url: string }) => {
  const app = createSSRApp(App)
  const router = createRouter()
  router.push(ctx.url)
  await router.isReady()
  app.use(router)
  return app
}
```

[`entry.client.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/part-1/4-router/src/entry.client.ts)

On client side, the router automatically picks up initial location from the URL, so we don't need to push the URL manually.

```ts
const initApp = async () => {
  const router = createRouter()
  const app = createSSRApp(App)
  app.use(router)
  await router.isReady()
  app.mount('#__nuxt')
}
initApp().catch(console.error)
```

## Pass SSR Context when renderToString is called

The `renderToString` function receives the SSR context as the first argument and passes that context to the `createApp` function we provided to `createRenderer`. ([source code](https://github.com/nuxt-contrib/vue-bundle-renderer/blob/801bf02375155ec111b78148157f10435f71c972/src/runtime.ts#L259))
This is the context we received in `entry.server.ts`. So let's modify `render.ts` to pass the context.

[`render.ts`](https://github.com/shoma-mano/chibinuxt/blob/main/impls/part-1/4-router/src/render.ts)

```ts{14}
export const renderMiddleware = defineEventHandler(async (event) => {
  if (!renderer) await setupRenderer()

  const { req, res } = event.node
  if (req.url === '/entry.client.js') {
    const code = readFileSync(
      join(import.meta.dirname, 'dist/entry.client.js'),
      'utf-8',
    )
    res.setHeader('Content-Type', 'application/javascript')
    res.end(code)
  }

  const rendered = await renderer.renderToString({ url: req.url })
  const data = renderHTML(rendered)
  res.setHeader('Content-Type', 'text/html;charset=UTF-8')
  res.end(data, 'utf-8')
})
```

## Run the server

If you run the server, you can see client side routing works and server returns HTML based on requested URL.
