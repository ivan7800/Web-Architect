# Web Architect Studio 4.2 — Visual Quality & Performance

## Objetivo

Studio 4.2 se centra en la **calidad de la web exportada**. Se apoya en Premium Output 4.1 y añade una segunda fase de postprocesado antes de la descarga final.

La 4.1 continúa siendo la base funcional: navegación móvil, trust, bloque adaptativo, FAQ, formulario local-first y Schema.org base. La 4.2 no sustituye esa capa; la amplía.

## Visual DNA

Cada una de las 12 arquitecturas recibe un perfil visual propio:

- `conversion`, `split` → **conversion**
- `editorial`, `magazine` → **editorial**
- `portfolio`, `cinematic`, `hospitality` → **immersive**
- `dashboard`, `docs` → **system**
- `catalog` → **commerce**
- `event`, `community` → **social**

El perfil se escribe en `data-u404-visual-profile` y cambia jerarquía tipográfica, proporciones, composición de galería, ritmo vertical y tratamiento de bloques.

## Hero local

El placeholder visual del hero se sustituye por una composición SVG generada localmente y adaptada al perfil. No descarga fotografías, fuentes ni librerías de terceros y mantiene un `aria-label` descriptivo.

## SEO estructurado

La salida añade o completa:

- `WebPage` en JSON-LD;
- `FAQPage` construido desde el FAQ visible;
- `og:site_name`;
- `og:locale`;
- `twitter:title`;
- `twitter:description`;
- `application-name`;
- `color-scheme`.

Cuando hay URL pública, se conserva canonical/sitemap/robots del flujo Production.

## Performance Gate

A los 16 checks de Premium Output se añaden 12 checks 4.2:

1. perfil Visual DNA;
2. hero SVG local;
3. composición responsive;
4. WebPage Schema;
5. FAQPage Schema;
6. metadata social;
7. cero assets externos de ejecución;
8. presupuesto HTML ≤ 180 KB;
9. presupuesto CSS inline ≤ 50 KB;
10. presupuesto JS inline ≤ 24 KB;
11. `content-visibility` para bloques inferiores;
12. política lazy/async de imágenes cuando existen.

El gate final contiene **28 comprobaciones**.

## Exportación 4.2

El ZIP Production añade:

- `VISUAL_DNA.json`
- `PERFORMANCE_REPORT.md`

además de `index.html`, `404.html`, `project.json`, `QA_REPORT.md`, README, robots, sitemap opcional y archivos PWA opcionales.

## Privacidad y ejecución

- Sin backend.
- Sin cuentas.
- Sin telemetría.
- Sin assets remotos necesarios en producción.
- El formulario sigue siendo local-first.
- El SVG del hero y el CSS de perfiles se generan dentro del HTML.

## Compatibilidad

`visual-quality-v4.2.js` se carga después de `production-v4.js`. Si la capa 4.2 se retira, Premium Output 4.1 sigue siendo funcional. Esta separación reduce el riesgo de regresiones en el motor consolidado.
