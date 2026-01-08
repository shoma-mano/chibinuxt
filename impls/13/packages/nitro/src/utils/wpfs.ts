import { join } from 'node:path'
import fsExtra from 'node:fs'

// @ts-ignore
export const wpfs = {
  // @ts-ignore
  ...(fsExtra as any),
  // @ts-ignore
  join: join as any,
}
