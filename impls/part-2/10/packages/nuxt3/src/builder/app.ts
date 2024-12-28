import { resolve } from 'node:path'
import defu from 'defu'
import type { Nuxt } from '../core'
import type { NuxtRoute } from './pages'
import { resolvePagesRoutes } from './pages'
import type { NuxtPlugin } from './plugins'
import { resolvePlugins } from './plugins'

export interface NuxtApp {
  main?: string
  routes: NuxtRoute[]
  dir: string
  extensions: string[]
  plugins: NuxtPlugin[]
  templates: Record<string, string>
  pages?: {
    dir: string
  }
}

// Scan project structure
export async function createApp(
  nuxt: Nuxt,
  options: Partial<NuxtApp> = {},
): Promise<NuxtApp> {
  // Create base app object
  const app: NuxtApp = defu(options, {
    dir: nuxt.options.srcDir,
    extensions: nuxt.options.extensions,
    routes: [],
    plugins: [],
    templates: {},
    pages: {
      dir: 'pages',
    },
  })

  // Resolve app.main
  if (!app.main) {
    app.main
      = nuxt.resolver.tryResolvePath('~/App')
      || nuxt.resolver.tryResolvePath('~/app')
  }

  // Resolve pages/
  if (app.pages) {
    app.routes.push(...(await resolvePagesRoutes(nuxt, app)))
  }
  if (app.routes.length) {
    // Add 404 page is not added
    const page404 = app.routes.find(route => route.name === '404')
    if (!page404) {
      app.routes.push({
        name: '404',
        path: '/:catchAll(.*)*',
        file: resolve(nuxt.options.appDir, 'pages/404.vue'),
        children: [],
      })
    }
  }

  // Fallback app.main
  if (!app.main && app.routes.length) {
    app.main = resolve(nuxt.options.appDir, 'app.pages.vue')
  }
  else if (!app.main) {
    app.main = resolve(nuxt.options.appDir, 'app.tutorial.vue')
  }

  // Resolve plugins/
  app.plugins = await resolvePlugins(nuxt, app)

  return app
}
