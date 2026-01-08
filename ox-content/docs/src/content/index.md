---
title: chibinuxt
description: Build Your Own Nuxt - Understand Nuxt internals by building it from scratch
---

# chibinuxt

**Build Your Own Nuxt**

![chibinuxt](/public/image.png)

---

## Overview

chibinuxt is a hands-on guide to understanding Nuxt internals by building it from scratch. Learn how Vue SSR, Nitro, Vite, and the module system work together.

### Why Build Your Own Nuxt?

- **Deep Understanding** - Go beyond the documentation and truly understand how Nuxt works
- **Better Debugging** - Know where to look when things go wrong
- **Contribution Ready** - Confidently contribute to Nuxt ecosystem

### What You'll Learn

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

## Getting Started

To start building your own Nuxt, begin with the minimum SSR example:

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

Each chapter builds on the previous one, progressively adding features until you have a working Nuxt-like framework.

## Features Covered

- **Nitro** - Learn the basics of SSR, SFC, and routing
- **Vite** - Implement HMR and Dev Server integration
- **Nuxt Modules** - Explore how the module system works

## Quick Links

- [01 Minimum SSR](./010-min-ssr.md) - Start here
- [GitHub](https://github.com/shoma-mano/chibinuxt) - Source code and implementations

## License

MIT License - Free for personal and commercial use.
