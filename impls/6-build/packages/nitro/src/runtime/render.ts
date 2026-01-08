import { join } from 'node:path'
import { readFileSync } from 'node:fs'
import { defineEventHandler } from 'h3'
import type { H3Event } from 'h3'

let renderer: RenderHandler
type RenderHandler = (event: H3Event) => Promise<void>
export const defineRenderHandler = async (_renderer: RenderHandler) => {
  renderer = _renderer
}

export const renderMiddleware = defineEventHandler(async event => {
  const { req, res } = event.node
  if (req.url === '/entry.client.js') {
    // temporary specified environment variable
    const code = readFileSync(
      join(process.env.APP_DIST_DIR!, 'entry.client.js'),
      'utf-8',
    )
    res.setHeader('Content-Type', 'application/javascript')
    res.end(code)
  }
  await renderer(event)
})
