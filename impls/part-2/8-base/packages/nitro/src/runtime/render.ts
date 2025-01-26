import { join } from 'node:path'
import { readFileSync } from 'node:fs'
import { eventHandler } from 'h3'
import type { H3Event } from 'h3'

let renderer: Renderer
type Renderer = (event: H3Event) => Promise<void>
export const defineRenderer = async (_renderer: Renderer) => {
  renderer = _renderer
}

export const renderMiddleware = eventHandler(async event => {
  const { req, res } = event.node
  if (req.url === '/entry.client.js') {
    const code = readFileSync(
      join(process.env.APP_DIST_DIR!, 'entry.client.js'),
      'utf-8',
    )
    res.setHeader('Content-Type', 'application/javascript')
    res.end(code)
  }
  await renderer(event)
})
