import { join, dirname } from 'node:path'
import { writeFile } from 'node:fs/promises'
import { existsSync, mkdirSync } from 'node:fs'
import type { Nuxt } from '../core'
import type { NuxtApp } from './app'

export interface NuxtTemplate {
  fileName: string // Relative path of destination
  getContents?: (data: {
    globals: any
    app: any
    nuxtOptions: any
    nxt: any
  }) => string
  data?: any
}

export function templateData(nuxt: Nuxt, app: NuxtApp) {
  return {
    app,
    nuxtOptions: nuxt.options,
  } as any
}

async function compileTemplate(
  { fileName, data, getContents }: NuxtTemplate,
  destDir: string,
) {
  const compiledSrc = getContents ? getContents(data) : ''
  const dest = join(destDir, fileName)
  const isDirectoryExist = existsSync(dirname(dest))
  if (!isDirectoryExist) {
    console.log('Creating directory', dirname(dest))
    mkdirSync(dirname(dest), { recursive: true })
  }
  console.log('dest', dest, 'destDir', dirname(dest))
  await writeFile(dest, compiledSrc).catch()
}

export async function compileTemplates(
  templates: NuxtTemplate[],
  destDir: string,
) {
  // chain promises
  await templates.reduce(async (ac, cu) => {
    return ac.then(() => compileTemplate(cu, destDir))
  }, Promise.resolve())
}

export function watchTemplate(
  template: NuxtTemplate,
  _watcher: any,
  _cb: Function,
) {
  template.data = new Proxy(template.data, {
    // TODO: deep watch option changes
  })
  // TODO: Watch fs changes
}
