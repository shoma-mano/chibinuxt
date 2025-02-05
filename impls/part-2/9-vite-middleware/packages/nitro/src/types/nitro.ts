import type { NitroDevEventHandler } from './handlers'
import type { DeepPartial } from './utils'

export interface Nitro {
  options: NitroOptions
}

export interface NitroOptions {
  entry: string
  renderer?: string
  devHandlers: NitroDevEventHandler[]
  output?: {
    serverDir?: string
  }
}
export interface NitroConfig extends DeepPartial<NitroOptions> {
  preset?: string
}

export interface NitroPreset extends NitroConfig {
  name: string
}
