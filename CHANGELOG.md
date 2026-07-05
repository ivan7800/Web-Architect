# Changelog

## v2.0.0 — 2026-07-05

### Rediseño de experiencia: flujo guiado en 5 pasos

- **Wizard con navegación por hash** (`#paso-1`…`#paso-5`): cada paso (Brief, Catálogo, Personalizar, Exportar, Auditoría) es ahora una pantalla enfocada en vez de un scroll único con 5 paneles simultáneos. El progreso se guarda en `localStorage`; solo se puede navegar hacia pasos ya completados, nunca saltar adelante.
- **Brief obligatorio**: no se avanza al catálogo sin marca, oferta, público y CTA completos.
- **Recomendación real según el brief**: el catálogo ahora separa "Recomendados para ti" (3 modelos, calculados cruzando oferta/público/tono contra categoría/estilo/tags de los 1000 modelos) de la exploración libre por búsqueda y filtros.

### Sistema de skins v2.0: de 6 a 35, basado en datos

- **35 skins en 7 categorías** (oscuras/neón, editorial, gótico/horror, lujo, naturaleza, retro, corporate), cada una con paleta, tipografía (sans/serif/mono) y radio de borde propios — ya viven en el paso "Personalizar" con buscador y filtro por categoría, no en un picker fijo del header.
- **Arquitectura basada en `color-mix()`**: cada skin solo define ~9 propiedades (bg, bg2, text, brand, brand-2, radius, tipografía). Todo lo derivado (líneas, overlays, glows, muted, sombra de foco) se calcula en `styles.css` con `color-mix(in srgb, ...)`, así que añadir una skin nueva no requiere tocar CSS a mano.
- Eliminadas las ~150 líneas de overrides `[data-skin="x"] { ... }` que existían por cada una de las 6 skins anteriores.

### Mantenimiento

- `tools/validate-app.mjs` y `tools/validate-models.mjs` actualizados para verificar la nueva galería de skins (antes verificaban el picker de 6 botones fijo, ver lección aprendida en v1.1.1).
- `tests/e2e/commercial.spec.js` reescrito: navega el wizard paso a paso (helpers `goToCatalog`/`goToPersonalizar`/`goToExportar`/`goToAuditoria`) en vez de asumir que todos los paneles están siempre visibles.

## v1.1.1 — 2026-07-05

### Bugs críticos corregidos

- **FIX: CI roto en GitHub Actions** — `tools/validate-app.mjs` seguía exigiendo el id `themeToggle`, eliminado en v1.1.0 al introducir el skin picker. `npm test` fallaba en cada push/PR, dejando el proyecto realmente no apto para GitHub pese a estar documentado como listo.
- **FIX: `tools/validate-models.mjs` obsoleto** — comprobaba la clase `focus-mode`, inexistente desde el sistema de 6 skins. Sustituido por comprobación real de `.skin-btn` y `[data-skin=`.
- **FIX: test E2E roto** — `tests/e2e/commercial.spec.js` hacía clic en `#themeToggle` (no existe en el DOM). Sustituido por un test real sobre `.skin-btn[data-skin="cyberpunk"]` que verifica el cambio de `data-skin` en `<html>` y la clase `.active`.
- **FIX: área táctil insuficiente en skin-picker móvil** — los círculos de selección de skin medían 18–22px, por debajo del mínimo táctil recomendado (44px). Añadida zona de toque invisible de 44×44px mediante `::before`, sin alterar el tamaño visual del punto de color.

## v1.1.0 — 2026-06-28

### Bugs críticos corregidos

- **FIX: Grade de auditoría falso** — `renderAudit` tenía un `Math.max(8.8, ...)` que inflaba artificialmente la puntuación de cualquier modelo. Ahora refleja el score real del modelo sin clamp inferior.
- **FIX: export-grid sin gap** — El div `.export-grid` declarado como `display:grid` heredaba el `gap` de un selector flex compuesto, lo que en la práctica dejaba los botones sin separación. Añadido `gap: .75rem` explícito.
- **FIX: range input sin valor visible** — El slider de intensidad visual no mostraba el número al usuario. Añadido elemento `<output>` vinculado que se actualiza en tiempo real.
- **FIX: Layout grid del workspace** — `control-panel` con `grid-row: span 2` no cubría `product-panel` ni `audit-panel`. Corregido con `grid-column` explícitas para los 5 paneles.
- **FIX: themeToggle reemplazado por sistema de skins** — El botón binario oscuro/foco fue sustituido por un skin picker con 6 temas persistentes.
- **FIX: Responsive del topbar** — En mobile el topbar forzaba `flex-direction: column` pero la lógica no gestionaba correctamente el skin-picker. Corregido.

### Nuevas funcionalidades

- **6 skins visuales con persistencia en localStorage:**
  - `Neon Dark` — original, verde neón sobre azul noche
  - `Focus Light` — modo claro editorial, verde bosque
  - `Cyberpunk` — magenta + cyan eléctrico sobre negro profundo
  - `Aurora` — teal + azul índigo, gradientes boreales
  - `Obsidian` — monocromático premium, dorado pálido sobre negro puro
  - `Solar Warm` — terracota + ámbar sobre crema, tono cálido editorial
- **Skin picker accesible** — grupo de botones con `role="group"`, `aria-label`, `aria-pressed`, tooltips hover y estados visuales claros.
- **CSS custom properties por skin** — todo el color system se expresa via variables `--brand`, `--bg`, `--text`, `--line`, etc. Cero duplicación de layout.
- **Transición suave entre skins** — `transition: background .35s ease` en `body`, `border-color .3s` y `background .35s` en paneles.

### Mejoras de accesibilidad

- `aria-describedby` en el range input vinculado al `<output>`.
- `aria-atomic="true"` en el toast.
- `novalidate` en el form (evita validación nativa HTML5 que podría interferir).
- `role="group"` en device-switch para semántica correcta.
- `aria-label` en el model-grid.

## v1.0.2 — 2026-06-28

- Añadido panel Kit comercial automático.
- Exportación HTML ampliada con KPIs, plan y FAQ.
- Tests E2E Playwright configurados.
- Documentos de proyecto maduro: QUALITY_GATE, SECURITY, CONTRIBUTING.

## v1.0.1 — 2026-06-27

- Auditoría de robustez, móvil y accesibilidad.
- Ajustes CSS: botones táctiles, empty state, overflow-wrap.

## v1.0.0 — 2026-06-27

- Lanzamiento inicial: 1000 modelos, filtros, brief, preview, exportación HTML/JSON.
