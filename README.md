# 404 Web Architect Studio 3.1

Constructor visual offline para convertir un brief en una web completa y publicable. Combina **1000 direcciones creativas**, **12 arquitecturas reales**, 35 skins de salida, editor de secciones, preview responsive, Quality Gate y exportación ZIP para GitHub Pages.

## Qué cambia en Studio 3.1 "Mesa del Arquitecto"

- Rediseño premium del estudio: retícula de plano técnico animada, marcas de registro y capa ambiental que respira.
- Sistema tipográfico de tres roles: display serif, cuerpo sans y etiquetas técnicas monoespaciadas (100% offline, sin webfonts).
- Movimiento orquestado: entrada escalonada del hero, contadores animados, transición entre pasos, escalonado de tarjetas, barrido de brillo en botones y revelado por scroll. Todo respeta `prefers-reduced-motion`.
- Anillo de puntuación cónico que se dibuja hasta la nota real del Quality Gate.
- Asistente más claro: raíl de pasos fijo con estados hecho/actual/bloqueado y botones «Volver» en cada plano.
- Test E2E de portada corregido: el heading esperado ahora existe en el DOM.

## Qué cambió en Studio 3.0

- Interfaz renovada con el sistema visual Universo 404.
- 10 temas independientes para el estudio: Oro, Obsidiana, Santuario, Bosque, Océano, Luna, Aurora, Niebla, Piedra y Ámbar.
- 12 motores de composición que cambian la estructura HTML y no solo el color.
- Editor de secciones: renombrar, ocultar, mostrar, ordenar, añadir y eliminar.
- Guardado local de proyectos e importación/exportación JSON.
- ZIP autónomo con `index.html`, `README.md`, `project.json` y `.nojekyll`.
- Auditoría calculada sobre el HTML generado, el contenido activo y el contraste.
- Prueba DOM automatizada de temas, arquitectura, editor, guardado y ZIP.

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

El estudio recomienda automáticamente una arquitectura según el modelo seleccionado. El usuario puede cambiarla en cualquier momento.

## Flujo de trabajo

1. Completa la marca, oferta, público y CTA.
2. Elige uno de los 1000 modelos o usa las recomendaciones.
3. Selecciona arquitectura, edita las secciones y elige la skin de salida.
4. Revisa el preview en escritorio o móvil.
5. Descarga HTML, proyecto JSON, kit comercial o ZIP para GitHub Pages.
6. Comprueba el Quality Gate antes de publicar.

## Tema del estudio frente a skin de salida

Son sistemas separados deliberadamente:

- **Tema del estudio:** cambia el aspecto de Web Architect Studio.
- **Skin de salida:** cambia los colores, tipografía y carácter de la web exportada.

Esto permite trabajar con el tema U404 Oro y exportar, por ejemplo, una web Cyberpunk, Editorial o Corporate sin mezclar ambos diseños.

## Guardar e importar

El botón **Guardar** conserva el proyecto en `localStorage`. **Exportar JSON** descarga un archivo compatible con el botón **Importar**. El proyecto conserva:

- modelo;
- brief;
- arquitectura;
- orden, nombre y visibilidad de las secciones;
- skin de salida;
- tema del estudio.

## Exportación GitHub Pages

El botón **Descargar ZIP GitHub** genera un paquete sin dependencias externas:

```text
proyecto-github-pages.zip
├─ index.html
├─ README.md
├─ project.json
└─ .nojekyll
```

Para publicarlo:

1. Descomprime el ZIP.
2. Sube el contenido a la raíz de un repositorio.
3. Abre **Settings → Pages**.
4. Selecciona **Deploy from a branch**, `main` y `/root`.

## Desarrollo y validación

```bash
npm install
npm test
```

La validación comprueba:

- 1000 modelos, 50 categorías y 20 estilos de datos;
- IDs, slugs, paletas y campos obligatorios;
- estructura y seguridad de la aplicación;
- 12 arquitecturas y 35 skins;
- edición de secciones;
- cambio de tema U404;
- guardado de proyectos;
- generación real del ZIP.

Pruebas E2E completas:

```bash
npx playwright install chromium
npm run test:e2e
```

GitHub Actions instala Chromium y ejecuta estas pruebas en cada `push` y `pull_request`.

## Estructura

```text
404-web-architect-studio/
├─ index.html
├─ styles.css
├─ app.js
├─ models.js
├─ assets/u404/
├─ package.json
├─ package-lock.json
├─ README.md
├─ LICENSE
├─ SECURITY.md
├─ CHANGELOG.md
├─ tests/e2e/
├─ tools/
└─ .github/workflows/
```

## Límites honestos

- Los 1000 modelos son presets estratégicos; la variedad estructural procede de las 12 arquitecturas.
- El editor trabaja con bloques y contenido, no es un editor de píxeles como Figma.
- La salida es HTML estático. No genera un backend, pagos reales ni autenticación.
- La puntuación automática ayuda a detectar problemas, pero no sustituye pruebas con usuarios ni revisión final del copy.

## Autor y licencia

Creado por **I. Roig**. Licencia MIT.
