import { resolve } from 'node:path'
import globby from 'globby'
import type { Nuxt } from '../core'

// TODO: move to core resolver
export async function resolveFiles(
  nuxt: Nuxt,
  pattern: string,
  srcDir: string,
) {
  return (
    await globby(pattern, {
      cwd: srcDir,
      followSymbolicLinks: nuxt.options.build.followSymlinks,
    })
  ).map(p => resolve(srcDir, p))
}
