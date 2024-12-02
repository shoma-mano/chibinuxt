import { join, relative, dirname } from 'path'
import { get } from 'http'
import fsExtra from 'fs-extra'
import globby from 'globby'
import lodashTemplate from 'lodash/template'
import * as nxt from './nxt'

export interface NuxtTemplate {
  src?: string // Absolute path to source file
  fileName: string // Relative path of destination
  getContents?: (data: {
    globals: any;
    app: any;
    nuxtOptions: any;
    nxt: any
}) => string
  data?: any
}

export function templateData (builder) {
  return {
    globals: builder.globals,
    app: builder.app,
    nuxtOptions: builder.nuxt.options,
    nxt
  }
}

async function compileTemplate ({ src, fileName, data, getContents }: NuxtTemplate, destDir: string) {
  const compiledSrc = getContents ? getContents(data) : ''
  const dest = join(destDir, fileName)
  await fsExtra.mkdirp(dirname(dest))
  await fsExtra.writeFile(dest, compiledSrc)
}

export function compileTemplates (templates: NuxtTemplate[], destDir: string) {
  return Promise.all(templates.map((t) => {
    return compileTemplate(t, destDir)
  }))
}

// export async function scanTemplates (dir: string, data?: Object) {
//   const templateFiles = (await globby(join(dir, '/**')))

//   return templateFiles.map(src => ({
//     src,
//     path: relative(dir, src),
//     data
//   }))
// }

export function watchTemplate (template: NuxtTemplate, _watcher: any, _cb: Function) {
  template.data = new Proxy(template.data, {
    // TODO: deep watch option changes
  })
  // TODO: Watch fs changes
}
