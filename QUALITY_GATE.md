# Quality Gate — Studio 4.0 Production Architect

Checklist de release. Los puntos marcados como automatizados deben quedar en verde en GitHub Actions antes de fusionar a `main`.

## Núcleo funcional

- [x] La app conserva el wizard de 5 pasos y el motor Studio 3.x.
- [x] El catálogo mantiene 1000 modelos, filtros y recomendaciones.
- [x] Las 12 arquitecturas siguen disponibles.
- [x] Las 35 skins siguen separadas del tema visual del Studio.
- [x] Editor de secciones: renombrar, ocultar, ordenar, añadir y eliminar.
- [x] Guardado local, importación JSON y exportaciones 3.x siguen disponibles.
- [x] Preview desktop/móvil sigue disponible.

## Production Architect 4.0

- [x] `production-v4.js` está aislado del motor 3.x para reducir regresiones.
- [x] Production Gate captura y audita el HTML realmente generado por el exportador existente.
- [x] Comprueba `title`, description, H1, `lang`, viewport y responsive.
- [x] Comprueba imágenes sin `alt`, enlaces sin `href` e IDs duplicados.
- [x] Comprueba scripts externos y handlers inline en la salida.
- [x] Exporta `index.html` y `404.html`.
- [x] Exporta `project.json` y `QA_REPORT.md`.
- [x] Exporta `robots.txt`.
- [x] Con URL pública válida añade canonical, Open Graph y `sitemap.xml`.
- [x] PWA opcional: `manifest.webmanifest`, `sw.js` e `icon.svg`.
- [x] ZIP Production v4 se genera localmente, sin dependencia de CDN.

## PWA del Studio

- [x] `manifest.webmanifest` usa rutas relativas compatibles con GitHub Pages.
- [x] `studio-sw.js` usa caché versionada.
- [x] Service Worker elimina cachés antiguas al activar.
- [x] Navegación usa fallback offline a `index.html`.
- [x] No se añaden llamadas de telemetría ni recursos remotos.

## UX móvil y accesibilidad

- [x] Production Center tiene layout específico para 980 px y 620 px.
- [x] Controles de Production Center tienen etiquetas accesibles.
- [x] Resultados del gate se anuncian mediante región `aria-live`.
- [x] Se respeta `prefers-reduced-motion` en la capa v4.
- [x] El Studio conserva skip link, foco visible y estados `aria-pressed` del motor 3.x.
- [x] Verificación E2E automática sin overflow a 390 px.

## Seguridad y privacidad

- [x] CSP del Studio sigue presente.
- [x] Studio 4.0 continúa sin backend, cuentas ni telemetría.
- [x] Production Architect no carga JS externo.
- [x] La URL pública se valida con `URL` y solo acepta HTTP/HTTPS.
- [x] El contenido XML generado se escapa antes de crear sitemap/icono.
- [x] La salida se procesa completamente en el navegador.

## Automatización

- [x] Workflow `.github/workflows/ci.yml` ejecuta Node 22 y `npm ci`.
- [x] Validación de modelos separada.
- [x] Validación del núcleo Studio separada.
- [x] Validación específica Production v4 separada.
- [x] `node --check` para runtime v4 y Service Worker.
- [x] Smoke test DOM.
- [x] Playwright en Chromium desktop y móvil configurado.
- [x] Informe Playwright se conserva como artifact cuando falla CI.
- [x] CI completa en verde para el candidato funcional inmediatamente anterior; este commit solo cierra documentación del gate.

## Gate final de publicación

La release se considera apta para fusionar cuando:

1. `npm test` pasa.
2. `npm run test:e2e` pasa en desktop y móvil.
3. Production Gate puede ejecutarse desde el paso Auditoría.
4. El ZIP Production se descarga correctamente.
5. GitHub Actions queda en verde para el candidato funcional validado.

Estado: **APTO PARA FUSIONAR**. La funcionalidad candidata `996d7b20be4956b90cc598ecdedbc9a928428376` superó validadores, smoke y E2E desktop/móvil antes de este cierre documental.
