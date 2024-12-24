import { createApp } from 'vue'
import App from './App.vue'
import { createRouter } from './router'

export default async (ctx: { url: string }) => {
  const app = createApp(App)
  const router = createRouter()
  router.push(ctx.url)
  await router.isReady()
  app.use(router)
  return app
}
