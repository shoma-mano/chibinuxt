# 1-1 Minimum SSR

In this section, we'll look at how to render HTML with Vue App created by `createApp`.  
Full code is available at [1-min-ssr](https://github.com/shoma-mano/chibinuxt/tree/main/impls/part-1/1-min-ssr)

## Create Vue SSR Renderer

SSR can be achieved with just `vue`, but Nuxt uses `vue-bundle-renderer/runtime` to create a SSR Renderer.
So, let's create a renderer using `vue-bundle-renderer/runtime`.

`render.ts`

```ts
import { createRenderer } from 'vue-bundle-renderer/runtime'
import { renderToString } from "vue/server-renderer";
import { h, createApp } from "vue";

const _createApp = () => {
  const app = createApp({
    render: () => h("div", "hello world"),
  });
  return app;
};

const renderer = createRenderer(_createApp, {
  renderToString,
  manifest: {},
});
```

## Create Render Middleware

Nitro uses `h3` as HTTP server, so let's create a h3 middleware that return HTML renderd by vue ssr renderer.

`render.ts`

```ts
export const renderMiddleware = defineEventHandler(async (event) => {
  const { res } = event.node;
  const rendered = await renderer.renderToString({});
  const data = renderHTML(rendered);
  res.setHeader("Content-Type", "text/html;charset=UTF-8");
  res.end(data, "utf-8");
});

type Rendered = {
  html: string;
  renderResourceHeaders: () => Record<string, string>;
  renderResourceHints: () => string;
  renderStyles: () => string;
  renderScripts: () => string;
};
function renderHTML({
  html,
  renderResourceHints,
  renderStyles,
  renderScripts,
}: Rendered) {
  return htmlTemplate({
    HEAD: renderResourceHints() + renderStyles(),
    APP: html + renderScripts(),
  });
}

interface HtmlTemplateParams {
  HEAD: string;
  APP: string;
}
function htmlTemplate({ HEAD, APP }: HtmlTemplateParams): string {
  return `
<!DOCTYPE html>
<html>
<head>
  ${HEAD}
</head>
<body>
  ${APP}
</body>
</html>
  `;
}
```

## Register Render Middleware

Finally, let's register the render middleware to the h3.

`main.ts`

```ts
import { createApp, toNodeListener } from "h3";
import { createServer } from "http";
import { renderMiddleware } from "./render";

const app = createApp();
app.use(renderMiddleware);

const server = createServer(toNodeListener(app));
server.listen(3030, () => {
  console.log("Server listening on http://localhost:3030");
});
```

## Run Server

You can run the server with any typescript runner.In this book, we use `bun`.

```sh
bun src/main.ts
```
