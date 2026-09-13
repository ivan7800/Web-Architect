import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const fail = (message) => {
  console.error(`✗ ${message}`);
  process.exitCode = 1;
};
const ok = (condition, message) => {
  if (!condition) fail(message);
};

const index = read('index.html');
const runtime = read('visual-quality-v4.2.js');
const sw = read('studio-sw.js');
const manifest = JSON.parse(read('manifest.webmanifest'));
const pkg = JSON.parse(read('package.json'));
const ci = read('.github/workflows/ci.yml');

ok(pkg.version === '4.2.0', 'package.json debe estar en 4.2.0');
ok(index.includes('visual-quality-v4.2.js'), 'index.html debe cargar visual-quality-v4.2.js');
ok(index.includes('Studio 4.2'), 'index.html debe identificar Studio 4.2');
ok(runtime.includes("const VERSION = '4.2.0'"), 'runtime 4.2 debe declarar versión 4.2.0');
ok(runtime.includes('data-u404-visual-profile') || runtime.includes('u404VisualProfile'), 'runtime debe aplicar Visual DNA por arquitectura');
ok(runtime.includes('u404-v42-hero-visual'), 'runtime debe generar hero visual local');
ok(runtime.includes("'WebPage'"), 'runtime debe enriquecer Schema.org con WebPage');
ok(runtime.includes("'FAQPage'"), 'runtime debe enriquecer Schema.org con FAQPage');
ok(runtime.includes('content-visibility'), 'runtime debe incluir optimización content-visibility');
ok(runtime.includes('v42-html-budget'), 'runtime debe auditar presupuesto HTML');
ok(runtime.includes('v42-css-budget'), 'runtime debe auditar presupuesto CSS');
ok(runtime.includes('v42-js-budget'), 'runtime debe auditar presupuesto JS');
ok(runtime.includes('v42-no-external'), 'runtime debe auditar assets externos');
ok(runtime.includes('PERFORMANCE_REPORT.md'), 'ZIP 4.2 debe incluir PERFORMANCE_REPORT.md');
ok(runtime.includes('VISUAL_DNA.json'), 'ZIP 4.2 debe incluir VISUAL_DNA.json');
ok(runtime.includes('production-v4.2.zip'), 'exportador debe producir ZIP 4.2');
ok(sw.includes("web-architect-studio-v4.2.0"), 'Service Worker debe usar caché 4.2.0');
ok(sw.includes("'./visual-quality-v4.2.js'"), 'Service Worker debe precachear runtime 4.2');
ok(manifest.name.includes('4.2'), 'manifest debe identificar Studio 4.2');
ok(pkg.scripts?.['test:visual']?.includes('validate-visual-quality-v4.2.mjs'), 'package debe exponer test:visual');
ok(ci.includes('npm run test:visual'), 'CI debe ejecutar test:visual');

if (!process.exitCode) console.log('✓ Studio 4.2: Visual DNA, SEO estructurado, Performance Gate, PWA y exportación validados');
