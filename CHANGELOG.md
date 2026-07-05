# Changelog

## v2.1.2 — Web upload clean para GitHub

### Corrección principal

- Eliminada la carpeta `.github/workflows/` para evitar errores de commit/subida desde la interfaz web de GitHub.
- Preparado ZIP de publicación directa con solo archivos estáticos y documentación.
- Actualizadas instrucciones de subida a GitHub con método en una tanda y método alternativo en dos tandas.

### Se mantiene de v2.1.1

- Botón **Empezar de cero** en cabecera.
- Botón **Crear otro proyecto** al finalizar auditoría.
- Reset completo de progreso, brief, modelo, skin, filtros, errores y hash.
- Bloqueo reforzado de pasos para impedir saltos manuales por URL.
- Accesibilidad mejorada con `aria-disabled` en pasos bloqueados.

## v2.1.1 — Reset completo y stepper reforzado

- Añadido reinicio completo del flujo guiado.
- Añadido bloqueo defensivo de navegación por hash.
- Añadida documentación de calidad y subida.

## v2.0.0 — Flujo guiado en 5 pasos

- Wizard con navegación por hash `#paso-1`…`#paso-5`.
- Brief obligatorio.
- Recomendación real según brief.
- Sistema de skins premium.
