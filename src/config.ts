import path from "path";
import dotenv from "dotenv";
import { SearchFilters } from "./types/types";

dotenv.config();

const outputDir = process.env.OUTPUT_DIR || "./output";

export const config = {
  baseUrl: process.env.BASE_URL || "https://publico.oefa.gob.pe",
  searchPath: process.env.SEARCH_PATH || "/repdig/consulta/consultaTfa.xhtml",
  requestDelayMs: Number(process.env.REQUEST_DELAY_MS || 1200),
  maxRetries: Number(process.env.MAX_RETRIES || 4),
  limitResults: Number(process.env.LIMIT_RESULTS || 20),
  limitPdfs: Number(process.env.LIMIT_PDFS || 5),
  outputDir,
  dataDir: path.join(outputDir, "data"),
  pdfDir: path.join(outputDir, "pdfs"),
  filters: {
    expediente: process.env.EXPEDIENTE || "",
    administrado: process.env.ADMINISTRADO || "",
    unidadFiscalizable: process.env.UNIDAD_FISCALIZABLE || "",
    sector: process.env.SECTOR || "",
    resolucion: process.env.RESOLUCION || "",
  } satisfies SearchFilters,
};
