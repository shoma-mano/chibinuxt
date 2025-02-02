import { readdirSync, readFileSync, rmdirSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'

export async function clearDirectory(directoryPath: string): Promise<void> {
  try {
    // ディレクトリ内のすべてのエントリを取得
    const entries = readdirSync(directoryPath, { withFileTypes: true })

    // エントリごとに削除
    for (const entry of entries) {
      const fullPath = join(directoryPath, entry.name)

      if (entry.isDirectory()) {
        // サブディレクトリの場合、再帰的に削除
        await clearDirectory(fullPath)
        // サブディレクトリ自体を削除
        rmdirSync(fullPath)
      }
      else {
        // ファイルの場合、削除
        unlinkSync(fullPath)
      }
    }
    console.log(
      `ディレクトリ '${directoryPath}' 内のファイルが削除されました。`,
    )
  }
  catch (error: any) {
    console.error(
      `ディレクトリ内のファイル削除中にエラーが発生しました: ${error.message}`,
    )
  }
}

export const readJSONSync = (path: string) => {
  return JSON.parse(readFileSync(path, 'utf-8'))
}
