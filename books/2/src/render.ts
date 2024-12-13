import { createRenderer } from "vue-bundle-renderer/runtime";
import { renderToString } from "vue/server-renderer";
import { defineEventHandler } from "h3";
import { join } from "path";

let renderer: ReturnType<typeof createRenderer>;
export const renderMiddleware = defineEventHandler(async (event) => {
  if (!renderer) {
    const createApp = await import(
      join(import.meta.dirname, "dist/entry.server.js")
    ).then((m) => m.default);
    renderer = createRenderer(createApp, {
      renderToString,
      manifest: {},
    });
  }
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
function renderHTML(rendered: Rendered) {
  const _html = rendered.html;

  const { htmlAttrs = "", bodyAttrs = "", headTags = "", headAttrs = "" } = {};

  return htmlTemplate({
    HTML_ATTRS: htmlAttrs,
    HEAD_ATTRS: headAttrs,
    BODY_ATTRS: bodyAttrs,
    HEAD: headTags + rendered.renderResourceHints() + rendered.renderStyles(),
    APP: _html + rendered.renderScripts(),
  });
}

interface HtmlTemplateParams {
  HTML_ATTRS: string;
  HEAD_ATTRS: string;
  BODY_ATTRS: string;
  HEAD: string;
  APP: string;
}

function htmlTemplate({
  HTML_ATTRS,
  HEAD_ATTRS,
  BODY_ATTRS,
  HEAD,
  APP,
}: HtmlTemplateParams): string {
  return `
<!DOCTYPE html>
<html ${HTML_ATTRS}>
<head ${HEAD_ATTRS}>
  ${HEAD}
</head>
<body ${BODY_ATTRS}>
  ${APP}
</body>
</html>
  `;
}
