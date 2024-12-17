# 1-4 Router

In this section, we'll integrate Vue Router to enable SSR based on the URL and client-side routing.  
Full Code is available at [4-client-sfc](https://github.com/shoma-mano/chibinuxt/tree/main/books/4-router)

## First, create routes in pages directory and add links in App.vue

`pages/hello.vue`

```vue
<script setup lang="ts"></script>
<template>
  <h1>Hello,</h1>
</template>
```

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

We created routes in pages directory, but we need to define routes manually for now.

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

## Next, add build config to rewrite import.meta.server

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

This is necessary to avoid type error.

```ts
interface ImportMeta {
  server: boolean;
}
```

## Run the server

If you run the server, you can see Count button works because we have mounted the app in client side.
