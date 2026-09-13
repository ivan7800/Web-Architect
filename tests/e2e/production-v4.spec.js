import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

const appUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4173/';

async function goToAudit(page) {
  await page.locator('#briefContinue').click();
  await page.locator('.model-card').first().click();
  await page.locator('#catalogContinue').click();
  await page.locator('#builderContinue').click();
  await page.locator('#productContinue').click();
  await expect(page).toHaveURL(/#paso-5$/);
}

async function downloadProductionZip(page) {
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#productionDownload').click();
  return downloadPromise;
}

test.beforeEach(async ({ page }) => {
  await page.goto(appUrl);
});

test('Studio 4.2 carga Visual Quality sobre Premium Output y PWA', async ({ page }) => {
  await expect(page).toHaveTitle(/Studio 4\.2.*Visual Quality/i);
  await expect(page.locator('.brand-block small')).toContainText('Studio 4.2');
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', 'manifest.webmanifest');
  const api = await page.evaluate(() => ({
    version: window.WebArchitectProduction?.version,
    premiumVersion: window.WebArchitectProduction?.premiumVersion,
    visualVersion: window.WebArchitectProduction?.visualVersion,
    baseVersion: window.WebArchitectProduction?.baseVersion
  }));
  expect(api.version).toBe('4.2.0');
  expect(api.premiumVersion).toBe('4.1');
  expect(api.visualVersion).toBe('4.2');
  expect(api.baseVersion).toBe('4.1.0');
});

test('Production Gate 4.2 audita Premium + visual + SEO + rendimiento', async ({ page }) => {
  await goToAudit(page);
  await expect(page.locator('#productionCenter')).toBeVisible();
  await page.locator('#productionAudit').click();
  await expect(page.locator('#productionScore')).toContainText('/100');
  await expect(page.locator('#productionAuditList .production-check')).toHaveCount(28);
  const score = await page.locator('#productionScore').textContent();
  expect(Number.parseInt(score, 10)).toBeGreaterThanOrEqual(94);
});

test('exporta ZIP Production 4.2 con URL pública y PWA', async ({ page }) => {
  await goToAudit(page);
  await page.locator('#productionPublicUrl').fill('https://example.github.io/demo');
  await page.locator('#productionPwa').check();
  const download = await downloadProductionZip(page);
  await expect(download.suggestedFilename()).toContain('production-v4.2.zip');
});

test('project.json de Production conserva brief, Premium 4.1 y Visual 4.2', async ({ page }) => {
  await page.locator('#brandName').fill('Omega Audit');
  await page.locator('#offer').fill('Proyecto funcional auditable');
  await page.locator('#mainCta').fill('Entrar ahora');
  await goToAudit(page);
  const download = await downloadProductionZip(page);
  const path = await download.path();
  const rawZip = await readFile(path);
  const text = rawZip.toString('utf8');
  expect(text).toContain('"schema": "u404-web-architect-project"');
  expect(text).toContain('"brief"');
  expect(text).toContain('"brandName": "Omega Audit"');
  expect(text).toContain('"offer": "Proyecto funcional auditable"');
  expect(text).toContain('"mainCta": "Entrar ahora"');
  expect(text).toContain('"premiumOutput": "4.1"');
  expect(text).toContain('"visualQuality": "4.2"');
  expect(text).toContain('"studioVersion": "4.2.0"');
});

test('Production 4.2 conserva la reparación del CTA de hospitality', async ({ page }) => {
  await page.locator('#briefContinue').click();
  await page.locator('.model-card').first().click();
  await page.locator('#catalogContinue').click();
  await page.locator('#architectureSelect').selectOption('hospitality');
  await page.locator('#builderContinue').click();
  await page.locator('#productContinue').click();
  const download = await downloadProductionZip(page);
  const path = await download.path();
  const rawZip = await readFile(path);
  const text = rawZip.toString('utf8');
  expect(text).toContain('href="#contacto-local"');
  expect(text).not.toContain('<button class="cta" type="button">Consultar</button>');
});

test('Production Center 4.2 mantiene layout sin overflow en móvil', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await goToAudit(page);
  await expect(page.locator('#productionCenter')).toBeVisible();
  const noOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 2);
  expect(noOverflow).toBeTruthy();
});
