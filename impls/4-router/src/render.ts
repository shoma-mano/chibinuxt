import { join } from 'node:path'
import { readFileSync } from 'node:fs'
import { createRenderer } from 'vue-bundle-renderer/runtime'
import { renderToString } from 'vue/server-renderer'
import { defineEventHandler } from 'h3'

let renderer: ReturnType<typeof createRenderer>
const setupRenderer = async () => {
  const createApp = await import(
    join(import.meta.dirname, 'dist/entry.server.js')
  ).then(m => m.default)
  renderer = createRenderer(createApp, {
    renderToString,
    manifest: {},
  })
}

export const renderMiddleware = defineEventHandler(async (event) => {
  if (!renderer) await setupRenderer()

  const { req, res } = event.node
  if (req.url === '/favicon.ico') return

  if (req.url === '/entry.client.js') {
    const code = readFileSync(
      join(import.meta.dirname, 'dist/entry.client.js'),
      'utf-8',
    )
    res.setHeader('Content-Type', 'application/javascript')
    res.end(code)
    return
  }

  const rendered = await renderer.renderToString({ url: req.url })
  const data = renderHTML(rendered)
  res.setHeader('Content-Type', 'text/html;charset=UTF-8')
  res.end(data, 'utf-8')
})

type Rendered = {
  html: string
  renderResourceHeaders: () => Record<string, string>
  renderResourceHints: () => string
  renderStyles: () => string
  renderScripts: () => string
}
function renderHTML({
  html,
  renderResourceHints,
  renderStyles,
  renderScripts,
}: Rendered) {
  return htmlTemplate({
    HEAD: renderResourceHints() + renderStyles(),
    APP: html + renderScripts(),
  })
}

interface HtmlTemplateParams {
  HEAD: string
  APP: string
}
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
  `
}
