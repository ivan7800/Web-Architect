# Security Policy

404 Web Architect Pro es una app estática/offline. No envía datos a servidores, no usa backend y no necesita claves API.

## Superficie de riesgo

- Datos locales en `models.js`.
- Inputs del brief renderizados en preview/exportación.
- Descargas generadas por el navegador.

## Medidas aplicadas

- Content Security Policy defensiva.
- `connect-src 'none'` para evitar llamadas de red desde la app.
- Escape de HTML para contenido generado.
- Saneado de colores hexadecimales antes de usarlos como CSS variables.
- Sin dependencias externas en producción.

## Reporte de vulnerabilidades

Abre un issue privado o contacta con el mantenedor del repositorio. Incluye pasos de reproducción, navegador, sistema operativo y archivo afectado.
