# Web Architect Studio 4.1 — Premium Output Engine

## Objetivo

Studio 4.1 mejora la **web que se publica**, no solo la interfaz del constructor. La exportación Production se enriquece y después se somete al Quality Gate, de modo que el informe QA corresponde al HTML final.

## Qué añade a la salida Production

- Navegación móvil accesible con `aria-expanded` y cierre al seleccionar un enlace.
- Bloque de confianza derivado del brief, sin fabricar testimonios ni cifras.
- Bloque adaptativo según arquitectura:
  - `pricing`: conversion, split.
  - `gallery`: editorial, portfolio, catalog, cinematic, magazine, hospitality.
  - `stats`: dashboard, event, docs, community.
- FAQ funcional con `<details>` / `<summary>`.
- Formulario local-first: valida, genera un borrador, lo guarda en `localStorage` y lo copia al portapapeles cuando el navegador lo permite. No envía datos a servidores.
- Schema.org JSON-LD (`WebSite` + `Organization`).
- CSS responsive propio para los bloques premium.
- Runtime local sin librerías ni JS externo.
- PWA opcional y caché versionada.

## Production Gate 4.1

La auditoría final comprueba 16 puntos: title, description, H1, idioma, viewport, responsive, `alt`, enlaces, IDs, seguridad local, Schema.org, navegación móvil, FAQ, formulario local, densidad de bloques premium y ausencia de botones inertes.

## Matriz automática

Playwright recorre las **12 arquitecturas** y comprueba que cada una:

1. se puede renderizar;
2. recibe el bloque premium previsto;
3. conserva trust + FAQ + formulario local;
4. supera el Production Gate;
5. no reintroduce controles inertes.

## Testimonios

Studio 4.1 **no inventa testimonios**. Una cita comercial solo debe exportarse cuando proceda de contenido real aportado por el usuario. Esta decisión evita que una web aparentemente “premium” publique prueba social ficticia.

## Compatibilidad

La exportación HTML clásica sigue disponible. Premium Output se aplica al flujo **Production**, por lo que los proyectos 3.x/4.0 mantienen su arquitectura y datos y pueden seguir reimportándose mediante `project.json`.
