import { defineConfig, type RolldownOptions, type Plugin } from 'rolldown'
import type { Nitro } from 'nitro/types'
import * as unenv from 'unenv'
import { resolvePath, normalizeid } from 'mlly'
import { virtual } from './plugins/virtual'

export const getRolldownConfig = (nitro: Nitro) => {
  const env = unenv.env(unenv.node)

  type _RolldownOptions = Omit<RolldownOptions, 'plugins'> & {
    plugins: Plugin[]
  }
  const config = defineConfig({
    input: nitro.options.entry,
    external: [
      'node:http',
      'node:fs',
      'node:path',
      ...env.external,
    ],
    plugins: [],
    define: {
      __VUE_OPTIONS_API__: 'true',
    },
  }) as _RolldownOptions

  // externals (file:// URL で解決)
  // module名からパスに変換する事で、playground/.nitro/devからnitroのパッケージ内にあるモジュールを解決できるようにする
  const externalModules = ['vue-bundle-renderer/runtime', 'vue/server-renderer']
  config.plugins.push({
    name: 'nitro-externals',
    async resolveId(id) {
      if (externalModules.includes(id)) {
        const resolved = await resolvePath(id, { url: import.meta.url })
        return { id: normalizeid(resolved), external: true }
      }
    },
  })

  // handlers
  config.plugins.push(
    virtual({
      '#nitro-internal-virtual/server-handlers': () => {
        const handlers = [
          {
            route: '/**',
            handler: nitro.options.renderer,
          },
        ]
        return `
        import renderer from '${nitro.options.renderer}'

        export const handlers = [
          ${handlers.map(h => `{route: '${h.route}', handler: renderer}`).join(',')}
        ]
      `
      },
    }),
  )

  return config
}
