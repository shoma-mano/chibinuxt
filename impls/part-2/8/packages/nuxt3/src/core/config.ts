import defu from 'defu'

export function getConfig(_options: any) {
  // Prevent duplicate calls
  if ('__normalized__' in _options) {
    return _options
  }

  return normalizeConfig(_options)
}

const normalizeConfig = (config: any): NuxtConfiguration => {
  const createRequire = require('create-require')
  config.createRequire = module => createRequire(module.filename)

  config = defu(config, {
    rootDir: '/Users/mano/playground/nuxts/nuxt/books/0/playground',
    dev: true,
    __normalized__: true,
    globalName: 'nuxt',
    _majorVersion: 3,
    env: {},
    srcDir: '/Users/mano/playground/nuxts/nuxt/books/0/playground',
    buildDir: '/Users/mano/playground/nuxts/nuxt/books/0/playground/.nuxt',
    modulesDir: [
      '/Users/mano/playground/nuxts/nuxt/books/0/playground/node_modules',
      '/Users/mano/playground/nuxts/nuxt/books/0/node_modules',
      '/Users/mano/playground/nuxts/nuxt/books/node_modules',
      '/Users/mano/playground/nuxts/nuxt/node_modules',
      '/Users/mano/playground/nuxts/node_modules',
      '/Users/mano/playground/node_modules',
      '/Users/mano/node_modules',
      '/Users/node_modules',
      '/node_modules',
    ],
    appDir: '/Users/mano/playground/nuxts/nuxt/books/0/packages/nuxt3/dist/app',
    dir: {
      assets: 'assets',
      app: 'app',
      layouts: 'layouts',
      middleware: 'middleware',
      pages: 'pages',
      static: 'static',
      store: 'store',
    },
    extensions: ['js', 'mjs', 'ts', 'tsx', 'vue', 'jsx'],
    ignore: ['**/*.test.*', '**/*.spec.*', '_*'],
    build: {
      _publicPath: '/_nuxt/',
      additionalExtensions: [],
      aggressiveCodeRemoval: false,
      analyze: false,
      babel: {
        configFile: false,
        babelrc: false,
        cacheDirectory: true,
      },
      cache: false,
      corejs: undefined,
      crossorigin: undefined,
      cssSourceMap: true,
      devMiddleware: {},
      devtools: undefined,
      extend: null,
      extractCSS: false,
      followSymlinks: false,
      friendlyErrors: true,
      hardSource: false,
      hotMiddleware: {},
      html: {
        minify: {
          collapseBooleanAttributes: true,
          decodeEntities: true,
          minifyCSS: true,
          minifyJS: true,
          processConditionalComments: true,
          removeEmptyAttributes: true,
          removeRedundantAttributes: true,
          trimCustomFragments: true,
          useShortDoctype: true,
        },
      },
      indicator: false,
      loadingScreen: false,
      optimizeCSS: false,
      optimization: {
        minimize: false,
        minimizer: undefined,
        splitChunks: {
          chunks: 'all',
          name: undefined,
          cacheGroups: {
            default: {
              name: undefined,
            },
          },
        },
      },
      parallel: false,
      plugins: [],
      postcss: {
        preset: {
          stage: 2,
        },
      },
      profile: false,
      publicPath: '/_nuxt/',
      quiet: false,
      serverURLPolyfill: 'url',
      splitChunks: {
        layouts: false,
        pages: true,
        commons: true,
      },
      ssr: true,
      standalone: false,
      stats: {
        excludeAssets: [
          /.map$/,
          /index\..+\.html$/,
          /vue-ssr-(client|modern)-manifest.json/,
        ],
      },
      styleResources: {},
      template: undefined,
      templates: [],
      terser: {},
      transpile: ['app'],
      warningIgnoreFilters: [],
      watch: [],
    },
    router: {
      base: '/',
    },
    generate: {
      dir: '/Users/mano/playground/nuxts/nuxt/books/0/playground/dist',
      staticAssets: {
        base: '/_nuxt/static',
        dir: 'static',
      },
    },
  })
  return config
}

export interface NuxtConfiguration {
  rootDir: string
  __normalized__: boolean
  dev: boolean
  globalName: string
  _majorVersion: number
  env: Record<string, any>
  createRequire: Function
  srcDir: string
  buildDir: string
  modulesDir: string[]
  appDir: string
  dir: {
    assets: string
    app: string
    layouts: string
    middleware: string
    pages: string
    static: string
    store: string
  }
  extensions: string[]
  ignore: string[]
  build: {
    _publicPath: string
    additionalExtensions: string[]
    aggressiveCodeRemoval: boolean
    analyze: boolean
    babel: {
      configFile: boolean
      babelrc: boolean
      cacheDirectory: boolean
    }
    cache: boolean
    corejs?: any
    crossorigin?: any
    cssSourceMap: boolean
    devMiddleware: Record<string, any>
    devtools?: any
    extend: any
    extractCSS: boolean
    filenames: {
      app: Function
      chunk: Function
      css: Function
      img: Function
      font: Function
      video: Function
    }
    followSymlinks: boolean
    friendlyErrors: boolean
    hardSource: boolean
    hotMiddleware: Record<string, any>
    html: {
      minify: {
        collapseBooleanAttributes: boolean
        decodeEntities: boolean
        minifyCSS: boolean
        minifyJS: boolean
        processConditionalComments: boolean
        removeEmptyAttributes: boolean
        removeRedundantAttributes: boolean
        trimCustomFragments: boolean
        useShortDoctype: boolean
      }
    }
    indicator: boolean
    loaders: {
      file: Record<string, any>
      fontUrl: {
        limit: number
      }
      imgUrl: {
        limit: number
      }
      pugPlain: Record<string, any>
      vue: {
        transformAssetUrls: {
          video: string
          source: string
          object: string
          embed: string
        }
      }
      css: {
        esModule: boolean
        sourceMap: boolean
      }
      cssModules: {
        esModule: boolean
        modules: {
          localIdentName: string
        }
        sourceMap: boolean
      }
      less: {
        sourceMap: boolean
      }
      sass: {
        sassOptions: {
          indentedSyntax: boolean
        }
        sourceMap: boolean
      }
      scss: {
        sourceMap: boolean
      }
      stylus: {
        sourceMap: boolean
      }
      vueStyle: {
        sourceMap: boolean
      }
    }
    loadingScreen: boolean
    optimizeCSS: boolean
    optimization: {
      minimize: boolean
      minimizer?: any
      splitChunks: {
        chunks: string
        name?: any
        cacheGroups: {
          default: {
            name?: any
          }
        }
      }
    }
    parallel: boolean
    plugins: any[]
    postcss: {
      preset: {
        stage: number
      }
    }
    profile: boolean
    publicPath: string
    quiet: boolean
    serverURLPolyfill: string
    splitChunks: {
      layouts: boolean
      pages: boolean
      commons: boolean
    }
    ssr: boolean
    standalone: boolean
    stats: {
      excludeAssets: (RegExp | string)[]
    }
    styleResources: Record<string, any>
    template?: any
    templates: any[]
    terser: Record<string, any>
    transpile: string[]
    warningIgnoreFilters: any[]
    watch: any[]
  }
  router: {
    base: string
  }
  generate: {
    dir: string
    staticAssets: {
      base: string
      dir: string
    }
  }
}
