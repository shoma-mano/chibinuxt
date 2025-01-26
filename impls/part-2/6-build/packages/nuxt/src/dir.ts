import { dirname, join } from 'node:path'

let _distDir = join(import.meta.dirname)
if (_distDir.match(/(chunks|shared)$/)) {
  _distDir = dirname(_distDir)
}
export const distDir = _distDir
