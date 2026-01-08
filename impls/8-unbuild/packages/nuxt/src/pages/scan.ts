import { readdir } from 'node:fs/promises'
import { join, parse } from 'node:path'

export interface NuxtPage {
  name: string
  path: string
  file: string
}

export async function scanPages(pagesDir: string): Promise<NuxtPage[]> {
  const files = await readdir(pagesDir)
  const pages: NuxtPage[] = []

  for (const file of files) {
    const { name, ext } = parse(file)
    if (ext !== '.vue') continue

    const routePath = name === 'index' ? '/' : `/${name}`
    pages.push({
      name,
      path: routePath,
      file: join(pagesDir, file),
    })
  }

  return pages
}

export function generateRoutesCode(pages: NuxtPage[]): string {
  const imports = pages
    .map((page, i) => `import Page${i} from '${page.file}'`)
    .join('\n')

  const routes = pages
    .map((page, i) => `  { name: '${page.name}', path: '${page.path}', component: Page${i} }`)
    .join(',\n')

  return `${imports}

export default [
${routes}
]`
}
