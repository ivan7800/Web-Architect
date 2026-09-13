# Quality Gate — Studio 4.2 Visual Quality & Performance

Checklist de release. Los puntos automatizados deben estar en verde antes de fusionar a `main`.

## Núcleo y compatibilidad

- [x] Wizard de 5 pasos conservado.
- [x] Catálogo de 1000 modelos, filtros y recomendaciones conservado.
- [x] 12 arquitecturas disponibles.
- [x] 35 skins separadas del tema del Studio.
- [x] Editor de secciones y preview desktop/móvil conservados.
- [x] Guardado local e importación/exportación JSON conservados.
- [x] Premium Output 4.1 sigue validando sobre Studio 4.2.
- [x] `project.json` Production sigue siendo reimportable.
- [x] Reparación del CTA Hospitality conservada.

## Premium Output 4.1

- [x] Navegación móvil accesible.
- [x] Trust block derivado del brief.
- [x] Bloque adaptativo `pricing` / `gallery` / `stats`.
- [x] FAQ funcional.
- [x] Formulario local-first sin envío remoto.
- [x] Saneado de IDs duplicados.
- [x] Schema.org base.
- [x] Production Gate de 16 checks conservado como base.

## Visual Quality 4.2

- [x] Capa 4.2 aislada en `visual-quality-v4.2.js`.
- [x] Inicialización determinista 4.1 → 4.2.
- [x] Visual DNA aplicado según las 12 arquitecturas.
- [x] Perfiles: conversion, editorial, immersive, system, commerce y social.
- [x] Hero SVG local, escalable y accesible.
- [x] Reglas responsive por perfil.
- [x] `prefers-reduced-motion` respetado.
- [x] No se introducen fotografías, testimonios ni métricas ficticias.

## SEO estructurado

- [x] `WebSite` + `Organization` heredados de 4.1.
- [x] `WebPage` añadido al grafo JSON-LD.
- [x] `FAQPage` construido desde el FAQ visible.
- [x] Open Graph enriquecido.
- [x] Twitter metadata enriquecida.
- [x] `application-name` y `color-scheme` incluidos.
- [x] Canonical, robots y sitemap siguen dependiendo de una URL pública válida.

## Performance Gate

- [x] Gate final ampliado a 28 comprobaciones.
- [x] Cero assets externos de ejecución.
- [x] Presupuesto HTML ≤ 180 KB.
- [x] Presupuesto CSS inline ≤ 50 KB.
- [x] Presupuesto JS inline ≤ 24 KB.
- [x] Secciones inferiores usan `content-visibility`.
- [x] Imágenes no prioritarias reciben lazy loading cuando existen.
- [x] `decoding="async"` aplicado a imágenes cuando existen.
- [x] Hero visual no requiere descarga de recursos de terceros.

## Exportación 4.2

- [x] `index.html` y `404.html`.
- [x] `project.json`.
- [x] `VISUAL_DNA.json`.
- [x] `QA_REPORT.md`.
- [x] `PERFORMANCE_REPORT.md`.
- [x] `robots.txt`.
- [x] `sitemap.xml` con URL pública.
- [x] PWA opcional: manifest, Service Worker e icono.
- [x] `.nojekyll`.
- [x] ZIP creado localmente sin CDN/dependencias de producción.

## PWA del Studio

- [x] Manifest actualizado a Studio 4.2.
- [x] Caché `web-architect-studio-v4.2.0`.
- [x] Runtime 4.2 precacheado.
- [x] Eliminación de cachés anteriores al activar.
- [x] Fallback offline de navegación conservado.

## Seguridad y privacidad

- [x] CSP del Studio conservada.
- [x] Sin backend obligatorio.
- [x] Sin cuentas.
- [x] Sin telemetría.
- [x] Sin JS remoto en Production/Premium/Visual runtime.
- [x] URL pública limitada a HTTP/HTTPS en la capa Production.
- [x] Procesado y empaquetado realizados en el navegador.
- [x] Formulario local-first sin `fetch` ni `XMLHttpRequest`.

## Automatización

- [x] Validación de 1000 modelos.
- [x] Validación de núcleo Studio.
- [x] Validación Production 4.1 compatible con Studio 4.2.
- [x] Validador específico Visual Quality 4.2.
- [x] `node --check` de Production, Visual 4.2 y Service Worker.
- [x] Smoke test DOM.
- [x] Playwright desktop y móvil.
- [x] Matriz Premium sobre las 12 arquitecturas.
- [x] Matriz Visual DNA sobre las 12 arquitecturas.
- [x] E2E de ZIP 4.2, project.json, Hospitality y overflow móvil.

## Evidencia de candidato funcional

El commit funcional **`492a84f6a166fe3972069375239f323067d621f8`** completó con éxito la CI del PR #6:

- modelos: verde;
- núcleo: verde;
- Production 4.1: verde;
- Visual Quality 4.2: verde;
- sintaxis: verde;
- smoke DOM: verde;
- E2E desktop + móvil: verde.

Los cambios posteriores de este cierre son documentación de release y deben pasar una última CI antes del merge.

## Gate final de publicación

La release se considera apta cuando:

1. la CI del último commit del PR está verde;
2. se fusiona PR #6 a `main`;
3. la CI de `main` vuelve a quedar verde;
4. GitHub Pages completa el despliegue del mismo commit.

Estado del candidato funcional: **APTO**. Estado de publicación: **pendiente de CI documental + merge + despliegue**.
