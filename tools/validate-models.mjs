import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const source = read('models.js');
const match = source.match(/window\.MODELS_404\s*=\s*(\[[\s\S]*\]);?\s*$/);
if (!match) throw new Error('No se ha encontrado window.MODELS_404 en models.js');

const models = JSON.parse(match[1]);
const required = ['id', 'slug', 'title', 'category', 'style', 'layout', 'purpose', 'audience', 'cta', 'sections', 'palette', 'vibe', 'signature', 'font', 'score', 'tags', 'prompt'];
const ids = new Set();
const slugs = new Set();
const hex = /^#[0-9a-fA-F]{6}$/;

if (models.length !== 1000) throw new Error(`Se esperaban 1000 modelos y hay ${models.length}`);

for (const model of models) {
  for (const key of required) {
    if (!(key in model)) throw new Error(`El modelo ${model.id || 'sin id'} no tiene ${key}`);
  }
  if (ids.has(model.id)) throw new Error(`ID duplicado: ${model.id}`);
  ids.add(model.id);
  if (slugs.has(model.slug)) throw new Error(`Slug duplicado: ${model.slug}`);
  slugs.add(model.slug);
  if (!/^M\d{4}$/.test(model.id)) throw new Error(`${model.id} no cumple formato M0001`);
  if (!Array.isArray(model.sections) || model.sections.length < 6) throw new Error(`${model.id} tiene pocas secciones`);
  if (!Array.isArray(model.palette) || model.palette.length !== 4) throw new Error(`${model.id} debe tener 4 colores`);
  if (!model.palette.every((color) => hex.test(color))) throw new Error(`${model.id} tiene colores inválidos`);
  if (typeof model.score !== 'number' || model.score < 0 || model.score > 100) throw new Error(`${model.id} tiene score inválido`);
  if (!Array.isArray(model.tags) || model.tags.length < 3) throw new Error(`${model.id} debe tener al menos 3 tags`);
  if (new Set(model.tags).size !== model.tags.length) throw new Error(`${model.id} tiene tags duplicados`);
  for (const key of ['title', 'category', 'style', 'layout', 'purpose', 'audience', 'cta', 'vibe', 'signature', 'font', 'prompt']) {
    if (typeof model[key] !== 'string' || model[key].trim().length < 2) throw new Error(`${model.id} tiene ${key} vacío`);
  }
}

const categories = new Set(models.map((model) => model.category));
const styles = new Set(models.map((model) => model.style));
if (categories.size !== 50) throw new Error(`Se esperaban 50 categorías y hay ${categories.size}`);
if (styles.size !== 20) throw new Error(`Se esperaban 20 estilos y hay ${styles.size}`);

const index = read('index.html');
for (const needle of ['modelGrid', 'sitePreview', 'downloadHtml', 'Content-Security-Policy', 'styles.css', 'models.js', 'app.js']) {
  if (!index.includes(needle)) throw new Error(`index.html no contiene ${needle}`);
}

const app = read('app.js');
for (const needle of ['safeStorage', 'safeColor', 'normalizeText', 'buildExportHtml', 'setPreviewMode']) {
  if (!app.includes(needle)) throw new Error(`app.js no contiene ${needle}`);
}

const stylesCss = read('styles.css');
for (const needle of ['@media (max-width: 820px)', '@media (max-width: 520px)', ':focus-visible', '.skin-btn', '.skin-gallery', 'color-mix(in srgb']) {
  if (!stylesCss.includes(needle)) throw new Error(`styles.css no contiene ${needle}`);
}

console.log('OK: app validada. 1000 modelos válidos, 50 categorías, 20 estilos, IDs/slugs únicos, colores seguros y checks GitHub/mobile activos.');
