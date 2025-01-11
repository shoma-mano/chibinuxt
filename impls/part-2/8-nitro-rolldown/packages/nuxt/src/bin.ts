#!/usr/bin/env -S npx tsx

import { loadNuxt } from './core/nuxt'

const main = async () => {
  const nuxt = await loadNuxt()
  nuxt.server.listen()
}
main().catch(console.error)
