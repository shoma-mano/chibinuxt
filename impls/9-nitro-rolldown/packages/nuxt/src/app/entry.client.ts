import { createSSRApp } from 'vue'
import { createRouter } from './plugins/router'
// @ts-expect-error virtual module
import App from '#app'

const initApp = async () => {
  const router = createRouter()
  const app = createSSRApp(App)
  app.use(router)
  await router.isReady()
  app.mount('#__nuxt')
}
initApp().catch(console.error)
