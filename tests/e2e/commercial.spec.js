import { expect, test } from '@playwright/test';
const appUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4173/';

/* El flujo Studio es un wizard de 5 pasos: cada panel está oculto
   (display:none) hasta que el usuario avanza en orden. Estos
   helpers reproducen ese avance antes de interactuar con
   elementos de pasos posteriores. */
async function goToCatalog(page) {
  await page.locator('#briefContinue').click();
  await expect(page).toHaveURL(/#paso-2$/);
}
async function goToPersonalizar(page) {
  await goToCatalog(page);
  await page.locator('.model-card').first().click();
  await page.locator('#catalogContinue').click();
  await expect(page).toHaveURL(/#paso-3$/);
}
async function goToExportar(page) {
  await goToPersonalizar(page);
  await page.locator('#builderContinue').click();
  await expect(page).toHaveURL(/#paso-4$/);
}
async function goToAuditoria(page) {
  await goToExportar(page);
  await page.locator('#productContinue').click();
  await expect(page).toHaveURL(/#paso-5$/);
}

test.beforeEach(async ({ page }) => {
  await page.goto(appUrl);
});

test('carga el paso 1 con el brief y el hero visibles', async ({ page }) => {
  await expect(page.getByRole('heading', { name: /crea modelos pro/i })).toBeVisible();
  await expect(page.locator('.step-panel[data-step="1"]')).toBeVisible();
  await expect(page.locator('.step-panel[data-step="2"]')).toBeHidden();
});

test('el brief obligatorio bloquea el avance si está incompleto', async ({ page }) => {
  await page.locator('#brandName').fill('');
  await page.locator('#briefContinue').click();
  await expect(page).toHaveURL(/#paso-1$/);
  await expect(page.locator('#briefError')).toBeVisible();
});

test('completar el brief desbloquea el catálogo con recomendados', async ({ page }) => {
  await goToCatalog(page);
  await expect(page.locator('#resultCount')).toContainText('1000');
  await expect(page.locator('#recommendedGrid .model-card')).not.toHaveCount(0);
  await expect(page.locator('.step-pill[data-target="1"]')).toHaveAttribute('data-state', 'done');
});

test('seleccionar un modelo actualiza el kit comercial y el preview', async ({ page }) => {
  await goToCatalog(page);
  await expect(page.locator('.model-card').first()).toBeVisible();
  await page.locator('.model-card').first().click();
  await page.locator('#catalogContinue').click();
  await page.locator('#brandName').fill('Omega Studio');
  await page.locator('#applyBrief').click();
  await expect(page.locator('#sitePreview')).toContainText('Omega Studio');
});

test('la galería de skins filtra por categoría y busca por nombre', async ({ page }) => {
  await goToPersonalizar(page);
  await expect(page.locator('#skinGallery .skin-btn')).toHaveCount(35);

  await page.locator('.skin-chip[data-cat="gotico"]').click();
  await expect(page.locator('#skinGallery .skin-btn')).toHaveCount(6);

  await page.locator('.skin-chip[data-cat=""]').click();
  await page.locator('#skinSearch').fill('cyberpunk');
  await expect(page.locator('#skinGallery .skin-btn')).toHaveCount(1);

  await page.locator('.skin-btn[data-skin="cyberpunk"]').click();
  await expect(page.locator('html')).toHaveAttribute('data-skin', 'cyberpunk');
  await expect(page.locator('.skin-btn[data-skin="cyberpunk"]')).toHaveClass(/active/);
});

test('Studio 3.0 separa tema U404, arquitectura y skin de salida', async ({ page }) => {
  await goToPersonalizar(page);
  await expect(page.locator('#architectureSelect option')).toHaveCount(12);

  await page.locator('#appTheme').selectOption('obsidiana');
  await expect(page.locator('html')).toHaveAttribute('data-u404-skin', 'obsidiana');

  await page.locator('#architectureSelect').selectOption('dashboard');
  await expect(page.locator('#sitePreview')).toHaveClass(/arch-dashboard/);

  const originalSections = await page.locator('#sectionEditor .section-editor-row').count();
  await page.locator('#addSection').click();
  await expect(page.locator('#sectionEditor .section-editor-row')).toHaveCount(originalSections + 1);

  await page.locator('#saveProject').click();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('404-web-architect-studio-project')));
  expect(saved.version).toBe(3);
  expect(saved.architecture).toBe('dashboard');
});

test('modo móvil no provoca scroll horizontal y cambia la preview', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await goToPersonalizar(page);
  await expect(page.locator('#desktopPreview')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('#mobilePreview').click();
  await expect(page.locator('#mobilePreview')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#previewShell')).toHaveClass(/mobile/);
  const hasNoHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 2);
  expect(hasNoHorizontalOverflow).toBeTruthy();
  await expect(page.locator('.stepper')).toBeVisible();
});

test('exporta HTML, JSON y kit Markdown descargables', async ({ page }) => {
  await goToExportar(page);
  const htmlDownload = page.waitForEvent('download');
  await page.locator('#downloadHtml').click();
  await expect((await htmlDownload).suggestedFilename()).toContain('landing.html');

  const zipDownload = page.waitForEvent('download');
  await page.locator('#downloadZip').click();
  await expect((await zipDownload).suggestedFilename()).toContain('github-pages.zip');

  const jsonDownload = page.waitForEvent('download');
  await page.locator('#downloadJson').click();
  await expect((await jsonDownload).suggestedFilename()).toContain('modelo.json');

  const kitDownload = page.waitForEvent('download');
  await page.locator('#downloadKit').click();
  await expect((await kitDownload).suggestedFilename()).toContain('kit-comercial.md');
});

test('la auditoría final es informativa y no bloquea el cierre del flujo', async ({ page }) => {
  await goToAuditoria(page);
  await expect(page.locator('#auditGrade')).toBeVisible();
  await page.locator('#finishBtn').click();
  await expect(page.locator('#toast')).toHaveClass(/show/);
});

test('no se puede saltar a un paso nunca alcanzado', async ({ page }) => {
  await goToCatalog(page);
  await page.locator('.step-pill[data-target="5"]').click();
  await expect(page).toHaveURL(/#paso-2$/);
});
