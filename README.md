# 404 Web Architect Studio 4.1 — Premium Output Engine

Constructor visual offline para convertir un brief en una web estática completa, auditable y publicable. Combina **1000 direcciones creativas**, **12 arquitecturas reales**, **35 skins de salida**, editor de secciones, preview responsive, Quality Gate, **Production Gate** y exportación ZIP para GitHub Pages.

## Novedades de Studio 4.1

Studio 4.1 conserva el motor 3.x/4.0 y mejora la **web final que se publica**.

- **Premium Output Engine**: postprocesa la salida Production antes de auditarla.
- Navegación móvil accesible con estado `aria-expanded`.
- Bloques premium adaptados a la arquitectura:
  - `pricing` para Conversión y Split.
  - `gallery` para Editorial, Portfolio, Catálogo, Cinematic, Magazine y Hospitality.
  - `stats` para Dashboard, Evento, Docs y Comunidad.
- Bloque de confianza derivado del brief, sin inventar cifras ni testimonios.
- FAQ funcional con `<details>` / `<summary>`.
- Formulario local-first que valida, guarda un borrador en `localStorage` y lo copia al portapapeles cuando el navegador lo permite. **No envía datos a servidores.**
- Schema.org JSON-LD (`WebSite` + `Organization`).
- Production Gate ampliado a **16 comprobaciones** sobre la salida final.
- API local `WebArchitectProduction.preview()` para QA automatizado.
- **Matriz E2E sobre las 12 arquitecturas** con Playwright.
- Studio PWA con caché versionada `v4.1.0`.
- ZIP Production 4.1 con PWA opcional, sitemap y QA report.

La documentación técnica detallada está en [`PREMIUM_OUTPUT_4.1.md`](PREMIUM_OUTPUT_4.1.md).

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
- Exportación HTML clásica y ZIP base para GitHub Pages.
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
6. En **Premium Output Engine**, ejecuta **Production Gate**.
7. Opcionalmente introduce la URL pública y activa/desactiva PWA.
8. Descarga **ZIP Premium 4.1** y publica en GitHub Pages.

## Production Gate 4.1

El Production Gate captura la salida HTML, la enriquece y después comprueba:

- longitud de `title`;
- longitud de `meta description`;
- existencia de un único `h1`;
- atributo `lang`;
- `viewport`;
- reglas responsive;
- imágenes sin `alt`;
- enlaces sin `href`;
- IDs duplicados;
- scripts externos y handlers inline;
- Schema.org JSON-LD;
- navegación móvil;
- FAQ funcional;
- formulario local-first;
- presencia mínima de bloques premium;
- ausencia de botones inertes.

La puntuación se guarda en `QA_REPORT.md` dentro del ZIP. El gate reduce errores, pero no sustituye una revisión humana final, pruebas de usabilidad ni validaciones legales del contenido.

## Exportación Premium 4.1

Con URL pública y PWA activadas, el paquete puede contener:

```text
proyecto-production-v4.1.zip
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

## Privacidad del formulario local

El formulario generado no tiene backend ni endpoint remoto. Al enviarlo:

1. valida los campos en el navegador;
2. compone un borrador de solicitud;
3. lo guarda localmente en `localStorage`;
4. intenta copiarlo al portapapeles.

No hace `fetch`, `XMLHttpRequest`, telemetría ni envío automático de datos.

## Testimonios y prueba social

Studio 4.1 **no fabrica testimonios**. Una cita comercial solo debería publicarse si procede de contenido real aportado por el propietario del proyecto. El motor usa señales de confianza derivadas del brief, pero no inventa personas, empresas, resultados ni métricas.

## Tema del estudio frente a skin de salida

Son sistemas separados deliberadamente:

- **Tema del estudio:** cambia el aspecto de Web Architect Studio.
- **Skin de salida:** cambia colores, tipografía y carácter de la web exportada.

Así puedes trabajar con U404 Oro y exportar una web Cyberpunk, Editorial, Corporate u otra identidad sin mezclar ambos niveles.

## Guardar e importar

El botón **Guardar** conserva el proyecto en `localStorage`. **Exportar JSON** descarga un archivo compatible con **Importar**. El proyecto conserva modelo, brief, arquitectura, secciones, skin y tema del estudio. El ZIP Production añade un `project.json` reimportable con las opciones de producción.

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
- validación específica de Premium Output 4.1;
- smoke test DOM del flujo 3.x.

Pruebas E2E completas:

```bash
npx playwright install chromium
npm run test:e2e
```

La suite E2E incluye una matriz que recorre las **12 arquitecturas** y verifica el bloque premium correspondiente, Production Gate, navegación, FAQ y formulario local.

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
├─ PREMIUM_OUTPUT_4.1.md
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
- El formulario local prepara una solicitud; no sustituye un sistema real de captación de leads.
- Las galerías generadas son composiciones estructurales; para fotografía/producto real hay que aportar imágenes reales.
- El Production Gate es un preflight técnico local, no un sustituto de Lighthouse, axe, validación HTML completa o pruebas con usuarios reales.
- La PWA exportada usa una estrategia offline deliberadamente simple y apropiada para proyectos estáticos.

## Autor y licencia

Creado por **I. Roig**. Licencia MIT.
