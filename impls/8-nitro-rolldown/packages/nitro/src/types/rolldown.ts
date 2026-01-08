export type VirtualModule = string | (() => string | Promise<string>)

export interface RolldownVirtualOptions {
  [id: string]: VirtualModule
}
