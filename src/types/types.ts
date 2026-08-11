export interface SearchFilters {
  expediente: string;
  administrado: string;
  unidadFiscalizable: string;
  sector: string;
  resolucion: string;
}

export interface FailedDownload {
  fileName: string;
  url: string;
  attempts: number;
  reason: string;
}
