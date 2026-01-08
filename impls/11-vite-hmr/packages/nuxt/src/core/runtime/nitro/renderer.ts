import { join } from 'node:path'
import { defineEventHandler } from 'h3'
import { createRenderer } from 'vue-bundle-renderer/runtime'
import { renderToString } from 'vue/server-renderer'

const distDir = process.env.DIST_DIR!

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

export default defineEventHandler(async (event) => {
  const renderer = await getRenderer()
  const rendered = await renderer.renderToString({ url: event.path })
  const body = renderHTML(rendered)
  return body
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
  // In dev mode, use Vite's client entry path
  // distDir is packages/nuxt/dist, we need packages/nuxt/src/app
  const clientEntry = '/@fs' + join(distDir, '../src/app/entry.client.ts')

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <script type="module" src="/@vite/client"></script>
    ${renderResourceHints()}
    ${renderStyles()}
  </head>
  <body>
    <div id="__nuxt">${html}${renderScripts()}</div>
    <script type="module" src="${clientEntry}"></script>
  </body>
  </html>
  `
}
