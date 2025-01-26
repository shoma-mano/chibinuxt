#!/usr/bin/env node
import { loadNuxt } from './'

const main = async () => {
  const nuxt = await loadNuxt()
  nuxt.server.listen()
}
main().catch(console.error)
