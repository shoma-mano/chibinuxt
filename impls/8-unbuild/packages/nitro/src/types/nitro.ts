import type { App, H3Event } from 'h3'

export interface Nitro {
  options: NitroOptions
}

export interface NitroOptions {
  renderer?: string
}

export interface NitroConfig {
  renderer?: string
}

export interface NitroApp {
  h3App: App
}

export interface RenderResponse {
  body?: string
  statusCode?: number
  statusMessage?: string
  headers?: Record<string, string>
}

export type RenderHandler = (event: H3Event) => Promise<RenderResponse>
