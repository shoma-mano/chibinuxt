---
title: chibinuxt
description: Build Your Own Nuxt - Understand Nuxt internals by building it from scratch
---

# chibinuxt

**Build Your Own Nuxt**

Understand Nuxt internals by building it from scratch

---

## Features

| | |
|---|---|
| ![Nitro](/public/satake-ken.png) **Nitro** | Learn the basics of SSR, SFC, and routing |
| ![Vite](/public/satake-risu.png) **Vite** | Implement HMR and Dev Server integration |
| ![Modules](/public/satake-nezumi.png) **Nuxt Modules** | Explore how the module system works |

---

## Getting Started

Create a minimal Vue SSR app in just a few lines:

**main.ts**

```ts
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

**render.ts**

```ts
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

---

## What You'll Learn

Through this book, you'll implement:

| Chapter | Topic | What You'll Build |
|---------|-------|-------------------|
| 01 | Minimum SSR | Basic Vue SSR with h3 |
| 02 | Server SFC | Compile Vue SFC on server |
| 03 | Client SFC | Hydration and client-side rendering |
| 04 | Router | File-based routing |
| 05 | Packages | Split into nuxt-like packages |
| 06 | Root Component | App.vue and layouts |
| 07 | Pages | pages/ directory convention |
| 08 | Unbuild | Build with unbuild |

Each chapter builds on the previous one, progressively adding features until you have a working Nuxt-like framework.
