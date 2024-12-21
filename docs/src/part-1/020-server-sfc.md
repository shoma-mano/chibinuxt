# 1-2 Minimum Server SFC

In this section, we'll look at how to render HTML using SFC (files with a .vue extension).
Nuxt uses `vite` to transform SFC into JavaScript file that the browser can execute.  
Full Code is available at [2-server-sfc](https://github.com/shoma-mano/chibinuxt/tree/main/impls/part-1/2-server-sfc)

## First, rewrite createApp that is passed to createRenderer

In last section, we used `h` function to create a Vue App.  
In this section, we'll use SFC to create a Vue App instead of `h` function.

`App.vue`

```vue
<script lang="ts" setup>
import { ref } from "vue";
const count = ref(0);
const onClick = () => {
  count.value++;
};
</script>
<template>
  <p>Hello,World</p>
  <button @click="onClick">count++</button>
  <p>count: {{ count }}</p>
</template>
```

`entry.server.ts`

```ts
import { createApp } from "vue";
import App from "./App.vue";

export default () => {
  const app = createApp(App);
  return app;
};
```

## Next, implement function to build this entry.server.ts with vite

`@vitejs/plugin-vue` compile SFC to js file that browser can execute.
If you want to know more about How SFC is complied, [chibivue](https://book.chibivue.land/10-minimum-example/090-prerequisite-knowledge-for-the-sfc.html) is good resource.

`vite.ts`

```ts
import { build as _build } from "vite";
import vue from "@vitejs/plugin-vue";
import { join } from "path";

export const build = async () => {
  try {
    await _build({
      plugins: [vue()],
      build: {
        rollupOptions: {
          input: join(import.meta.dirname, "entry.server.ts"),
          output: {
            format: "esm",
            dir: join(import.meta.dirname, "dist"),
            entryFileNames: "entry.server.js",
          },
          preserveEntrySignatures: "exports-only",
          treeshake: false,
        },
      },
    });
    console.log("Build completed successfully!");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
};
```

## Finally, create a renderer using the built file

To avoid errors caused by static ESM import checks, we need to use dynamic import to import the built file.

`render.ts`

```ts
let renderer: ReturnType<typeof createRenderer>;
const setupRenderer = async () => {
  const createApp = await import(
    join(import.meta.dirname, "dist/entry.server.js")
  ).then((m) => m.default);
  renderer = createRenderer(createApp, {
    renderToString,
    manifest: {},
  });
};
export const renderMiddleware = defineEventHandler(async (event) => {
  if (!renderer) await setupRenderer();
  const { res } = event.node;
  const rendered = await renderer.renderToString({});
  const data = renderHTML(rendered);
  res.setHeader("Content-Type", "text/html;charset=UTF-8");
  res.end(data, "utf-8");
});
```

And, run build before start server.
`main.ts`

```ts
const main = async () => {
  await build();

  const app = createApp();
  app.use(renderMiddleware);

  const server = createServer(toNodeListener(app));
  server.listen(3030, () => {
    console.log("Server listening on http://localhost:3030");
  });
};
main();
```

## Run the server

If you run the server, you can see the rendered page by SFC.
But Count button doesn't work because we haven't mounted the app in client side yet.
We'll see how to mount the app in client side in next section.
