import { createSSRApp } from 'vue'
import App from '../../../playground/App.vue'
import { createRouter } from './router'

export default async (ctx: { url: string }) => {
  const app = createSSRApp(App)
  const router = createRouter()
  router.push(ctx.url)
  app.use(router)
  await router.isReady()
  return app
}
