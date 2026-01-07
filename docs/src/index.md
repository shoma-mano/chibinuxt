---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "chibinuxt"
  text: "Build Your Own Nuxt"
  tagline: "Understand Nuxt internals by building it from scratch"
  actions:
    - theme: brand
      text: Get Started
      link: /part-1/010-min-ssr
    - theme: alt
      text: GitHub
      link: https://github.com
  image:
    src: /image.png

features:
  - title: Nitro
    icon:
      src: /satake-ken.png
    details: Learn the basics of SSR, SFC, and routing
  - title: Vite
    icon:
      src: /satake-risu.png
    details: Implement HMR and Dev Server integration
  - title: Modules
    icon:
      src: /satake-nezumi.png
    details: Explore how the module system works
---

<style>
:root {
  --vp-home-hero-name-color: transparent !important;
  --vp-home-hero-name-background: linear-gradient(135deg, #00dc82 0%, #36e4da 50%, #0047e1 100%) !important;
  --vp-home-hero-image-background-image: linear-gradient(135deg, #00dc82 0%, #36e4da 50%, #0047e1 100%) !important;
  --vp-home-hero-image-filter: blur(44px) !important;
}

.image-bg {
  width: 280px !important;
  height: 280px !important;
}

.VPButton.brand {
  background: linear-gradient(135deg, #00dc82, #36e4da) !important;
  border: none !important;
  color: #1a1a2e !important;
  font-weight: 600 !important;
  transition: transform 0.2s, box-shadow 0.2s !important;
}

.VPButton.brand:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 20px rgba(0, 220, 130, 0.4) !important;
}

.VPButton.alt {
  border-color: #00dc82 !important;
  color: #00dc82 !important;
}

.dark .VPButton.alt {
  color: #36e4da !important;
  border-color: #36e4da !important;
}

.VPImage {
  max-height: 220px !important;
}

.VPFeature {
  transition: transform 0.2s, box-shadow 0.2s !important;
}

.VPFeature:hover {
  transform: translateY(-4px) !important;
  box-shadow: 0 8px 30px rgba(0, 220, 130, 0.15) !important;
}

.VPFeature .box {
  padding: 16px !important;
}

.VPFeature .title {
  margin-top: 0 !important;
  font-size: 18px !important;
}

#VPContent {
  margin-top: 15px;
  margin-bottom: 20px;
}

.VPHero {
  padding-top: 180px !important;
  margin-bottom: 15px;
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px) !important;
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(68px) !important;
  }
}

.getting-started {
  max-width: 1100px;
  margin: 60px auto;
  padding: 0 24px;
}

.getting-started h2 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #00dc82, #36e4da);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.getting-started p {
  color: var(--vp-c-text-2);
  margin-bottom: 20px;
}

.getting-started :deep(div[class*="language-"]) {
  border-radius: 8px;
}
</style>

<div class="getting-started">

## Getting Started

Create a minimal Vue SSR app in just a few lines:

::: code-group

```ts [main.ts]
import { createServer } from 'node:http'
import { createApp, toNodeListener } from 'h3'
import { renderMiddleware } from './render'

const app = createApp()
app.use(renderMiddleware)

const server = createServer(toNodeListener(app))
server.listen(3030, () => {
  console.log('Server listening on http://localhost:3030')
})
```

```ts [render.ts]
import { createRenderer } from 'vue-bundle-renderer/runtime'
import { renderToString } from 'vue/server-renderer'
import { h, createApp } from 'vue'
import { eventHandler } from 'h3'

const _createApp = () => {
  const app = createApp({
    render: () => h('p', 'hello world'),
  })
  return app
}

const renderer = createRenderer(_createApp, { renderToString })

export const renderMiddleware = eventHandler(async event => {
  const { res } = event.node
  const rendered = await renderer.renderToString({})
  const data = renderHTML(rendered)
  res.setHeader('Content-Type', 'text/html;charset=UTF-8')
  res.end(data, 'utf-8')
})
```

:::

</div>
