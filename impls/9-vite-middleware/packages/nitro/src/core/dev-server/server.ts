import { createServer } from 'node:http'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
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

    // Load renderer from built nitro output
    const serverDir = resolve(nitro.options.output!.serverDir!)
    const entryPath = pathToFileURL(join(serverDir, 'index.js')).href
    const nitroEntry = await import(entryPath)
    const nitroApp = nitroEntry.useNitroApp()
    app.use(nitroApp.h3App)

    const server = createServer(toNodeListener(app))
    server.listen(3030, () => {
      console.log('Dev server is running on http://localhost:3030')
    })
  }

  return { listen }
}
