import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const fail = (message) => { throw new Error(`[Production v4] ${message}`); };
const expect = (condition, message) => { if (!condition) fail(message); };

const index = read('index.html');
const runtime = read('production-v4.js');
const styles = read('production-v4.css');
const sw = read('studio-sw.js');
const manifest = JSON.parse(read('manifest.webmanifest'));

expect(index.includes('production-v4.css'), 'index.html no carga production-v4.css');
expect(index.includes('production-v4.js'), 'index.html no carga production-v4.js');
expect(index.includes('manifest.webmanifest'), 'index.html no enlaza el manifest');
expect(index.includes('Studio 4.0'), 'la interfaz no muestra Studio 4.0');
expect(runtime.includes('captureGeneratedHtml'), 'falta captura de la salida HTML real');
expect(runtime.includes('auditHtml'), 'falta Production Gate');
expect(runtime.includes('downloadProductionZip'), 'falta exportación ZIP de producción');
expect(runtime.includes('manifest.webmanifest'), 'la exportación no incluye manifest PWA');
expect(runtime.includes('QA_REPORT.md'), 'la exportación no incluye informe QA');
expect(runtime.includes('sitemap.xml'), 'la exportación no contempla sitemap');
expect(runtime.includes('404.html'), 'la exportación no incluye fallback GitHub Pages');
expect(runtime.includes('robots.txt'), 'la exportación no incluye robots.txt');
expect(!/https?:\/\/[^'"`\s]+\.js/i.test(runtime), 'production-v4.js contiene dependencia JS externa');
expect(styles.includes('@media(max-width:620px)'), 'faltan reglas móviles del Production Center');
expect(styles.includes('prefers-reduced-motion'), 'faltan reglas reduced-motion');
expect(sw.includes("const CACHE = 'web-architect-studio-v4.0.0'"), 'Service Worker sin cache versionada v4');
expect(sw.includes('self.skipWaiting()'), 'Service Worker no activa actualización inmediata');
expect(sw.includes('self.clients.claim()'), 'Service Worker no reclama clientes tras activar');
expect(manifest.display === 'standalone', 'manifest no es instalable como standalone');
expect(manifest.start_url === './', 'manifest start_url debe ser relativo para GitHub Pages');
expect(Array.isArray(manifest.icons) && manifest.icons.length > 0, 'manifest sin iconos');

console.log('✓ Production Architect v4: runtime, PWA, export y QA validados');
