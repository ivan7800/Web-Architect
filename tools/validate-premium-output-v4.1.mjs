import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const fail = (message) => { throw new Error(`[Premium Output 4.1] ${message}`); };
const expect = (condition, message) => { if (!condition) fail(message); };

const runtime = read('production-v4.js');
const app = read('app.js');
const pkg = JSON.parse(read('package.json'));

const architectureBlock = app.match(/const ARCHITECTURES = \[(.*?)\];\s*\n\s*const SKIN_CATEGORIES/s)?.[1] || '';
const architectureIds = [...architectureBlock.matchAll(/id:'([^']+)'/g)].map((match) => match[1]);

expect(pkg.version === '4.1.0', 'package.json no está en 4.1.0');
expect(architectureIds.length === 12, `se esperaban 12 arquitecturas y se detectaron ${architectureIds.length}`);
expect(runtime.includes('ensureMobileNavigation'), 'falta navegación móvil premium');
expect(runtime.includes('injectPremiumBlocks'), 'falta inyector de bloques premium');
expect(runtime.includes('buildPricingBlock'), 'falta bloque pricing');
expect(runtime.includes('buildGalleryBlock'), 'falta bloque galería');
expect(runtime.includes('buildStatsBlock'), 'falta bloque de métricas');
expect(runtime.includes('buildFaqBlock'), 'falta FAQ funcional');
expect(runtime.includes('buildLocalFormBlock'), 'falta formulario local-first');
expect(runtime.includes('injectStructuredData'), 'falta Schema.org JSON-LD');
expect(runtime.includes("'@context': 'https://schema.org'"), 'Schema.org no usa contexto oficial');
expect(runtime.includes("localStorage.setItem('u404-contact-draft'"), 'el formulario local no persiste borrador');
expect(runtime.includes('navigator.clipboard.writeText'), 'el formulario local no prepara/copia la solicitud');
expect(runtime.includes('data-u404-block'), 'la salida no marca bloques auditables');
expect(runtime.includes('premiumBlocks.length >= 4'), 'Production Gate no exige densidad mínima de bloques premium');
expect(runtime.includes('faqCount >= 3'), 'Production Gate no valida FAQ');
expect(runtime.includes('mobile-nav'), 'Production Gate no valida navegación móvil');
expect(runtime.includes('local-form'), 'Production Gate no valida formulario local');
expect(runtime.includes('schema'), 'Production Gate no valida Schema.org');
expect(!runtime.includes('XMLHttpRequest('), 'Premium Output no debe enviar datos por XMLHttpRequest');
expect(!/fetch\s*\(\s*['"`]/.test(runtime), 'Premium Output contiene una llamada fetch directa');

console.log(`✓ Premium Output 4.1: ${architectureIds.length} arquitecturas, bloques funcionales, Schema.org, navegación móvil y formulario local validados`);
