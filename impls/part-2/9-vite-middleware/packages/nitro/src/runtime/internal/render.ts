import { eventHandler } from 'h3'
import type { H3Event } from 'h3'

export type RenderHandler = (
  event: H3Event,
) => Partial<RenderResponse> | Promise<Partial<RenderResponse>>
export interface RenderResponse {
  body: any
  statusCode: number
  statusMessage: string
  headers: Record<string, string>
}

export function defineRenderHandler(handler: RenderHandler) {
  return eventHandler(async event => {
    const response = await handler(event)
    return response.body
  })
}
