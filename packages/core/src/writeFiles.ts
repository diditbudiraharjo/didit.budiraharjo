import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

/** Writes a generated file map to disk under `outDir`, creating directories as needed. */
export async function writeFilesToDisk(
  files: Map<string, Buffer | string>,
  outDir: string,
): Promise<void> {
  for (const [relativePath, contents] of files) {
    const fullPath = join(outDir, relativePath);
    await mkdir(dirname(fullPath), { recursive: true });
    await writeFile(fullPath, contents);
  }
}
