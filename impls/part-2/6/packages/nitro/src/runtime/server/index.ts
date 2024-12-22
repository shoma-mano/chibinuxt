import { createApp, defineEventHandler, toNodeListener } from 'h3'
import { renderMiddleware } from '../app/render'
// @ts-ignore
import serverMiddleware from '~serverMiddleware'

const app = createApp({
  onError: () => 'error',
})

serverMiddleware.forEach((m) => {
  console.log('m.route', m.route)
  app.use(m.route, defineEventHandler(() => {}))
})
app.use(defineEventHandler(() => {
  console.log('not found in serverMiddleware')
}))
app.use(renderMiddleware)

export const handle = toNodeListener(app)
