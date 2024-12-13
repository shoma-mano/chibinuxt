import { createRenderer } from "vue-bundle-renderer/runtime";
import { renderToString } from "vue/server-renderer";
import { h, createApp } from "vue";
import { defineEventHandler } from "h3";

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
function renderHTML(rendered: Rendered): string {
  const _html = rendered.html;

  return htmlTemplate({
    HEAD: rendered.renderResourceHints() + rendered.renderStyles(),
    APP: _html + rendered.renderScripts(),
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
