import { createServer } from 'node:http'
import { createApp, toNodeListener } from 'h3'
import type { Nitro } from 'nitro/types'

export const createDevServer = (nitro: Nitro) => {
  const app = createApp()

  const listen = async () => {
    // Register dev handlers (middlewares like Vite)
    for (const { route, handler } of nitro.options.devHandlers) {
      if (route) {
        app.use(route, handler)
      } else {
        app.use(handler)
      }
    }

    // Register renderer for SSR
    if (nitro.options.renderer) {
      const renderer = await import(nitro.options.renderer).then(m => m.default)
      app.use(renderer)
    }

    const server = createServer(toNodeListener(app))
    server.listen(3030, () => {
      console.log('Dev server is running on http://localhost:3030')
    })
  }

  return { listen }
}
