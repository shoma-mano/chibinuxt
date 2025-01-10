import type { DeepPartial } from './utils'

export interface Nitro {
  options: NitroOptions
}

export interface NitroOptions {
  entry: string
}
export interface NitroConfig extends DeepPartial<NitroOptions> {}
