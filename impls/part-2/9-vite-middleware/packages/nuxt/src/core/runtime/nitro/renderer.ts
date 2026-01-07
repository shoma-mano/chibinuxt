import { join } from 'node:path'
import { readFileSync } from 'node:fs'
import { defineRenderHandler } from 'nitro/runtime'
import { createRenderer } from 'vue-bundle-renderer/runtime'
import { renderToString } from 'vue/server-renderer'

const distDir = process.env.DIST_DIR!
const isDev = !!process.env.NUXT_DEV

let renderer: ReturnType<typeof createRenderer>
const getRenderer = async () => {
  if (renderer) return renderer
  const createApp = await import(join(distDir, 'app', '_entry.server.js')).then(
    m => m.default,
  )
  renderer = createRenderer(createApp, {
    renderToString,
    manifest: {},
  })
  return renderer
}

export default defineRenderHandler(async event => {
  const { req, res } = event.node
  if (!isDev && req.url === '/entry.client.js') {
    const code = readFileSync(join(distDir, 'app', '_entry.client.js'), 'utf-8')
    res.setHeader('Content-Type', 'application/javascript')
    res.end(code)
    return { statusCode: 200, statusMessage: 'OK', headers: {} }
  }
  const renderer = await getRenderer()
  const rendered = await renderer.renderToString({ url: req.url })
  const body = renderHTML(rendered, isDev)
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
}: Rendered, isDev: boolean) {
  return htmlTemplate({
    HEAD: renderResourceHints() + renderStyles(),
    APP: html + renderScripts(),
    isDev,
  })
}

interface HtmlTemplateParams {
  HEAD: string
  APP: string
  isDev: boolean
}
function htmlTemplate({ HEAD, APP, isDev }: HtmlTemplateParams): string {
  // In dev mode, use Vite's client entry path
  const clientEntry = isDev
    ? '/@fs' + join(distDir, '../src/app/entry.client.ts')
    : '/entry.client.js'

  return `
  <!DOCTYPE html>
  <html>
  <head>
    ${isDev ? '<script type="module" src="/@vite/client"></script>' : ''}
    ${HEAD}
  </head>
  <body>
    <div id="__nuxt">${APP}</div>
    <script type="module" src="${clientEntry}"></script>
  </body>
  </html>
    `
}
