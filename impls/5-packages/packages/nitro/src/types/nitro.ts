import type { App as H3App } from 'h3'

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
  h3App: H3App
}
