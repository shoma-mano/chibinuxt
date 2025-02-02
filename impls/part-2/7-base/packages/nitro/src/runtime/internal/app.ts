import { createApp } from 'h3'
import type { NitroApp } from 'nitro/types'

function createNitroApp(): NitroApp {
  const h3App = createApp()
  return { h3App }
}

export const nitroApp: NitroApp = createNitroApp()

export const useNitroApp = () => nitroApp
