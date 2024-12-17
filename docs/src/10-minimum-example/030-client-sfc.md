# 1-3 Minimum Client SFC

In this section, we'll look at how to mount Vue App in client side.  
Full Code is available at [3-client-sfc](https://github.com/shoma-mano/chibinuxt/tree/main/books/3-client-sfc)

## First, create a entry.client.ts

`entry.client.ts`

```ts
import { createSSRApp } from "vue";
import App from "./App.vue";

const initApp = async () => {
  const app = createSSRApp(App);
  app.mount("#__nuxt");
};
initApp().catch(console.error);
```

## Next, rewrite build function to build not only server enty but also client entry

`vite.ts`

```ts
import { build as _build, mergeConfig, type InlineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { join } from "path";

export const build = async () => {
  try {
    const defaultConfig = {
      plugins: [vue()],
      build: {
        rollupOptions: {
          output: {
            format: "esm",
            dir: join(import.meta.dirname, "dist"),
          },
          preserveEntrySignatures: "exports-only",
          treeshake: false,
        },
        emptyOutDir: false,
      },
    } satisfies InlineConfig;

    const clientConfig = mergeConfig(defaultConfig, {
      build: {
        rollupOptions: {
          input: join(import.meta.dirname, "entry.client.ts"),
          output: {
            entryFileNames: "entry.client.js",
          },
        },
      },
    } satisfies InlineConfig);
    await _build(clientConfig);

    const severConfig = mergeConfig(defaultConfig, {
      build: {
        rollupOptions: {
          input: join(import.meta.dirname, "entry.server.ts"),
          output: {
            entryFileNames: "entry.server.js",
          },
        },
      },
    } satisfies InlineConfig);
    await _build(severConfig);

    console.log("Build completed successfully!");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
};
```

## Add a id and script to html to mount the app in client side

`render.ts`

```ts{9-10}
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
  `;
}
```

## Serve client.entry.js script in specific route request

`render.ts`

```ts{5-12}
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

  const rendered = await renderer.renderToString({});
  const data = renderHTML(rendered);
  res.setHeader("Content-Type", "text/html;charset=UTF-8");
  res.end(data, "utf-8");
});
```

## Run the server

If you run the server, you can see Count button works because we have mounted the app in client side.
