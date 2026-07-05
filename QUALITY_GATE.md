# Quality Gate

Checklist mínimo antes de publicar una release:

## Funcional

- [ ] La app carga desde `index.html` y desde servidor estático.
- [ ] El contador muestra 1000 modelos.
- [ ] La búsqueda funciona con y sin tildes.
- [ ] Se puede seleccionar un modelo y actualizar preview.
- [ ] Se puede exportar HTML, JSON y kit Markdown.
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

## GitHub

- [ ] `npm test` pasa.
- [ ] `npm run test:e2e` pasa en CI.
- [ ] README actualizado con demo, uso y publicación.
- [ ] Licencia MIT presente.
