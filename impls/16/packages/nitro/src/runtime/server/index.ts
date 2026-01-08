import { createApp, useBase } from 'h3'

const app = createApp({
  onError: () => 'error',
})

app.use(() => import('../app/render').then(e => e.renderMiddleware), {
  lazy: true,
})

export const handle = useBase(process.env.ROUTER_BASE, app)
