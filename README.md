# 404 Web Architect Studio 4.0 — Production Architect

Constructor visual offline para convertir un brief en una web completa, auditable y publicable. Combina **1000 direcciones creativas**, **12 arquitecturas reales**, **35 skins de salida**, editor de secciones, preview responsive, Quality Gate, **Production Gate** y exportación ZIP para GitHub Pages.

## Novedades de Studio 4.0

Studio 4.0 conserva el motor 3.1 y añade una capa de producción separada para reducir regresiones.

- **Production Gate** sobre el HTML que genera realmente el estudio, no sobre una maqueta paralela.
- Auditoría adicional de SEO, semántica, accesibilidad, responsive, IDs, enlaces y seguridad básica.
- **ZIP Producción** con `index.html`, `404.html`, `project.json`, `QA_REPORT.md`, `robots.txt` y `.nojekyll`.
- URL pública opcional para generar `canonical`, Open Graph, `sitemap.xml` y referencia de sitemap en `robots.txt`.
- **PWA/offline opcional** en la exportación: `manifest.webmanifest`, `sw.js` e `icon.svg`.
- El propio Studio es instalable como PWA mediante `manifest.webmanifest` y `studio-sw.js`.
- CI real en `.github/workflows/ci.yml`: validación estática + smoke tests + Playwright desktop/móvil.
- Suite E2E adicional para Production Architect.
- Runtime v4 aislado en `production-v4.js` y estilos en `production-v4.css` para mantener compatibilidad con el motor 3.x.

## Capacidades heredadas

- 1000 presets estratégicos.
- 50 categorías.
- 12 motores de composición que cambian estructura HTML, no solo colores.
- 35 skins de salida.
- 10 temas visuales independientes para el estudio.
- Editor de secciones: renombrar, ocultar, mostrar, ordenar, añadir y eliminar.
- Guardado local e importación/exportación JSON.
- Preview desktop/móvil.
- Kit comercial y checklist QA.
- Exportación HTML y ZIP base para GitHub Pages.
- CSP del Studio y ejecución sin recursos externos de producción.

## Arquitecturas incluidas

1. Conversión premium.
2. Producto en split.
3. Editorial de autor.
4. Portfolio inmersivo.
5. Dashboard de producto.
6. Catálogo comercial.
7. Cinematográfica.
8. Magazine visual.
9. Evento y agenda.
10. Hospitality y reservas.
11. Documentación técnica.
12. Comunidad y membresía.

El estudio recomienda automáticamente una arquitectura según el modelo seleccionado y permite cambiarla en cualquier momento.

## Flujo recomendado

1. Completa marca, oferta, público y CTA.
2. Elige uno de los 1000 modelos o usa las recomendaciones.
3. Selecciona arquitectura, edita las secciones y elige la skin de salida.
4. Revisa el preview en escritorio y móvil.
5. Avanza a Auditoría.
6. En **Production Architect**, ejecuta **Production Gate**.
7. Opcionalmente introduce la URL pública y activa/desactiva PWA.
8. Descarga **ZIP Producción** y publica en GitHub Pages.

## Production Gate

El Production Gate captura la salida del exportador HTML existente y comprueba:

- longitud de `title`;
- longitud de `meta description`;
- existencia de un único `h1`;
- atributo `lang`;
- `viewport`;
- reglas responsive;
- imágenes sin `alt`;
- enlaces sin `href`;
- IDs duplicados;
- scripts externos y handlers inline.

La puntuación se guarda en `QA_REPORT.md` dentro del ZIP de producción. El gate ayuda a reducir errores, pero no sustituye una revisión humana final, pruebas reales de usabilidad ni validaciones legales del contenido.

## Exportación Production Architect

Con URL pública y PWA activadas, el paquete puede contener:

```text
proyecto-production-v4.zip
├─ index.html
├─ 404.html
├─ README.md
├─ project.json
├─ QA_REPORT.md
├─ robots.txt
├─ sitemap.xml
├─ manifest.webmanifest
├─ sw.js
├─ icon.svg
└─ .nojekyll
```

Sin URL pública se omite `sitemap.xml` y no se añade `canonical`. Sin PWA se omiten `manifest.webmanifest`, `sw.js` e `icon.svg`.

## Tema del estudio frente a skin de salida

Son sistemas separados deliberadamente:

- **Tema del estudio:** cambia el aspecto de Web Architect Studio.
- **Skin de salida:** cambia colores, tipografía y carácter de la web exportada.

Así puedes trabajar con U404 Oro y exportar una web Cyberpunk, Editorial, Corporate u otra identidad sin mezclar ambos niveles.

## Guardar e importar

El botón **Guardar** conserva el proyecto en `localStorage`. **Exportar JSON** descarga un archivo compatible con **Importar**. El motor 3.x conserva modelo, brief, arquitectura, secciones, skin y tema del estudio. El ZIP Production v4 añade además un `project.json` de snapshot con las opciones de producción.

## Publicar en GitHub Pages

1. Descomprime el ZIP.
2. Sube su contenido a la raíz del repositorio de destino.
3. Ve a **Settings → Pages**.
4. Selecciona **Deploy from a branch**, rama `main` y `/root`.
5. Comprueba la URL final en móvil y escritorio.
6. Si configuraste una URL pública distinta, vuelve a exportar con la URL definitiva para regenerar canonical y sitemap.

## Desarrollo y validación

```bash
npm ci
npm test
```

`npm test` ejecuta:

- validación de los 1000 modelos;
- validación estructural y de seguridad del Studio;
- validación específica de Production Architect;
- smoke test DOM del flujo 3.x.

Pruebas E2E completas:

```bash
npx playwright install chromium
npm run test:e2e
```

Prueba total:

```bash
npm run test:all
```

GitHub Actions ejecuta Chromium en escritorio y móvil en cada `push` relevante y `pull_request` hacia `main`.

## Estructura

```text
404-web-architect-studio/
├─ index.html
├─ styles.css
├─ production-v4.css
├─ app.js
├─ production-v4.js
├─ models.js
├─ manifest.webmanifest
├─ studio-sw.js
├─ assets/u404/
├─ package.json
├─ package-lock.json
├─ README.md
├─ LICENSE
├─ SECURITY.md
├─ CHANGELOG.md
├─ QUALITY_GATE.md
├─ tests/e2e/
├─ tools/
└─ .github/workflows/
```

## Límites honestos

- Los 1000 modelos son presets estratégicos; la variedad estructural procede de las 12 arquitecturas.
- El editor trabaja con bloques y contenido; no es un editor libre de píxeles como Figma.
- La salida es HTML estático. No crea backend, pagos reales ni autenticación.
- El Production Gate es un preflight técnico local, no un sustituto de Lighthouse, axe, validación HTML completa o pruebas con usuarios reales.
- La PWA exportada usa una estrategia offline deliberadamente simple y apropiada para proyectos estáticos.

## Autor y licencia

Creado por **I. Roig**. Licencia MIT.
