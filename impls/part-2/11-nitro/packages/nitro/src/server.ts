import { createServer } from 'node:http'
import { createApp, toNodeListener } from 'h3'
import { renderMiddleware } from './render'

const app = createApp()
app.use(renderMiddleware)

const server = createServer(toNodeListener(app))
server.listen(3030, () => {
  console.log('Server is running on http://localhost:3030')
})
