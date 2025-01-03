import { createSSRApp } from 'vue'
import App from '../../../../playground/App.vue'
import { createRouter } from '../pages/router'

export default async (ctx: { url: string }) => {
  const app = createSSRApp(App)
  const router = createRouter()
  router.push(ctx.url)
  await router.isReady()
  app.use(router)
  return app
}
