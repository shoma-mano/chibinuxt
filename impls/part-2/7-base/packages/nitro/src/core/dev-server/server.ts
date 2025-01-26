import { createServer } from 'node:http'
import { toNodeListener } from 'h3'
import type { Nitro } from '../../types/nitro'
import { useNitroApp } from '../../runtime/internal/app'

// we don't use nitro for now
export const createDevServer = async (nitro: Nitro) => {
  const listen = async () => {
    const app = useNitroApp().h3App
    const renderer = await import(nitro.options.renderer!).then(m => m.default)
    app.use(renderer)
    const server = createServer(toNodeListener(app))
    server.listen(3030, () => {
      console.log('Server is running on http://localhost:3030')
    })
  }
  return { listen }
}
