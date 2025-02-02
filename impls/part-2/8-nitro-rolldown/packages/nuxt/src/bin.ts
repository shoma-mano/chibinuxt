#!/usr/bin/env node
import { loadNuxt } from './index.mjs'

const main = async () => {
  process.env.DIST_DIR = import.meta.dirname
  const nuxt = await loadNuxt()
  nuxt.server.listen()
}
main().catch(console.error)
