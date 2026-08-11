# Scraper App

Scraper HTTP hecho en Typescript para consultar documentos del repositorio dígital OEFA.

## Qué hace

- Entra al formulario de consulta.
- Hace una búsqueda con los filtros configurados.
- Extrae los datos de cada documento encontrado.
- Guarda todo en un JSON.
- Descarga los PDFs asociados.
- Si el servidor responde 429 (Too Many Requests), reintenta con backoff exponencial en vez de rendirse.
- Si un PDF no se puede descargar, lo anota en un archivo aparte para poder reintentarlo después, sin perder el resto del progreso.

## Tecnologías

- TypeScript
- axios
- axios-cookiejar-support
- tough-cookie
- cheerio
- dotenv

## Instalación

```bash
npm install
```

## Configuración

En el archivo `.env` ajusta lo que necesites:

Con `LIMIT_RESULTS` y `LIMIT_PDFS` puedes limitar cuántos resultados procesar y cuántos PDFs descargar.

## Ejecutar

Modo desarrollo:
```bash
npm run dev
```

Compilar y ejecutar:
```bash
npm run build
npm start
```

## Salida

- `output/data/documents.json`: Ruta de los documentos extraídos.
- `output/data/failed-downloads.json`: Ruta de los PDFs que no se lograron descargar.
- `output/pdfs/`: Ruta de los PDFs descargados.

## Decisiones que tomé

**El portal usa JSF (JavaServer Faces), por lo tanto hubo que adaptarse a esa tecnología.**, Al inspeccionar el formulario, noté que cada búsqueda depende de un campo oculto llamado `javax.faces.ViewState`, que JSF usa para mantener el estado del formulario entre peticiones. Un navegador normal maneja esto solo, pero como acá no hay navegador, tuve que:
1. Cargar la página de búsqueda primero, para conseguir ese `ViewState` inicial.
2. Extraerlo del HTML.
3. Reenviarlo junto con los filtros de búsqueda en el POST, simulando el clic en "Buscar".

Sin este paso, el servidor rechaza la búsqueda porque no reconoce la petición como parte de una sesión válida.

**Código separado en capas simples**, para que cada parte se entienda por separado: configuración, cliente HTTP, parser del HTML, servicio de búsqueda, servicio de descargas, y utilidades varias.

**Delays y backoff exponencial**, Se implementa en la carga de la página y la búsqueda, como en cada reintento de descarga, para no saturar el servidor ni comportarme como un bot agresivo.

**La descarga de PDFs se puede limitar por configuración**, para poder probar el flujo completo sin tener que descargar todos los documentos en cada corrida.

## Posibles mejoras

- Agregar tests básicos al parser, para detectar más rápido si el HTML del sitio cambia.
- Agregar un modo interactivo para elegir los filtros desde la línea de comandos.