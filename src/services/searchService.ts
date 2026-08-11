import { http } from "../http/client";
import { config } from "../config";
import { SearchFilters, DocumentRecord } from "../types/types";
import { delay } from "../utils/dealy";
import { logger } from "../utils/logger";
import { extractViewState, parseDocuments } from "../parsers/parser";

function buildSearchBody(
  filters: SearchFilters,
  viewState: string,
): URLSearchParams {
  const params = new URLSearchParams();

  params.append("consultaTfa", "consultaTfa");
  params.append("consultaTfa:numeroExpediente", filters.expediente);
  params.append("consultaTfa:administrado", filters.administrado);
  params.append("consultaTfa:unidadFiscalizable", filters.unidadFiscalizable);
  params.append("consultaTfa:sector_input", filters.sector);
  params.append("consultaTfa:nroResolucionApelacion", filters.resolucion);
  params.append("consultaTfa:j_idt33", "Buscar");
  params.append("javax.faces.ViewState", viewState);

  return params;
}

export async function loadSearchPage(): Promise<string> {
  logger.info("Cargando página principal...");
  const response = await http.get(config.searchPath);
  return response.data;
}

export async function searchDocuments(
  filters: SearchFilters,
): Promise<DocumentRecord[]> {
  const firstPageHtml = await loadSearchPage();
  const viewState = extractViewState(firstPageHtml);

  await delay(config.requestDelayMs);

  logger.info("Ejecutando búsqueda...");
  const body = buildSearchBody(filters, viewState).toString();

  const response = await http.post(config.searchPath, body, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const documents = parseDocuments(response.data, config.baseUrl);
  return documents.slice(0, config.limitResults);
}
