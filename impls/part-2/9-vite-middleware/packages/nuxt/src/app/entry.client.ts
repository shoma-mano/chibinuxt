import { createSSRApp } from 'vue'
import App from '../../../../playground/App.vue'
import { createRouter } from './plugins/router'

const initApp = async () => {
  const router = createRouter()
  const app = createSSRApp(App)
  app.use(router)
  await router.isReady()
  app.mount('#__nuxt')
}
initApp().catch(console.error)
