#!/usr/bin/env node
import { loadNuxt } from './core/nuxt'

const main = async () => {
  const nuxt = await loadNuxt()
  nuxt.server.listen()
}
main().catch(console.error)
