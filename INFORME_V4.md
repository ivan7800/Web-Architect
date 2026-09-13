# Informe de release — 404 Web Architect Studio 4.0

## Production Architect

Studio 4.0 mantiene el motor 3.x y añade una capa de producción separada para mejorar fiabilidad sin reescribir el generador principal.

### Cambios principales

- Production Gate aplicado sobre el HTML real generado por el Studio.
- Auditoría de SEO, semántica, responsive, accesibilidad básica, integridad DOM y seguridad de la salida.
- Exportación Production v4 con `index.html`, `404.html`, `project.json`, `QA_REPORT.md`, `robots.txt` y `.nojekyll`.
- `sitemap.xml`, canonical y Open Graph cuando se configura una URL pública válida.
- PWA/offline opcional para los proyectos exportados.
- PWA instalable para el propio Studio con caché versionada.
- CI en GitHub Actions con validadores separados, sintaxis, smoke test y Playwright desktop/móvil.
- E2E específico para Production Architect.

## Arquitectura de compatibilidad

La funcionalidad v4 vive en `production-v4.js` y `production-v4.css`. El generador histórico permanece en `app.js`. Production Architect captura la salida del exportador existente y la mejora después, evitando duplicar o sustituir la lógica central de las 12 arquitecturas y 35 skins.

## Privacidad y despliegue

- Sin backend.
- Sin cuentas.
- Sin telemetría.
- Sin recursos JS externos de producción.
- Procesamiento y ZIP completamente locales en el navegador.
- Rutas relativas compatibles con GitHub Pages.

## Gate de release

La release solo debe considerarse cerrada cuando el commit final supere:

1. Validación de 1000 modelos.
2. Validador del núcleo Studio.
3. Validador Production v4.
4. Comprobación de sintaxis del runtime y Service Worker.
5. Smoke test DOM.
6. Playwright en escritorio y móvil.

El estado final de estas comprobaciones se refleja en `QUALITY_GATE.md` y en GitHub Actions.
