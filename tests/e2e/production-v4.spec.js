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

test('Studio 4.0 carga Production Architect y PWA', async ({ page }) => {
  await expect(page).toHaveTitle(/Studio 4\.0.*Production Architect/i);
  await expect(page.locator('.brand-block small')).toContainText('Studio 4.0');
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', 'manifest.webmanifest');
  const apiVersion = await page.evaluate(() => window.WebArchitectProduction?.version);
  expect(apiVersion).toBe('4.0.1');
});

test('Production Gate audita la salida HTML real', async ({ page }) => {
  await goToAudit(page);
  await expect(page.locator('#productionCenter')).toBeVisible();
  await page.locator('#productionAudit').click();
  await expect(page.locator('#productionScore')).toContainText('/100');
  await expect(page.locator('#productionAuditList .production-check')).toHaveCount(10);
  const score = await page.locator('#productionScore').textContent();
  expect(Number.parseInt(score, 10)).toBeGreaterThanOrEqual(80);
});

test('exporta ZIP Production v4 con URL pública y PWA', async ({ page }) => {
  await goToAudit(page);
  await page.locator('#productionPublicUrl').fill('https://example.github.io/demo');
  await page.locator('#productionPwa').check();
  const download = await downloadProductionZip(page);
  await expect(download.suggestedFilename()).toContain('production-v4.zip');
});

test('project.json de Production conserva el brief reimportable', async ({ page }) => {
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
});

test('Production repara el CTA inerte de la arquitectura hospitality', async ({ page }) => {
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
  expect(text).toContain('href="#contacto"');
  expect(text).not.toContain('<button class="cta" type="button">Consultar</button>');
});

test('Production Center mantiene layout sin overflow en móvil', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await goToAudit(page);
  await expect(page.locator('#productionCenter')).toBeVisible();
  const noOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 2);
  expect(noOverflow).toBeTruthy();
});
