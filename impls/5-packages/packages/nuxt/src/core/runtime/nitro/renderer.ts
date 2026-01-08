import { join } from 'node:path'
import { readFileSync } from 'node:fs'
import { defineRenderHandler } from 'nitro/runtime'
import { createRenderer } from 'vue-bundle-renderer/runtime'
import { renderToString } from 'vue/server-renderer'
import { appDistDir } from '../../nuxt'

let renderer: ReturnType<typeof createRenderer>
const getRenderer = async () => {
  if (renderer) return renderer
  const createApp = await import(
    join(appDistDir!, 'entry.server.js')
  ).then(m => m.default)
  renderer = createRenderer(createApp, {
    renderToString,
    manifest: {},
  })
  return renderer
}

export default defineRenderHandler(async event => {
  const { req, res } = event.node
  if (req.url === '/entry.client.js') {
    const code = readFileSync(
      join(appDistDir!, 'entry.client.js'),
      'utf-8',
    )
    res.setHeader('Content-Type', 'application/javascript')
    res.end(code)
    return { statusCode: 200, statusMessage: 'OK', headers: {} }
  }
  const renderer = await getRenderer()
  const rendered = await renderer.renderToString({ url: req.url })
  const body = renderHTML(rendered)
  res.setHeader('Content-Type', 'text/html;charset=UTF-8')
  return {
    body,
  }
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
