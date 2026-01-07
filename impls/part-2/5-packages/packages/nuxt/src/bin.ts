#!/usr/bin/env bun
import { loadNuxt } from './core/nuxt'

const main = async () => {
  const nuxt = await loadNuxt()
  nuxt.server.listen()
}
main().catch(console.error)
