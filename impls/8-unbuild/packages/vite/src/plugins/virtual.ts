import type { Plugin } from 'vite'

const PREFIX = 'virtual:nuxt:'

export function virtual(vfs: Record<string, string>): Plugin {
  return {
    name: 'virtual',

    resolveId(id) {
      if (id in vfs) {
        return PREFIX + id
      }
      return null
    },

    load(id) {
      if (!id.startsWith(PREFIX)) {
        return null
      }
      const idNoPrefix = id.slice(PREFIX.length)
      if (idNoPrefix in vfs) {
        return {
          code: vfs[idNoPrefix],
          map: null,
        }
      }
    },
  }
}
