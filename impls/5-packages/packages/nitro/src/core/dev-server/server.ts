import { createServer } from 'node:http'
import { toNodeListener } from 'h3'
import { useNitroApp } from '../../runtime/app'
import type { Nitro } from '../../types'

export const createDevServer = async (nitro: Nitro) => {
  const listen = async () => {
    const { h3App } = useNitroApp()
    const renderer = await import(nitro.options.renderer!).then(m => m.default)
    h3App.use(renderer)
    const server = createServer(toNodeListener(h3App))
    server.listen(3030, () => {
      console.log('Server is running on http://localhost:3030')
    })
  }
  return { listen }
}
