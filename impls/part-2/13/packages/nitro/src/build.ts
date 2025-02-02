import { resolve, join } from 'node:path'
import { cpSync, readFileSync } from 'node:fs'
import consola from 'consola'
import { rollup, watch as rollupWatch } from 'rollup'
import { printFSTree } from './utils/tree'
import { getRollupConfig } from './rollup/config'
import { prettyPath, serializeTemplate, writeFile, isDirectory } from './utils'
import type { NitroContext } from './context'
import { scanMiddleware } from './server/middleware'
import { clearDirectory } from './utils/fs-utils'

export async function prepare(nitroContext: NitroContext) {
  await cleanupDir(nitroContext.output.dir)

  if (!nitroContext.output.publicDir.startsWith(nitroContext.output.dir)) {
    await cleanupDir(nitroContext.output.publicDir)
  }

  if (!nitroContext.output.serverDir.startsWith(nitroContext.output.dir)) {
    await cleanupDir(nitroContext.output.serverDir)
  }
}

async function cleanupDir(dir: string) {
  consola.info('Cleaning up', prettyPath(dir))
  await clearDirectory(dir)
}

export async function generate(nitroContext: NitroContext) {
  consola.start('Generating public...')

  const clientDist = resolve(nitroContext._nuxt.buildDir, 'dist/client')
  cpSync(
    clientDist,
    join(nitroContext.output.publicDir, nitroContext._nuxt.publicPath),
    {
      recursive: true,
    },
  )

  const staticDir = resolve(
    nitroContext._nuxt.srcDir,
    nitroContext._nuxt.staticDir,
  )
  if (await isDirectory(staticDir)) {
    cpSync(staticDir, nitroContext.output.publicDir, {
      recursive: true,
    })
  }

  consola.success(
    'Generated public ' + prettyPath(nitroContext.output.publicDir),
  )
}

export async function build(nitroContext: NitroContext) {
  // Compile html template
  const htmlTemplate = {
    src: nitroContext.templatePath,
    contents: '',
    dst: '',
    compiled: '',
  }
  htmlTemplate.dst = htmlTemplate.src
    ?.replace(/.html$/, '.js')
    .replace('app.', 'document.')!
  htmlTemplate.contents = readFileSync(htmlTemplate.src!, 'utf-8')
  htmlTemplate.compiled
    = 'export default ' + serializeTemplate(htmlTemplate.contents)
  await nitroContext._internal.hooks.callHook(
    'nitro:template:document',
    htmlTemplate,
  )
  await writeFile(htmlTemplate.dst, htmlTemplate.compiled)

  nitroContext.rollupConfig = getRollupConfig(nitroContext)
  await nitroContext._internal.hooks.callHook(
    'nitro:rollup:before',
    nitroContext,
  )
  return nitroContext._nuxt.dev ? _watch(nitroContext) : _build(nitroContext)
}

async function _build(nitroContext: NitroContext) {
  nitroContext.scannedMiddleware = await scanMiddleware(
    nitroContext._nuxt.serverDir,
  )

  consola.start('Building server...')
  const build = await rollup(nitroContext.rollupConfig).catch((error) => {
    consola.error('Rollup error: ' + error.message)
    throw error
  })

  consola.start('Writing server bundle...')
  await build.write(nitroContext.rollupConfig.output)

  consola.success('Server built')
  await printFSTree(nitroContext.output.serverDir)
  await nitroContext._internal.hooks.callHook('nitro:compiled', nitroContext)

  return {
    entry: resolve(
      nitroContext.rollupConfig.output.dir,
      nitroContext.rollupConfig.output.entryFileNames,
    ),
  }
}

function startRollupWatcher(nitroContext: NitroContext) {
  const watcher = rollupWatch(nitroContext.rollupConfig)
  let start: any

  watcher.on('event', (event) => {
    switch (event.code) {
      // The watcher is (re)starting
      case 'START':
        return

      // Building an individual bundle
      case 'BUNDLE_START':
        start = Date.now()
        return

      // Finished building all bundles
      case 'END':
        nitroContext._internal.hooks.callHook('nitro:compiled', nitroContext)
        consola.success(
          'Nitro built',
          start ? `in ${Date.now() - start} ms` : '',
        )
        return

      // Encountered an error while bundling
      case 'ERROR':
        consola.error('Rollup error: ' + event.error)
      // consola.error(event.error)
    }
  })
  return watcher
}

async function _watch(nitroContext: NitroContext) {
  const watcher = startRollupWatcher(nitroContext)

  const deletes: string[] = []
  for (const key of deletes) {
    delete nitroContext[key as keyof typeof nitroContext]
  }

  // buildで使われている
  // _internal(hooksが使われている)

  // nitroContext.scannedMiddleware = await scanMiddleware(
  //   nitroContext._nuxt.serverDir,
  //   (middleware, event) => {
  //     nitroContext.scannedMiddleware = middleware;
  //     if (["add", "addDir"].includes(event)) {
  //       watcher.close();
  //       watcher = startRollupWatcher(nitroContext);
  //     }
  //   }
  // );
}
