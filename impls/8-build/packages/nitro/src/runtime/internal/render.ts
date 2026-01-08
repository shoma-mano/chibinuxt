import { eventHandler } from 'h3'
import type { RenderHandler } from '../../types'

export function defineRenderHandler(handler: RenderHandler) {
  return eventHandler(async event => {
    const response = await handler(event)
    return response.body
  })
}
