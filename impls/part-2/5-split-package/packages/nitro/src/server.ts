import { createServer } from 'node:http'
import { createApp, toNodeListener } from 'h3'
import { renderMiddleware } from './render'

export const getServer = () => {
  const app = createApp()
  app.use(renderMiddleware)

  const server = createServer(toNodeListener(app))
  return server
}
