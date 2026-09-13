import { expect, test } from '@playwright/test';

const appUrl = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4173/';

const expectedVariant = {
  conversion: 'pricing',
  split: 'pricing',
  editorial: 'gallery',
  portfolio: 'gallery',
  dashboard: 'stats',
  catalog: 'gallery',
  cinematic: 'gallery',
  magazine: 'gallery',
  event: 'stats',
  hospitality: 'gallery',
  docs: 'stats',
  community: 'stats'
};

async function goToBuilder(page) {
  await page.locator('#briefContinue').click();
  await page.locator('.model-card').first().click();
  await page.locator('#catalogContinue').click();
  await expect(page).toHaveURL(/#paso-3$/);
}

async function premiumPreview(page) {
  return page.evaluate(async () => {
    const output = await window.WebArchitectProduction.preview();
    return {
      html: output.html,
      architecture: output.architecture,
      score: output.audit.score,
      failed: output.audit.checks.filter((check) => !check.ok).map((check) => check.id)
    };
  });
}

test.beforeEach(async ({ page }) => {
  await page.goto(appUrl);
});

test('Premium Output añade navegación móvil, FAQ, formulario local y Schema.org', async ({ page }) => {
  await goToBuilder(page);
  const output = await premiumPreview(page);

  expect(output.score).toBeGreaterThanOrEqual(94);
  expect(output.failed).toEqual([]);
  expect(output.html).toContain('data-u404-premium="4.1"');
  expect(output.html).toContain('class="u404-nav-toggle"');
  expect(output.html).toContain('data-u404-block="faq"');
  expect(output.html).toContain('data-u404-local-form');
  expect(output.html).toContain('type="application/ld+json"');
  expect(output.html).toContain('https://schema.org');
  expect(output.html).not.toContain('XMLHttpRequest(');
});

test('matriz automática valida las 12 arquitecturas con bloque premium adecuado', async ({ page }) => {
  await goToBuilder(page);
  const architectures = await page.locator('#architectureSelect option').evaluateAll((options) => options.map((option) => option.value));
  expect(architectures).toHaveLength(12);
  expect(new Set(architectures).size).toBe(12);

  for (const architecture of architectures) {
    await page.locator('#architectureSelect').selectOption(architecture);
    const output = await premiumPreview(page);
    expect(output.architecture).toBe(architecture);
    expect(output.score, `score de ${architecture}`).toBeGreaterThanOrEqual(94);
    expect(output.failed, `checks fallidos de ${architecture}`).toEqual([]);
    expect(output.html).toContain(`data-architecture="${architecture}"`);
    expect(output.html).toContain(`data-u404-block="${expectedVariant[architecture]}"`);
    expect(output.html).toContain('data-u404-block="trust"');
    expect(output.html).toContain('data-u404-block="faq"');
    expect(output.html).toContain('data-u404-block="local-form"');
  }
});

test('runtime exportado hace funcionales el menú móvil y el formulario local-first', async ({ page }) => {
  await goToBuilder(page);
  const output = await premiumPreview(page);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.setContent(output.html, { waitUntil: 'domcontentloaded' });

  const toggle = page.locator('.u404-nav-toggle');
  await expect(toggle).toBeVisible();
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('.nav')).toHaveAttribute('data-menu-open', 'true');

  const form = page.locator('[data-u404-local-form]');
  await form.locator('[name="name"]').fill('Ada');
  await form.locator('[name="email"]').fill('ada@example.com');
  await form.locator('[name="message"]').fill('Quiero conocer mejor la propuesta.');
  await form.locator('button[type="submit"]').click();
  await expect(form.locator('.u404-form-status')).toContainText('Solicitud guardada localmente');

  const stored = await page.evaluate(() => localStorage.getItem('u404-contact-draft'));
  expect(stored).toContain('ada@example.com');
  expect(stored).toContain('Quiero conocer mejor la propuesta.');
});
