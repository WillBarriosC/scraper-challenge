import path from "path";
import { config } from "./config";
import { searchDocuments } from "./services/searchService";
import { downloadPdf } from "./services/download";
import {
  ensureDir,
  saveJson,
  createPdfPath,
  saveFailedDownload
} from "./utils/file";
import { logger } from "./utils/logger";

async function main(): Promise<void> {
  await ensureDir(config.outputDir);
  await ensureDir(config.dataDir);
  await ensureDir(config.pdfDir);

  const documents = await searchDocuments(config.filters);

  logger.info(`Resultados obtenidos: ${documents.length}`);

  const documentsPath = path.join(config.dataDir, "documents.json");
  await saveJson(documentsPath, documents);

  const failedFilePath = path.join(config.dataDir, "failed-downloads.json");
  const documentsWithPdf = documents
    .filter((doc) => doc.pdfUrl)
    .slice(0, config.limitPdfs);

  for (const document of documentsWithPdf) {
    if (!document.pdfUrl) continue;

    const destination = createPdfPath(config.pdfDir, document.fileName);

    try {
      await downloadPdf(document.pdfUrl, destination);
      logger.info(`Archivo guardado: ${document.fileName}`);
    } catch (error) {
      const reason = error instanceof Error ? error.message : "Error desconocido";

      logger.error(`No se pudo descargar ${document.fileName}: ${reason}`);

      await saveFailedDownload(failedFilePath, {
        fileName: document.fileName,
        url: document.pdfUrl,
        attempts: config.maxRetries,
        reason
      });
    }
  }

  logger.info("Proceso terminado.");
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : "Error fatal";
  logger.error(message);
  process.exit(1);
});