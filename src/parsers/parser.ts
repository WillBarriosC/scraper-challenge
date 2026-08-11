import * as cheerio from "cheerio";
import { DocumentRecord } from "../types/types";
import { cleanText, toFileName } from "../utils/text";

function resolveUrl(baseUrl: string, href?: string): string | undefined {
  if (!href) return undefined;
  if (href.startsWith("http")) return href;
  return new URL(href, baseUrl).toString();
}

export function extractViewState(html: string): string {
  const $ = cheerio.load(html);
  return $('input[name="javax.faces.ViewState"]').val()?.toString() || "";
}

export function parseDocuments(
  html: string,
  baseUrl: string,
): DocumentRecord[] {
  const $ = cheerio.load(html);
  const documents: DocumentRecord[] = [];

  $("table tr").each((rowIndex, row) => {
    const cells = $(row).find("td");
    if (cells.length < 7) return;

    const rowNumber = Number(cleanText($(cells[0]).text())) || rowIndex;
    const expediente = cleanText($(cells[1]).text());
    const administrado = cleanText($(cells[2]).text());
    const unidadFiscalizable = cleanText($(cells[3]).text());
    const sector = cleanText($(cells[4]).text());
    const resolucion = cleanText($(cells[5]).text());

    const pdfHref = $(cells[6]).find("a").attr("href");
    const pdfUrl = resolveUrl(baseUrl, pdfHref);

    if (!expediente && !administrado && !resolucion) {
      return;
    }

    const fileBase = toFileName([
      String(rowNumber),
      resolucion || "sin_resolucion",
      expediente || "sin_expediente",
      administrado || "sin_administrado",
    ]);

    documents.push({
      rowNumber,
      expediente,
      administrado,
      unidadFiscalizable,
      sector,
      resolucion,
      pdfUrl,
      fileName: `${fileBase || `documento_${rowNumber}`}.pdf`,
    });
  });

  return documents;
}
