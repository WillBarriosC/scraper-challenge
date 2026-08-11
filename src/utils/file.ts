import fs from "fs/promises";
import path from "path";
import { FailedDownload } from "../types/types";

export async function ensureDir(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true });
}

export async function saveJson(filePath: string, data: unknown): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export function createPdfPath(pdfDir: string, fileName: string): string {
  return path.join(pdfDir, fileName);
}

export async function saveFailedDownload(
  filePath: string,
  failedDownload: FailedDownload,
): Promise<void> {
  let current: FailedDownload[] = [];

  try {
    const content = await fs.readFile(filePath, "utf-8");
    current = JSON.parse(content);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
    current = [];
  }

  current.push(failedDownload);
  await saveJson(filePath, current);
}
