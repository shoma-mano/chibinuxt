import { dirname, isAbsolute, relative, resolve } from 'node:path'
import { cpSync, existsSync, mkdir, mkdirSync } from 'node:fs'
import type { Plugin } from 'rollup'
import { nodeFileTrace, type NodeFileTraceOptions } from '@vercel/nft'
import { normalizeid, resolvePath } from 'mlly'
import { isDirectory } from '../../utils'

export interface NodeExternalsOptions {
  ignore?: string[]
  outDir?: string
  trace?: boolean
  traceOptions?: NodeFileTraceOptions
  moduleDirectories?: string[]
}

export function externals(opts: NodeExternalsOptions): Plugin {
  const resolvedExternals = {}

  const _resolveCache = new Map()
  const _resolve = async (id: string): Promise<string> => {
    // console.log("resolving", id);
    if (id.startsWith('\0')) {
      return id
    }
    // let resolved = _resolveCache.get(id);
    // if (resolved) {
    //   return resolved;
    // }
    const resolved = await resolvePath(id, {
      url: [
        ...(opts.moduleDirectories || []),
        '/Users/mano/my-oss/nuxts/chibinuxt/impls/part-2/6/packages/nitro/node_modules',
      ],
    })

    // _resolveCache.set(id, resolved);
    return resolved
  }

  return {
    name: 'node-externals',
    async resolveId(originalId, importer, options) {
      // Internals
      if (originalId.startsWith('\x00') || originalId.includes('?')) {
        return null
      }

      // Resolve relative paths and exceptions
      if (
        originalId.startsWith('.')
        || opts.ignore!.find(i => originalId.startsWith(i))
      ) {
        return null
      }

      // Resolve id using rollup resolver
      const resolved = (await this.resolve(originalId, importer, options)) || {
        id: originalId,
      }

      if (!resolved.id) {
        console.log('resolved.id is null', originalId, importer, options)
      }

      if (
        !isAbsolute(resolved.id)
        || !existsSync(resolved.id)
        || (await isDirectory(resolved.id))
      ) {
        resolved.id = await _resolve(resolved.id).catch((err) => {
          return resolved.id
        })
      }

      return {
        ...resolved,
        id: isAbsolute(resolved.id) ? normalizeid(resolved.id) : resolved.id,
        external: true,
      }
    },
  }
}
