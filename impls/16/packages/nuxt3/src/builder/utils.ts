import { resolve } from 'node:path'
import globby from 'globby'
import type { Builder } from './builder'

// TODO: move to core resolver
export async function resolveFiles(builder: Builder, pattern: string, srcDir: string) {
  const { nuxt } = builder

  return builder.ignore.filter(await globby(pattern, {
    cwd: srcDir,
    followSymbolicLinks: nuxt.options.build.followSymlinks,
  })).map(p => resolve(srcDir, p))
}
