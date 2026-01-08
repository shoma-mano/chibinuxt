#!/usr/bin/env node
import { loadNuxt } from './index.mjs'

const main = async () => {
  const nuxt = await loadNuxt()
  nuxt.server.listen()
}
main().catch(console.error)
