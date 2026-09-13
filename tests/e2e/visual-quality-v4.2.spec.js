import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

const appUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4173/';

const expectedProfile = {
  conversion: 'conversion',
  split: 'conversion',
  editorial: 'editorial',
  portfolio: 'immersive',
  dashboard: 'system',
  catalog: 'commerce',
  cinematic: 'immersive',
  magazine: 'editorial',
  event: 'social',
  hospitality: 'immersive',
  docs: 'system',
  community: 'social'
};

async function goToBuilder(page) {
  await page.locator('#briefContinue').click();
  await page.locator('.model-card').first().click();
  await page.locator('#catalogContinue').click();
  await expect(page).toHaveURL(/#paso-3$/);
}

async function goToAudit(page) {
  await goToBuilder(page);
  await page.locator('#builderContinue').click();
  await page.locator('#productContinue').click();
  await expect(page).toHaveURL(/#paso-5$/);
}

async function preview(page) {
  return page.evaluate(async () => {
    const output = await window.WebArchitectProduction.preview();
    return {
      html: output.html,
      architecture: output.architecture,
      profile: output.visualProfile,
      score: output.audit.score,
      total: output.audit.total,
      failed: output.audit.checks.filter((check) => !check.ok).map((check) => check.id),
      budgets: output.audit.budgets
    };
  });
}

test.beforeEach(async ({ page }) => {
  await page.goto(appUrl);
});

test('Visual Quality 4.2 añade Visual DNA, hero SVG, SEO rico y Performance Gate', async ({ page }) => {
  await goToBuilder(page);
  const output = await preview(page);

  expect(output.score).toBeGreaterThanOrEqual(94);
  expect(output.total).toBe(28);
  expect(output.failed).toEqual([]);
  expect(output.html).toContain('data-u404-visual="4.2"');
  expect(output.html).toContain('data-u404-visual-profile=');
  expect(output.html).toContain('u404-v42-hero-visual');
  expect(output.html).toContain('class="u404-v42-svg"');
  expect(output.html).toContain('WebPage');
  expect(output.html).toContain('FAQPage');
  expect(output.html).toContain('content-visibility:auto');
  expect(output.budgets.externalResources).toBe(0);
  expect(output.budgets.htmlBytes).toBeLessThanOrEqual(180000);
  expect(output.budgets.cssBytes).toBeLessThanOrEqual(50000);
  expect(output.budgets.jsBytes).toBeLessThanOrEqual(24000);
});

test('las 12 arquitecturas reciben un perfil Visual DNA específico y pasan el gate', async ({ page }) => {
  await goToBuilder(page);
  const architectures = await page.locator('#architectureSelect option').evaluateAll((options) => options.map((option) => option.value));
  expect(architectures).toHaveLength(12);

  for (const architecture of architectures) {
    await page.locator('#architectureSelect').selectOption(architecture);
    const output = await preview(page);
    expect(output.architecture).toBe(architecture);
    expect(output.profile, `perfil de ${architecture}`).toBe(expectedProfile[architecture]);
    expect(output.score, `score de ${architecture}`).toBeGreaterThanOrEqual(94);
    expect(output.failed, `checks fallidos de ${architecture}`).toEqual([]);
    expect(output.html).toContain(`data-u404-visual-profile="${expectedProfile[architecture]}"`);
    expect(output.html).toContain('u404-v42-hero-visual');
  }
});

test('ZIP 4.2 incluye Visual DNA y reporte de rendimiento', async ({ page }) => {
  await goToAudit(page);
  await page.locator('#productionPublicUrl').fill('https://example.github.io/visual-demo');
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#productionDownload').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toContain('production-v4.2.zip');

  const path = await download.path();
  const rawZip = await readFile(path);
  const text = rawZip.toString('utf8');
  expect(text).toContain('VISUAL_DNA.json');
  expect(text).toContain('PERFORMANCE_REPORT.md');
  expect(text).toContain('"schema": "u404-visual-dna"');
  expect(text).toContain('"version": "4.2"');
  expect(text).toContain('Performance Report — Web Architect 4.2.0');
  expect(text).toContain('sitemap.xml');
});
