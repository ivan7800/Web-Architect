# 404 Web Architect Pro v2.1.2 Web Upload Clean

Versión estática preparada para publicar directamente en GitHub Pages desde la interfaz web de GitHub.

## Qué corrige esta versión

- Elimina `.github/workflows/quality.yml` para evitar errores de permisos o bloqueo al hacer commit desde la web de GitHub.
- Mantiene solo archivos estáticos compatibles con GitHub Pages.
- Conserva el botón **Empezar de cero** y el botón **Crear otro proyecto**.
- Refuerza el bloqueo de pasos: no se puede saltar a `#paso-5` manualmente si los pasos anteriores no están completados.
- Limpia progreso, brief, modelo, skin, filtros y hash al reiniciar.

## Archivos que debes subir

Sube el contenido descomprimido de esta carpeta al repositorio, no el ZIP.

```text
index.html
styles.css
app.js
models.js
demo/
README.md
LICENSE
CHANGELOG.md
INFORME_FINAL.md
QUALITY_GATE.md
SECURITY.md
INSTRUCCIONES_SUBIDA_GITHUB.md
MANIFIESTO_ARCHIVOS.txt
.nojekyll
```

## Publicación en GitHub Pages

1. Descomprime el ZIP.
2. Entra dentro de la carpeta descomprimida.
3. Selecciona todos los archivos y carpetas de dentro.
4. Arrástralos a GitHub en **Add file → Upload files**.
5. Escribe un commit simple, por ejemplo: `Initial web upload clean`.
6. Pulsa **Commit changes**.
7. Ve a **Settings → Pages**.
8. Source: **Deploy from a branch**.
9. Branch: **main** / carpeta **root**.
10. Guarda y espera a que GitHub Pages publique.

## Nota importante

Esta versión no incluye GitHub Actions. Para una web estática de GitHub Pages no hace falta. Quitar Actions reduce el riesgo de error al subir desde navegador.
