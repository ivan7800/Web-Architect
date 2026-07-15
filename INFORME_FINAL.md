# Informe final — 404 Web Architect Studio 3.0

## Resultado

La versión 3.0 convierte el generador original en un estudio visual offline. La mejora no se limita a una capa estética: añade composición estructural, edición, persistencia y empaquetado de proyectos.

## Cambios verificados

- Interfaz U404 con 10 temas persistentes.
- 35 skins independientes para la web generada.
- 12 arquitecturas con HTML y CSS diferenciados.
- Editor de secciones con orden, visibilidad y contenido editable.
- Guardado local, importación y exportación de proyectos v3.
- ZIP GitHub Pages autónomo y sin bibliotecas de producción.
- Quality Gate basado en el documento generado, contraste y contenido.
- Responsive, foco visible, CSP, escape de HTML y saneado de datos.

## Verificación automatizada

`npm test` ejecuta:

1. Validación de 1000 modelos.
2. Validación estructural y de seguridad de Studio 3.0.
3. Smoke test DOM del flujo, temas, arquitecturas, secciones, guardado y ZIP.

Playwright queda configurado en GitHub Actions para pruebas Chromium de escritorio y móvil.

## Límites pendientes honestos

- No es un editor libre de píxeles.
- No genera backend ni integraciones de pago.
- Las imágenes finales y el copy específico deben aportarse antes de una publicación comercial definitiva.
- La auditoría automática reduce riesgos, pero no reemplaza test humano con usuarios reales.

## Valoración

La versión queda preparada para GitHub Pages, con una base mantenible y una diferenciación de producto real frente a v2.0.


---

# Addendum — Studio 3.1.0 "Mesa del Arquitecto" (rediseño premium)

## Alcance
Rediseño visual y de movimiento del estudio sin tocar el modelo de datos, las 12 arquitecturas, las 35 skins ni los formatos de exportación. Compatibilidad total con proyectos guardados en 3.0.

## Verificado en esta versión (jsdom + validadores estáticos)
- Suite completa `npm test` en verde (modelos, app, smoke ampliado).
- H1 alineado con el test E2E de portada (antes el E2E buscaba un heading inexistente: bug real corregido).
- Botones «Volver» funcionales en pasos 2–5 (navegación por hash verificada).
- Anillo de puntuación sincronizado con la nota real del Quality Gate (`--score` = texto).
- Contadores del hero alcanzan su valor final con y sin `requestAnimationFrame`.
- Revelado por scroll inocuo sin `IntersectionObserver` (contenido visible por defecto).
- Sin dependencias externas, CSP intacta, `prefers-reduced-motion` respetado globalmente.

## No verificado en el entorno de auditoría
- E2E Playwright con navegador real (sin acceso al CDN de binarios). El workflow de GitHub Actions sí lo ejecuta en CI.
