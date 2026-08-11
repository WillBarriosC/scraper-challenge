import fs from "fs/promises";
import { config } from "../config";
import { http } from "../http/client";
import { delay } from "../utils/dealy";
import { logger } from "../utils/logger";

export async function downloadPdf(url: string, destination: string): Promise<void> {
  let attempt = 0;

  while (attempt < config.maxRetries) {
    attempt += 1;

    try {
      logger.info(`Descargando archivo (intento ${attempt})`);

      const response = await http.get(url, {
        responseType: "arraybuffer",
        validateStatus: () => true
      });

      if (response.status === 200) {
        await fs.writeFile(destination, Buffer.from(response.data));
        return;
      }

      if (response.status === 429) {
        const waitTime = config.requestDelayMs * Math.pow(2, attempt);
        logger.warn(`Respuesta 429. Esperando ${waitTime} ms...`);
        await delay(waitTime);
        continue;
      }

      throw new Error(`Status no esperado: ${response.status}`);
    } catch (error) {
      if (attempt >= config.maxRetries) {
        throw error;
      }

      const waitTime = config.requestDelayMs * Math.pow(2, attempt);
      logger.warn(`Fallo temporal. Nuevo intento en ${waitTime} ms.`);
      await delay(waitTime);
    }
  }
}