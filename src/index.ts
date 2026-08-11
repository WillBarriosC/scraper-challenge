import path from "path";
import { config } from "./config";
import { searchDocuments } from "./services/searchService";
import { ensureDir, saveJson } from "./utils/file";
import { logger } from "./utils/logger";

async function main(): Promise<void> {
  await ensureDir(config.outputDir);
  await ensureDir(config.dataDir);
  await ensureDir(config.pdfDir);

  const documents = await searchDocuments(config.filters);

  logger.info(`Resultados obtenidos: ${documents.length}`);

  const outputPath = path.join(config.dataDir, "documents.json");
  await saveJson(outputPath, documents);

  logger.info(`Documentos guardados en ${outputPath}`);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : "Error fatal";
  logger.error(message);
  process.exit(1);
});