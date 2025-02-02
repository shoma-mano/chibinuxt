import { defineConfig, type RolldownOptions, type Plugin } from 'rolldown'
import type { Nitro } from 'nitro/types'
import * as unenv from 'unenv'
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
      'vue-bundle-renderer/runtime',
      'vue/server-renderer',
      ...env.external,
    ],
    plugins: [],
    define: {
      __VUE_OPTIONS_API__: 'true',
    },
  }) as _RolldownOptions

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
