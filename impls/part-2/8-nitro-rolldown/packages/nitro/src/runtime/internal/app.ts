import { createApp } from 'h3'
import type { NitroApp } from '../../types/runtime/nitro'
// @ts-expect-error - Nitro internal virtual module
import { handlers } from '#nitro-internal-virtual/server-handlers'

function createNitroApp(): NitroApp {
  const h3App = createApp()
  console.log('Nitro handlers:', handlers)
  return { h3App }
}

export const nitroApp: NitroApp = createNitroApp()

export const useNitroApp = () => nitroApp
