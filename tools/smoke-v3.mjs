import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const dom = new JSDOM(html, {
  runScripts: 'outside-only',
  url: 'https://studio.local/',
  pretendToBeVisual: true
});
const { window } = dom;
let downloadedBlob = null;

window.HTMLElement.prototype.scrollIntoView = () => {};
window.HTMLAnchorElement.prototype.click = () => {};
window.URL.createObjectURL = (blob) => {
  downloadedBlob = blob;
  return 'blob:smoke-test';
};
window.URL.revokeObjectURL = () => {};
window.confirm = () => true;

window.eval(fs.readFileSync(path.join(root, 'models.js'), 'utf8'));
window.eval(fs.readFileSync(path.join(root, 'app.js'), 'utf8'));
window.document.dispatchEvent(new window.Event('DOMContentLoaded', { bubbles: true }));

const $ = (selector) => window.document.querySelector(selector);
const $$ = (selector) => [...window.document.querySelectorAll(selector)];
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

assert($('#architectureSelect').options.length === 12, 'Deben existir 12 arquitecturas');
assert($$('#skinGallery .skin-btn').length === 35, 'Deben existir 35 skins de salida');
assert($('#appTheme').value === 'oro', 'El tema U404 inicial debe ser oro');
assert($$('#sectionEditor .section-editor-row').length >= 4, 'El editor debe cargar secciones');

$('#briefContinue').click();
assert(window.location.hash === '#paso-2', 'El brief debe abrir el catálogo');
$('.model-card').click();
$('#catalogContinue').click();
assert(window.location.hash === '#paso-3', 'El catálogo debe abrir el constructor');

$('#architectureSelect').value = 'dashboard';
$('#architectureSelect').dispatchEvent(new window.Event('change', { bubbles: true }));
assert($('#sitePreview').classList.contains('arch-dashboard'), 'La preview debe aplicar Dashboard');

const before = $$('#sectionEditor .section-editor-row').length;
$('#addSection').click();
assert($$('#sectionEditor .section-editor-row').length === before + 1, 'Añadir sección debe funcionar');

$('#appTheme').value = 'obsidiana';
$('#appTheme').dispatchEvent(new window.Event('change', { bubbles: true }));
assert(window.document.documentElement.dataset.u404Skin === 'obsidiana', 'El tema del estudio debe cambiar');

$('#saveProject').click();
const saved = JSON.parse(window.localStorage.getItem('404-web-architect-studio-project'));
assert(saved.version === 3 && saved.architecture === 'dashboard', 'El guardado debe conservar arquitectura y versión');

$('#downloadZip').click();
assert(downloadedBlob?.type === 'application/zip' && downloadedBlob.size > 1000, 'La exportación ZIP debe generar contenido');
const zipBytes = new Uint8Array(await new Promise((resolve, reject) => {
  const reader = new window.FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = () => reject(reader.error);
  reader.readAsArrayBuffer(downloadedBlob);
}));
assert(zipBytes[0] === 0x50 && zipBytes[1] === 0x4B && zipBytes[2] === 0x03 && zipBytes[3] === 0x04, 'El ZIP debe tener una cabecera válida');
assert(zipBytes.slice(-22, -18).join(',') === '80,75,5,6', 'El ZIP debe contener el directorio final');
fs.writeFileSync('/tmp/u404-studio-smoke.zip', zipBytes);

/* ── Rediseño v3.1 "Mesa del Arquitecto" ──────────────────── */
assert(/crea modelos pro/i.test($('h1').textContent), 'El H1 debe contener "crea modelos pro" (lo espera el E2E de portada)');
assert([...window.document.querySelectorAll('[data-step-back]')].length === 4, 'Deben existir 4 botones Volver (pasos 2 a 5)');
const heroRing = $('#heroScore');
assert(heroRing.style.getPropertyValue('--score') === heroRing.textContent, 'El anillo de puntuación debe sincronizar --score con el texto');
const firstCard = $('#modelGrid .model-card');
assert(firstCard?.getAttribute('style')?.includes('--i:'), 'Las tarjetas del catálogo deben llevar índice de escalonado --i');
window.location.hash = '#paso-2';
window.dispatchEvent(new window.HashChangeEvent('hashchange'));
$('[data-step-back="1"]').click();
window.dispatchEvent(new window.HashChangeEvent('hashchange'));
assert(window.location.hash === '#paso-1', 'El botón Volver debe regresar al paso anterior');
const metricCounters = [...window.document.querySelectorAll('.metrics dt[data-count]')];
assert(metricCounters.length === 3, 'Deben existir 3 contadores animados en las métricas del hero');
const countersSettled = await new Promise((resolve) => {
  const deadline = Date.now() + 3000;
  const check = () => {
    if (metricCounters.every((dt) => dt.textContent === dt.dataset.count)) return resolve(true);
    if (Date.now() > deadline) return resolve(false);
    setTimeout(check, 60);
  };
  check();
});
assert(countersSettled, 'Los contadores deben alcanzar su valor final (1000 / 50 / 12)');

console.log('OK: Studio 3.1 cargado. Arquitecturas, skins, editor, temas, guardado, ZIP y capa de movimiento verificados.');
