import { createSSRApp, nextTick } from 'vue'
// @ts-ignore replaced by vite alias
import { createNuxt, applyPlugins } from '#app/nuxt'
// @ts-ignore replaced by vite alias
import plugins from '#app/plugins'
// @ts-ignore replaced by vite alias
import App from '#root/app.vue'

async function initApp() {
  const app = createSSRApp(App)

  const nuxt = createNuxt({ app })

  await applyPlugins(nuxt, plugins)

  // @ts-ignore
  await app.$nuxt.hooks.callHook('app:created', app)
  // @ts-ignore
  await app.$nuxt.hooks.callHook('app:beforeMount', app)

  app.mount('#__nuxt')

  // @ts-ignore
  await app.$nuxt.hooks.callHook('app:mounted', app)
  await nextTick()
  nuxt.isHydrating = false
}

initApp().catch((error) => {
  console.error('Error while mounting app:', error)
})
