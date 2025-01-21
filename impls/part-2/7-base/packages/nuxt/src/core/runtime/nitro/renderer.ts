import { join } from 'node:path'
import { defineRenderer } from 'nitro/runtime'
import { createRenderer } from 'vue-bundle-renderer/runtime'
import { renderToString } from 'vue/server-renderer'
import type { Nuxt } from '../../nuxt'

let renderer: ReturnType<typeof createRenderer>
const getRenderer = async (nuxt: Nuxt) => {
  if (renderer) return renderer
  const createApp = await import(
    join(nuxt.options!.appDir!, 'entry.server.js')
  ).then(m => m.default)
  renderer = createRenderer(createApp, {
    renderToString,
    manifest: {},
  })
  return renderer
}

export const setupRenderer = async (nuxt: Nuxt) => {
  defineRenderer(async event => {
    const renderer = await getRenderer(nuxt)
    const { req, res } = event.node
    const rendered = await renderer.renderToString({ url: req.url })
    const data = renderHTML(rendered)
    res.setHeader('Content-Type', 'text/html;charset=UTF-8')
    res.end(data, 'utf-8')
  })
}

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
