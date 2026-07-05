import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));
const fail = (message) => { throw new Error(message); };

const requiredFiles = [
  'index.html',
  'styles.css',
  'app.js',
  'models.js',
  'README.md',
  'LICENSE',
  'INFORME_FINAL.md',
  'QUALITY_GATE.md',
  'SECURITY.md',
  'CHANGELOG.md',
  'CONTRIBUTING.md',
  'playwright.config.js',
  'tests/e2e/commercial.spec.js',
  'demo/desktop-preview.svg',
  'demo/mobile-preview.svg',
  '.github/workflows/validate.yml',
  '.gitignore'
];
for (const file of requiredFiles) {
  if (!exists(file)) fail(`Falta archivo requerido: ${file}`);
}

const index = read('index.html');
const styles = read('styles.css');
const app = read('app.js');
const readme = read('README.md');
const workflow = read('.github/workflows/validate.yml');
const pkg = JSON.parse(read('package.json'));
const e2e = read('tests/e2e/commercial.spec.js');
const playwrightConfig = read('playwright.config.js');

const ids = [...index.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
const duplicates = ids.filter((id, index, all) => all.indexOf(id) !== index);
if (duplicates.length) fail(`IDs duplicados en index.html: ${[...new Set(duplicates)].join(', ')}`);

for (const id of [
  'modelGrid', 'sitePreview', 'blueprintOutput', 'copyBlueprint', 'downloadKit', 'copyChecklist',
  'downloadHtml', 'downloadJson', 'desktopPreview', 'mobilePreview'
]) {
  if (!ids.includes(id)) fail(`Falta id crítico en index.html: ${id}`);
  if (!app.includes(`#${id}`) && !app.includes(`$('#${id}')`)) fail(`app.js no referencia el id crítico: ${id}`);
}

// Sistema de skins v2.0: galería de datos en app.js (SKINS), ya no
// un skin-picker de 6 botones fijos en el header (ver CHANGELOG.md)
if (!index.includes('class="skin-gallery"')) fail('Falta skin-gallery en index.html');
if (!index.includes('id="skinSearch"') || !index.includes('id="skinChips"')) {
  fail('Falta buscador o chips de categoría de la galería de skins');
}
if (!app.includes('const SKINS = [') || !app.includes('applySkin') || !app.includes('renderSkinGallery')) {
  fail('app.js no implementa correctamente la galería de skins v2.0');
}
const skinIds = [...app.matchAll(/id: '([a-z0-9-]+)'/g)].map((m) => m[1]);
if (skinIds.length < 30) fail(`Se esperaban al menos 30 skins, encontradas: ${skinIds.length}`);
if (new Set(skinIds).size !== skinIds.length) fail('Hay ids de skin duplicados en app.js');
if (!skinIds.includes('cyberpunk') || !skinIds.includes('dark')) {
  fail('Faltan skins históricas esperadas (dark, cyberpunk)');
}

for (const needle of [
  'Content-Security-Policy',
  "connect-src 'none'",
  "object-src 'none'",
  "form-action 'none'"
]) {
  if (!index.includes(needle)) fail(`CSP incompleta: ${needle}`);
}

const externalLinks = [...index.matchAll(/(?:src|href)="(https?:\/\/[^\"]+)"/g)].map((match) => match[1]);
if (externalLinks.length) fail(`index.html no debe depender de recursos externos: ${externalLinks.join(', ')}`);

for (const needle of [
  'safeStorage',
  'safeColor',
  'normalizeText',
  'buildBlueprintData',
  'buildMarkdownKit',
  'buildExportHtml',
  'setPreviewMode',
  'aria-pressed'
]) {
  if (!app.includes(needle)) fail(`app.js no contiene ${needle}`);
}

for (const needle of [
  '@media (max-width: 820px)',
  '@media (max-width: 520px)',
  '@media (prefers-reduced-motion: reduce)',
  '.blueprint-output',
  ':focus-visible',
  'overflow-wrap: anywhere'
]) {
  if (!styles.includes(needle)) fail(`styles.css no contiene ${needle}`);
}

for (const [script, command] of Object.entries({
  test: 'validate-models',
  'test:e2e': 'playwright test',
  'test:all': 'test:e2e'
})) {
  if (!pkg.scripts?.[script]?.includes(command)) fail(`package.json script ${script} no contiene ${command}`);
}
if (!pkg.devDependencies?.['@playwright/test']) fail('package.json no declara @playwright/test');

for (const needle of [
  'demo/desktop-preview.svg',
  'demo/mobile-preview.svg',
  'npm run test:e2e',
  'Kit comercial',
  'GitHub Pages'
]) {
  if (!readme.includes(needle)) fail(`README.md no contiene ${needle}`);
}

for (const needle of [
  'npm install',
  'npx playwright install',
  'npm run test:e2e',
  'upload-artifact'
]) {
  if (!workflow.includes(needle)) fail(`Workflow no contiene ${needle}`);
}

for (const needle of [
  "getByRole('heading'",
  'downloadKit',
  'scrollWidth',
  'aria-pressed'
]) {
  if (!e2e.includes(needle)) fail(`Test E2E no cubre ${needle}`);
}
if (!playwrightConfig.includes('mobile-chromium')) fail('Playwright config no incluye proyecto móvil');

console.log('OK: app comercial validada. Producto, demo, seguridad, móvil, documentación, GitHub Actions y Playwright E2E presentes.');
