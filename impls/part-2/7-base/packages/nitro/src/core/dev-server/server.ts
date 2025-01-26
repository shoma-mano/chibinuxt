import { createServer } from 'node:http'
import { createApp, toNodeListener } from 'h3'
import { renderMiddleware } from '../../runtime/internal/render'
import type { Nitro } from '../../types/nitro'

// we don't use nitro for now
export const createDevServer = (nitro: Nitro) => {
  const listen = () => {
    const app = createApp()
    app.use(renderMiddleware)
    const server = createServer(toNodeListener(app))
    server.listen(3030, () => {
      console.log('Server is running on http://localhost:3030')
    })
  }
  return { listen }
}
