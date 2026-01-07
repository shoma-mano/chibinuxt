import { createApp, createRouter } from 'h3'
import type { NitroApp } from 'nitro/types'
import { handlers } from '#nitro-internal-virtual/server-handlers'

function createNitroApp(): NitroApp {
  const h3App = createApp()
  const router = createRouter()
  console.log('handlers', handlers)
  handlers.forEach(({ route, handler }) => {
    router.use(route, handler)
  })
  h3App.use(router)

  return { h3App }
}

export const nitroApp: NitroApp = createNitroApp()

export const useNitroApp = () => nitroApp
