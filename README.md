# 404 Web Architect Studio 4.2 — Visual Quality & Performance

Constructor visual **offline/local-first** para convertir un brief en una web estática completa, auditable y publicable en GitHub Pages. Combina **1000 direcciones creativas**, **12 arquitecturas reales**, **35 skins**, editor de secciones, preview responsive, Premium Output, Visual DNA y un Quality Gate técnico de **28 comprobaciones**.

## Qué aporta Studio 4.2

Studio 4.2 se apoya en la base estable **Premium Output 4.1** y mejora la calidad visual, SEO y rendimiento de la web final exportada.

- **Visual DNA por arquitectura**: cada una de las 12 arquitecturas recibe un perfil visual `conversion`, `editorial`, `immersive`, `system`, `commerce` o `social`.
- **Hero SVG local y accesible** generado dentro del HTML, sin imágenes, fuentes o librerías externas obligatorias.
- Jerarquía tipográfica, proporciones, ritmo vertical y composición diferenciados según el tipo de web.
- **Schema.org enriquecido**: mantiene `WebSite` + `Organization` de 4.1 y añade `WebPage` + `FAQPage` construido desde el FAQ visible.
- Open Graph/Twitter enriquecidos, `application-name` y `color-scheme`.
- `content-visibility` para reducir trabajo de render en secciones inferiores.
- Política `loading="lazy"` + `decoding="async"` para imágenes no prioritarias cuando existen.
- **Performance Gate** con presupuestos de HTML, CSS y JavaScript y control de assets externos.
- ZIP Production 4.2 con `VISUAL_DNA.json` y `PERFORMANCE_REPORT.md`.
- Capa 4.2 aislada en `visual-quality-v4.2.js`; Premium Output 4.1 permanece debajo para reducir regresiones.

Documentación técnica: [`VISUAL_QUALITY_4.2.md`](VISUAL_QUALITY_4.2.md).

## Premium Output heredado de 4.1

La salida 4.2 conserva:

- navegación móvil accesible con `aria-expanded`;
- bloque de confianza derivado del brief;
- bloque adaptado a arquitectura (`pricing`, `gallery` o `stats`);
- FAQ funcional con `<details>` / `<summary>`;
- formulario local-first que valida, guarda un borrador en `localStorage` e intenta copiarlo al portapapeles;
- cero envío automático de datos a servidores;
- saneado de IDs duplicados;
- reparación de controles inertes como el CTA de Hospitality;
- `project.json` reimportable;
- PWA opcional, robots, sitemap y fallback `404.html`.

Studio **no fabrica testimonios, clientes, cifras ni resultados**. La prueba social real debe proceder de contenido real del proyecto.

## Visual DNA de las 12 arquitecturas

| Arquitectura | Perfil 4.2 |
| --- | --- |
| Conversión premium | `conversion` |
| Producto en split | `conversion` |
| Editorial de autor | `editorial` |
| Portfolio inmersivo | `immersive` |
| Dashboard de producto | `system` |
| Catálogo comercial | `commerce` |
| Cinematográfica | `immersive` |
| Magazine visual | `editorial` |
| Evento y agenda | `social` |
| Hospitality y reservas | `immersive` |
| Documentación técnica | `system` |
| Comunidad y membresía | `social` |

La arquitectura modifica la estructura HTML. La skin define la identidad cromática/tipográfica. El Visual DNA 4.2 añade una tercera capa de dirección visual y composición.

## Flujo recomendado

1. Completa marca, oferta, público y CTA.
2. Elige un modelo entre los 1000 presets o usa las recomendaciones.
3. Selecciona arquitectura, secciones y skin.
4. Revisa el preview desktop/móvil.
5. Avanza a Auditoría.
6. Ejecuta **Quality Gate 4.2**.
7. Opcionalmente introduce la URL pública y activa/desactiva PWA.
8. Descarga **ZIP Production 4.2** y publica en GitHub Pages.

## Quality Gate 4.2 — 28 comprobaciones

Las 16 comprobaciones de Premium Output siguen activas:

- `title` y meta description;
- un único `h1`;
- `lang` y viewport;
- CSS responsive;
- imágenes sin `alt`;
- enlaces sin `href`;
- IDs duplicados;
- scripts externos y handlers inline;
- Schema.org base;
- navegación móvil;
- FAQ;
- formulario local-first;
- bloques premium mínimos;
- ausencia de botones inertes.

La capa 4.2 añade 12 comprobaciones:

1. perfil Visual DNA;
2. hero SVG local;
3. composición responsive 4.2;
4. `WebPage` Schema;
5. `FAQPage` Schema;
6. metadata social completa;
7. cero assets externos de ejecución;
8. HTML ≤ 180 KB;
9. CSS inline ≤ 50 KB;
10. JavaScript inline ≤ 24 KB;
11. render diferido mediante `content-visibility`;
12. política lazy/async de imágenes.

El gate es un preflight técnico: no sustituye revisión humana, validación legal, Lighthouse en producción ni pruebas con usuarios reales.

## ZIP Production 4.2

Con URL pública y PWA activadas:

```text
proyecto-production-v4.2.zip
├─ index.html
├─ 404.html
├─ README.md
├─ project.json
├─ VISUAL_DNA.json
├─ QA_REPORT.md
├─ PERFORMANCE_REPORT.md
├─ robots.txt
├─ sitemap.xml
├─ manifest.webmanifest
├─ sw.js
├─ icon.svg
└─ .nojekyll
```

Sin URL pública se omite `sitemap.xml`. Sin PWA se omiten `manifest.webmanifest`, `sw.js` e `icon.svg`.

## Privacidad y seguridad

- Sin backend obligatorio.
- Sin cuentas.
- Sin telemetría.
- Sin dependencias externas de ejecución en la salida 4.2.
- CSP en el Studio.
- URL pública limitada a HTTP/HTTPS.
- Procesado y ZIP completamente en el navegador.
- El formulario generado es local-first y no hace `fetch` ni `XMLHttpRequest`.

## Capacidades del Studio

- 1000 presets estratégicos.
- 50 categorías.
- 12 arquitecturas HTML diferenciadas.
- 35 skins de salida.
- 10 temas visuales independientes para el Studio.
- Editor de secciones: renombrar, ocultar, mostrar, ordenar, añadir y eliminar.
- Guardado local e importación/exportación JSON.
- Preview desktop/móvil.
- Kit comercial y checklist QA.
- Exportación HTML clásica, ZIP base y ZIP Production 4.2.
- PWA del Studio con caché versionada.

## Tema, skin y Visual DNA

Son tres niveles separados:

- **Tema del Studio**: aspecto de la herramienta Web Architect.
- **Skin de salida**: paleta, tipografía y carácter de la web exportada.
- **Visual DNA 4.2**: composición, jerarquía y tratamiento visual según arquitectura.

Esto permite cambiar la herramienta sin contaminar el proyecto y combinar una misma arquitectura con identidades visuales muy distintas.

## Guardar e importar

**Guardar** conserva el proyecto en `localStorage`. **Exportar JSON** descarga el proyecto y **Importar** recupera modelo, brief, arquitectura, secciones, skin y tema. El ZIP Production añade metadata de Premium Output, Visual Quality, perfil y opciones de publicación sin romper el esquema reimportable.

## Publicar en GitHub Pages

1. Descomprime el ZIP.
2. Sube su contenido a la raíz del repositorio de destino.
3. Ve a **Settings → Pages**.
4. Selecciona **Deploy from a branch**, rama `main` y `/root`.
5. Comprueba móvil y escritorio.
6. Si cambia la URL definitiva, vuelve a exportar para regenerar canonical, robots y sitemap.

## Desarrollo y QA

```bash
npm ci
npm test
npm run test:e2e
```

`npm test` cubre modelos, núcleo, Production 4.1, Premium Output, Visual Quality 4.2 y smoke DOM. Playwright ejecuta los flujos de navegador en **desktop y móvil**, incluida la matriz Premium y la matriz Visual DNA sobre las **12 arquitecturas**.

Prueba completa:

```bash
npm run test:all
```

GitHub Actions ejecuta la misma validación en cada `pull_request` hacia `main` y después del merge en `main`.

## Estructura principal

```text
404-web-architect-studio/
├─ index.html
├─ styles.css
├─ production-v4.css
├─ app.js
├─ production-v4.js
├─ visual-quality-v4.2.js
├─ models.js
├─ manifest.webmanifest
├─ studio-sw.js
├─ assets/u404/
├─ tests/e2e/
├─ tools/
├─ PREMIUM_OUTPUT_4.1.md
├─ VISUAL_QUALITY_4.2.md
├─ QUALITY_GATE.md
└─ .github/workflows/
```

## Límites honestos

- Los 1000 modelos son direcciones estratégicas; la diversidad estructural real procede de las 12 arquitecturas.
- No es un editor libre de píxeles como Figma.
- La salida es estática: no crea pagos, autenticación o backend real.
- El formulario local prepara una solicitud; no sustituye un CRM o endpoint de leads.
- El hero SVG 4.2 aporta identidad visual local, pero una web comercial de fotografía/producto seguirá necesitando material real aportado por el proyecto.
- Los presupuestos del Performance Gate controlan el HTML exportado, pero el rendimiento final también depende del hosting y de los assets reales que se añadan después.

## Autor y licencia

Creado por **I. Roig**. Licencia MIT.
