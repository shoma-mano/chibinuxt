import { readdirSync, rmdirSync, unlinkSync } from "fs";
import { join } from "path";

export async function clearDirectory(directoryPath: string): Promise<void> {
  try {
    // ディレクトリ内のすべてのエントリを取得
    const entries = readdirSync(directoryPath, { withFileTypes: true });

    // エントリごとに削除
    for (const entry of entries) {
      const fullPath = join(directoryPath, entry.name);

      if (entry.isDirectory()) {
        // サブディレクトリの場合、再帰的に削除
        await clearDirectory(fullPath);
        // サブディレクトリ自体を削除
        rmdirSync(fullPath);
      } else {
        // ファイルの場合、削除
        unlinkSync(fullPath);
      }
    }
  } catch (error: any) {
    console.error(
      `ディレクトリ内のファイル削除中にエラーが発生しました: ${error.message}`
    );
  }
}
