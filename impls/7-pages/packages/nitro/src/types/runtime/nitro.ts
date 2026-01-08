import type { App as H3App, H3Event } from 'h3'

export interface NitroApp {
  h3App: H3App
}

export interface RenderResponse {
  body: any
  statusCode: number
  statusMessage: string
  headers: Record<string, string>
}

export type RenderHandler = (
  event: H3Event,
) => Partial<RenderResponse> | Promise<Partial<RenderResponse>>
