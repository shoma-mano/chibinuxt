import { createSSRApp } from 'vue'
import { createRouter } from './plugins/router'
// @ts-expect-error virtual module
import App from '#app'

export default async (ctx: { url: string }) => {
  const app = createSSRApp(App)
  const router = createRouter()
  router.push(ctx.url)
  await router.isReady()
  app.use(router)
  return app
}
