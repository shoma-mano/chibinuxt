import type { Nuxt } from '../core'
import { clearDirectory } from '../utils/fs-utils'
import { templateData, compileTemplates } from './template'
import { createApp } from './app'
import * as defaultTemplates from './templates'
import { bundle } from './vite/vite'

export async function build(nuxt: Nuxt) {
  await clearDirectory(nuxt.options.buildDir)
  await generate(nuxt)

  await bundle(nuxt)

  await nuxt.hooks.callHook('build:done')
}

export async function generate(nuxt: Nuxt) {
  const app = await createApp(nuxt)
  const data = templateData(nuxt, app)
  const templates = Object.values(defaultTemplates).map(t => ({
    ...t,
    data,
  }))

  await compileTemplates(templates, nuxt.options.buildDir)
}
