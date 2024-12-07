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
  const { req, res } = event.node;
  const url = req.url;
  const ssrContext = {
    url,
  };
  const rendered = await renderer.renderToString(ssrContext);
  const data = renderHTML(rendered, ssrContext);
  res.setHeader("Content-Type", "text/html;charset=UTF-8");
  res.end(data, "utf-8");
});

function renderHTML(rendered, ssrContext) {
  const _html = rendered.html;

  const {
    htmlAttrs = "",
    bodyAttrs = "",
    headTags = "",
    headAttrs = "",
  } = (ssrContext.head && ssrContext.head()) || {};

  return htmlTemplate({
    HTML_ATTRS: htmlAttrs,
    HEAD_ATTRS: headAttrs,
    BODY_ATTRS: bodyAttrs,
    HEAD:
      headTags +
      rendered.renderResourceHints() +
      rendered.renderStyles() +
      (ssrContext.styles || ""),
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
