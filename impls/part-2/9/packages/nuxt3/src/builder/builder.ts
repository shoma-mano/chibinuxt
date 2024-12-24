import { relative } from 'node:path'
import fsExtra from 'fs-extra'
import type { Nuxt } from '../core'
import type { DeterminedGlobals } from '../utils'
import { determineGlobals } from '../utils'
import type {
  NuxtTemplate,
} from './template'
import {
  templateData,
  compileTemplates,
} from './template'
import type { NuxtApp } from './app'
import { createApp } from './app'
import Ignore from './ignore'
import * as defaultTemplates from './templates'

export class Builder {
  nuxt: Nuxt
  globals: DeterminedGlobals
  ignore: Ignore
  templates: NuxtTemplate[]
  app: NuxtApp

  constructor(nuxt) {
    this.nuxt = nuxt
    this.globals = determineGlobals(nuxt.options.globalName, nuxt.options.globals)
    console.log('globals', this.globals)
    this.ignore = new Ignore({
      rootDir: nuxt.options.srcDir,
      ignoreArray: nuxt.options.ignore.concat(
        relative(nuxt.options.rootDir, nuxt.options.buildDir),
      ),
    })
  }

  build() {
    return build(this)
  }

  close() {
    // TODO: close watchers
  }
}

// Extends VueRouter
async function build(builder: Builder) {
  const { nuxt } = builder

  await fsExtra.emptyDir(nuxt.options.buildDir)
  await generate(builder)

  await bundle(builder)

  await nuxt.hooks.callHook('build:done')
}

export async function generate(builder: Builder) {
  const { nuxt } = builder

  builder.app = await createApp(builder)
  // Todo: Call app:created hook

  const data = templateData(builder)
  const templates = Object.values(defaultTemplates).map(t => ({ ...t, data }))

  await compileTemplates(templates, nuxt.options.buildDir)
}

async function bundle({ nuxt }: Builder) {
  // @ts-ignore
  const bundle = await import('./vite/vite')
    .then(p => p.bundle)
  return bundle(nuxt)
}
