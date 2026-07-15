# Quality Gate

Checklist mínimo antes de publicar una release:

## Funcional

- [ ] La app carga desde `index.html` y desde servidor estático.
- [ ] El contador muestra 1000 modelos.
- [ ] La búsqueda funciona con y sin tildes.
- [ ] Se puede seleccionar un modelo y actualizar preview.
- [ ] Las 12 arquitecturas cambian la composición del preview y del HTML.
- [ ] Secciones: renombrar, ocultar, ordenar, añadir y eliminar.
- [ ] El tema U404 del estudio no modifica la skin de salida.
- [ ] Guardar, importar y recuperar un proyecto conserva su estado.
- [ ] Se puede exportar HTML, JSON, kit Markdown y ZIP GitHub Pages.
- [ ] El modo móvil de preview funciona.

## UX móvil

- [ ] Sin scroll horizontal en 360 px, 390 px, 768 px y escritorio.
- [ ] Botones con área táctil cómoda.
- [ ] Hero legible sin cortar contenido.
- [ ] Paneles apilados en orden lógico.

## Accesibilidad

- [ ] Foco visible en botones, inputs, selects y enlaces.
- [ ] `aria-pressed` correcto en toggles.
- [ ] Skip link funcional.
- [ ] Contraste aceptable en modo oscuro y foco.

## Seguridad

- [ ] CSP presente en `index.html`.
- [ ] Sin recursos externos en producción.
- [ ] HTML dinámico escapado.
- [ ] Colores saneados antes de usarlos en CSS.
- [ ] JSON importado limitado y normalizado antes de renderizar.

## GitHub

- [ ] `npm test` pasa.
- [ ] `npm run test:e2e` pasa en CI.
- [ ] README actualizado con demo, uso y publicación.
- [ ] Licencia MIT presente.
