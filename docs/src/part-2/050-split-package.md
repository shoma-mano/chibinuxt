# 1-5 Split Package

In this section, we'll split the package we created in last section into nuxt and nitro.
Furthermore, we'll make it possible to use them in playground.  
Full Code is available at [5-split-package](https://github.com/shoma-mano/chibinuxt/tree/main/impls/part-1/5-split-package)

## About Nitro

Actually, the render feature and server feature we created in previous sections is responsible for Nitro, and Nitro is currently separated into a different repository now. But in chibinuxt, we will make also nitro in the same repository to make “what people think as Nuxt”. (When Nuxt3 became monorepo for the first time, nitro was in the same repository, and [it had only nuxt and nitro](https://github.com/nuxt/nuxt/tree/a16e13b1de918c7c9e7fec3185fef83b96489783).)

## Render Feature(Nitro)

For separating render feature into nitro, we need to tell nitro where to find the entry file. We will use `process.env.DIST_DIR` to specify the directory where the entry file is located for now.

`render.ts`

```ts{3,17}
const setupRenderer = async () => {
  const createApp = await import(
    join(process.env.DIST_DIR!, "entry.server.js")
  ).then((m) => m.default);
  renderer = createRenderer(createApp, {
    renderToString,
    manifest: {},
  });
};

export const renderMiddleware = defineEventHandler(async (event) => {
  if (!renderer) await setupRenderer();

  const { req, res } = event.node;
  if (req.url === "/entry.client.js") {
    const code = readFileSync(
      join(process.env.DIST_DIR!, "entry.client.js"),
      "utf-8"
    );
    res.setHeader("Content-Type", "application/javascript");
    res.end(code);
  }

  const rendered = await renderer.renderToString({ url: req.url });
  const data = renderHTML(rendered);
  res.setHeader("Content-Type", "text/html;charset=UTF-8");
  res.end(data, "utf-8");
});
```

## Server Feature(Nitro)

For nuxt to enable to use server created in Nitro, expose `getServer` function in Nitro.

`server.ts`

```ts
export const getServer = () => {
  const app = createApp();
  app.use(renderMiddleware);

  const server = createServer(toNodeListener(app));
  return server;
};
```

````sh

`pages/hello.vue`

```vue
<script setup lang="ts"></script>
<template>
  <h1>Hello,</h1>
</template>
````

`pages/world.vue`

```vue
<script setup lang="ts"></script>
<template>
  <h1>World!</h1>
</template>
```

`App.vue`

```vue
<script lang="ts" setup>
import { RouterView, RouterLink } from "vue-router";
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

`router.ts`

```ts
import {
  type RouteRecordRaw,
  createRouter as _createRouter,
  createMemoryHistory,
  createWebHistory,
} from "vue-router";
import Hello from "./pages/hello.vue";
import World from "./pages/world.vue";

export const createRouter = () => {
  const routes = [
    {
      path: "/hello",
      component: Hello,
    },
    {
      path: "/world",
      component: World,
    },
  ] satisfies RouteRecordRaw[];
  const history = import.meta.server
    ? createMemoryHistory()
    : createWebHistory();
  const router = _createRouter({
    history,
    routes,
  });
  return router;
};
```

## Add build config to enable to use import.meta.server

`vite.ts`

```ts{10-13,24-27}
const clientConfig = mergeConfig(defaultConfig, {
  build: {
    rollupOptions: {
      input: join(import.meta.dirname, "entry.client.ts"),
      output: {
        entryFileNames: "entry.client.js",
      },
    },
  },
  define: {
    "import.meta.server": false,
  },
} satisfies InlineConfig);

const severConfig = mergeConfig(defaultConfig, {
  build: {
    rollupOptions: {
      input: join(import.meta.dirname, "entry.server.ts"),
      output: {
        entryFileNames: "entry.server.js",
      },
    },
  },
  define: {
    "import.meta.server": true,
  },
} satisfies InlineConfig);
```

`type.d.ts`

This is necessary to avoid type error, because `import.meta.server` is not defined in default.

```ts
interface ImportMeta {
  server: boolean;
}
```

## Install router in entry.server.ts and entry.client.ts

`entry.server.ts`

We need to push initial URL manually in server side.
And router.isReady is necessary to avoid hydration error.
Will explain about ctx later.

```ts
export default async (ctx: { url: string }) => {
  const app = createApp(App);
  const router = createRouter();
  router.push(ctx.url);
  await router.isReady();
  app.use(router);
  return app;
};
```

`entry.client.ts`

On client side, the router automatically picks up initial location from the URL, so we don't need to push the URL manually.

```ts
const initApp = async () => {
  const router = createRouter();
  await router.isReady();
  const app = createSSRApp(App);
  app.use(router);
  app.mount("#__nuxt");
};
```

## Pass SSR Context when renderToString is called

The `renderToString` function receives the SSR context as the first argument and passes that context to the `createApp` function we provided to `createRenderer`. ([source code](https://github.com/nuxt-contrib/vue-bundle-renderer/blob/801bf02375155ec111b78148157f10435f71c972/src/runtime.ts#L259))
This is the context we received in `entry.server.ts`. So let's modify `render.ts` to pass the context.

`render.ts`

```ts{14}
export const renderMiddleware = defineEventHandler(async (event) => {
  if (!renderer) await setupRenderer();

  const { req, res } = event.node;
  if (req.url === "/entry.client.js") {
    const code = readFileSync(
      join(import.meta.dirname, "dist/entry.client.js"),
      "utf-8"
    );
    res.setHeader("Content-Type", "application/javascript");
    res.end(code);
  }

  const rendered = await renderer.renderToString({ url: req.url });
  const data = renderHTML(rendered);
  res.setHeader("Content-Type", "text/html;charset=UTF-8");
  res.end(data, "utf-8");
});
```

## Run the server

If you run the server, you can see client side routing works and server returns HTML based on requested URL.
