import { NuxtTemplate } from "./template";

export const entryClientTemplate: NuxtTemplate = {
  fileName: "entry.client.js",
  getContents: ({ app, globals, nuxtOptions }) =>
    `
import { createSSRApp, nextTick } from 'vue'
import { createNuxt, applyPlugins } from 'nuxt/app/nuxt'
import plugins from './plugins'
import App from '${app.main}'
  
async function initApp () {
  const app = createSSRApp(App)
  
  const nuxt = createNuxt({ app })
  
  console.log('plugins', plugins)
  await applyPlugins(nuxt, plugins)
  
  await app.$nuxt.hooks.callHook('app:created', app)
  await app.$nuxt.hooks.callHook('app:beforeMount', app)
  
  app.mount('#__nuxt')
  
  await app.$nuxt.hooks.callHook('app:mounted', app)
  await nextTick()
  nuxt.isHydrating = false
}
  
initApp().catch((error) => {
  console.error('Error while mounting app:', error) // eslint-disable-line no-console
})`,
};

export const entryServerTemplate: NuxtTemplate = {
  fileName: "entry.server.js",
  getContents: ({ app }) => `import { createApp } from 'vue'
import { createNuxt, applyPlugins } from 'nuxt/app/nuxt'
import plugins from './plugins'
import App from '${app.main}'

export default async function createNuxtAppServer (ssrContext = {}) {
   const app = createApp(App)
   
   const nuxt = createNuxt({ app, ssrContext })
   
   console.log('plugins', plugins)  
   await applyPlugins(nuxt, plugins)
   
   await app.$nuxt.hooks.callHook('app:created', app)
   
   nuxt.hooks.hook('vue-renderer:done',
     () => nuxt.hooks.callHook('app:rendered', app)
   )
   
   return app
}`,
};

export const allPluginsTemplate: NuxtTemplate = {
  fileName: "plugins.js",
  getContents: () => `
    import head from 'nuxt/app/plugins/head'
    import router from 'nuxt/app/plugins/router'
    import legacy from 'nuxt/app/plugins/legacy'

    export default [
      head,
      router,
      legacy,
    ]
  `,
};

export const routesTemplate: NuxtTemplate = {
  fileName: "routes.js",
  getContents: ({ app, nxt }) => `
    export default ${nxt.serialize(app.routes.map(nxt.serializeRoute))}
  `,
};

export const htmlTemplate: NuxtTemplate = {
  fileName: "views/app.template.html",
  getContents: () => `
    <!DOCTYPE html>
    <html {{ HTML_ATTRS }}>
      <head {{ HEAD_ATTRS }}>
        {{ HEAD }}
      </head>
      <body {{ BODY_ATTRS }}>
        <div id="__nuxt">{{ APP }}</div>
        <script type="module" src="/@vite/client"></script>
        <script type="module" src="/entry.client.js"></script>
      </body>
    </html>
  `,
};

export const errorTemplate: NuxtTemplate = {
  fileName: "views/error.html",
  getContents: () => `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Server error</title>
      <meta charset="utf-8">
      <meta content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" name="viewport">
      <style>
        .__nuxt-error-page{padding: 1rem;background:#f7f8fb;color:#47494e;text-align:center;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;font-family:sans-serif;font-weight:100!important;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;-webkit-font-smoothing:antialiased;position:absolute;top:0;left:0;right:0;bottom:0}
        .__nuxt-error-page .error{max-width:450px}
        .__nuxt-error-page .title{font-size:24px;font-size:1.5rem;margin-top:15px;color:#47494e;margin-bottom:8px}
        .__nuxt-error-page .description{color:#7f828b;line-height:21px;margin-bottom:10px}
        .__nuxt-error-page a{color:#7f828b!important;text-decoration:none}
        .__nuxt-error-page .logo{position:fixed;left:12px;bottom:12px}
      </style>
    </head>
    <body>
      <div class="__nuxt-error-page">
        <div class="error">
          <svg xmlns="http://www.w3.org/2000/svg" width="90" height="90" fill="#DBE1EC" viewBox="0 0 48 48">
            <path d="M22 30h4v4h-4zm0-16h4v12h-4zm1.99-10C12.94 4 4 12.95 4 24s8.94 20 19.99 20S44 35.05 44 24 35.04 4 23.99 4zM24 40c-8.84 0-16-7.16-16-16S15.16 8 24 8s16 7.16 16 16-7.16 16-16 16z"/>
          </svg>
          <div class="title">Server error</div>
          <div class="description">{{ message }}</div>
        </div>
        <div class="logo">
          <a href="https://nuxtjs.org" target="_blank" rel="noopener">Nuxt.js</a>
        </div>
      </div>
    </body>
    </html>
  `,
};
