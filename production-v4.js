(() => {
  'use strict';

  const VERSION = '4.0.1';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const waitFrame = () => new Promise((resolve) => requestAnimationFrame(() => resolve()));

  const toast = (message) => {
    const node = $('#toast');
    if (!node) return;
    node.textContent = message;
    node.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => node.classList.remove('show'), 2600);
  };

  const slugify = (value) => String(value || 'proyecto')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'proyecto';

  const escapeXml = (value) => String(value || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');

  const normalizePublicUrl = (value) => {
    const raw = String(value || '').trim();
    if (!raw) return '';
    try {
      const url = new URL(raw);
      if (!/^https?:$/.test(url.protocol)) return '';
      url.hash = '';
      url.search = '';
      return url.href.replace(/\/$/, '');
    } catch {
      return '';
    }
  };

  const setMeta = (doc, selector, attrs) => {
    let node = doc.head.querySelector(selector);
    if (!node) {
      node = doc.createElement('meta');
      doc.head.appendChild(node);
    }
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    return node;
  };

  const setLink = (doc, selector, attrs) => {
    let node = doc.head.querySelector(selector);
    if (!node) {
      node = doc.createElement('link');
      doc.head.appendChild(node);
    }
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    return node;
  };

  const repairInertControls = (doc) => {
    $$('.booking-bar button[type="button"]', doc).forEach((button) => {
      const link = doc.createElement('a');
      link.className = button.className || 'cta';
      link.href = '#contacto';
      link.textContent = button.textContent?.trim() || 'Consultar';
      button.replaceWith(link);
    });
    return doc;
  };

  async function captureGeneratedHtml() {
    const button = $('#downloadHtml');
    if (!button) throw new Error('No se encontró el exportador HTML del estudio.');

    let capturedBlob = null;
    const originalCreateObjectURL = URL.createObjectURL;
    const originalAnchorClick = HTMLAnchorElement.prototype.click;

    try {
      URL.createObjectURL = function captureBlob(blob) {
        if (blob instanceof Blob && String(blob.type).includes('text/html')) capturedBlob = blob;
        return originalCreateObjectURL.call(URL, blob);
      };
      HTMLAnchorElement.prototype.click = function suppressCaptureDownload() {
        if (String(this.download || '').toLowerCase().endsWith('.html')) return undefined;
        return originalAnchorClick.call(this);
      };

      button.click();
      await waitFrame();
      if (!capturedBlob) throw new Error('El generador no produjo HTML capturable.');
      return await capturedBlob.text();
    } finally {
      URL.createObjectURL = originalCreateObjectURL;
      HTMLAnchorElement.prototype.click = originalAnchorClick;
    }
  }

  const duplicateIds = (doc) => {
    const seen = new Set();
    const duplicates = new Set();
    $$('[id]', doc).forEach((node) => {
      if (seen.has(node.id)) duplicates.add(node.id);
      seen.add(node.id);
    });
    return [...duplicates];
  };

  const auditHtml = (html) => {
    const doc = repairInertControls(new DOMParser().parseFromString(html, 'text/html'));
    const title = doc.querySelector('title')?.textContent.trim() || '';
    const description = doc.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() || '';
    const headings = $$('h1', doc);
    const duplicateIdList = duplicateIds(doc);
    const externalScripts = $$('script[src]', doc).filter((node) => {
      const src = node.getAttribute('src') || '';
      return /^https?:\/\//i.test(src) || src.startsWith('//');
    });
    const inlineHandlers = $$('*', doc).some((node) => [...node.attributes].some((attr) => /^on/i.test(attr.name)));
    const imagesWithoutAlt = $$('img', doc).filter((img) => !img.hasAttribute('alt'));
    const linksWithoutHref = $$('a', doc).filter((link) => !link.getAttribute('href'));
    const styleText = $$('style', doc).map((node) => node.textContent).join('\n');

    const checks = [
      { id: 'title', label: 'SEO · title', ok: title.length >= 10 && title.length <= 70, detail: title ? `${title.length} caracteres.` : 'Falta title.' },
      { id: 'description', label: 'SEO · description', ok: description.length >= 50 && description.length <= 180, detail: description ? `${description.length} caracteres.` : 'Falta meta description.' },
      { id: 'h1', label: 'Semántica · H1 único', ok: headings.length === 1, detail: `${headings.length} H1 detectado${headings.length === 1 ? '' : 's'}.` },
      { id: 'lang', label: 'Accesibilidad · idioma', ok: Boolean(doc.documentElement.lang), detail: doc.documentElement.lang ? `lang=${doc.documentElement.lang}` : 'Falta atributo lang.' },
      { id: 'viewport', label: 'Móvil · viewport', ok: Boolean(doc.querySelector('meta[name="viewport"]')), detail: 'Viewport responsive.' },
      { id: 'responsive', label: 'Móvil · reglas responsive', ok: /@media\s*\(/i.test(styleText), detail: /@media\s*\(/i.test(styleText) ? 'CSS responsive detectado.' : 'No se detectan media queries.' },
      { id: 'alt', label: 'Accesibilidad · imágenes', ok: imagesWithoutAlt.length === 0, detail: `${imagesWithoutAlt.length} imágenes sin alt.` },
      { id: 'links', label: 'Navegación · enlaces', ok: linksWithoutHref.length === 0, detail: `${linksWithoutHref.length} enlaces sin href.` },
      { id: 'ids', label: 'DOM · IDs únicos', ok: duplicateIdList.length === 0, detail: duplicateIdList.length ? `Duplicados: ${duplicateIdList.join(', ')}` : 'Sin IDs duplicados.' },
      { id: 'security', label: 'Seguridad · salida local', ok: externalScripts.length === 0 && !inlineHandlers, detail: externalScripts.length || inlineHandlers ? 'Revisar scripts externos o handlers inline.' : 'Sin scripts externos ni handlers inline.' }
    ];

    const passed = checks.filter((item) => item.ok).length;
    const score = Math.round((passed / checks.length) * 100);
    return { doc, checks, score, passed, total: checks.length };
  };

  const buildManifest = (brand, publicUrl) => JSON.stringify({
    name: brand,
    short_name: brand.slice(0, 24),
    description: `Sitio generado con 404 Web Architect Studio ${VERSION}`,
    id: './',
    start_url: './',
    scope: './',
    display: 'standalone',
    background_color: '#0b0d12',
    theme_color: '#0b0d12',
    icons: [{ src: './icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }],
    ...(publicUrl ? { launch_handler: { client_mode: 'navigate-existing' } } : {})
  }, null, 2);

  const buildIcon = (brand) => {
    const initials = String(brand || '404').trim().slice(0, 3).toUpperCase();
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="${escapeXml(brand)}"><rect width="512" height="512" rx="116" fill="#0b0d12"/><rect x="30" y="30" width="452" height="452" rx="94" fill="none" stroke="#e8cb78" stroke-width="12"/><text x="256" y="292" text-anchor="middle" font-family="system-ui,sans-serif" font-size="138" font-weight="900" fill="#e8cb78">${escapeXml(initials)}</text></svg>`;
  };

  const buildServiceWorker = () => `const CACHE='web-architect-export-v4';\nconst CORE=['./','./index.html','./manifest.webmanifest','./icon.svg'];\nself.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));});\nself.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});\nself.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;const url=new URL(event.request.url);if(url.origin!==location.origin)return;if(event.request.mode==='navigate'){event.respondWith(fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put('./index.html',copy));return response;}).catch(()=>caches.match('./index.html')));return;}event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response;})));});\n`;

  const enhanceHtml = (html, { publicUrl, pwa }) => {
    const doc = repairInertControls(new DOMParser().parseFromString(html, 'text/html'));
    const title = doc.querySelector('title')?.textContent.trim() || ($('#brandName')?.value.trim() || 'Proyecto');
    const description = doc.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() || ($('#offer')?.value.trim() || title);

    setMeta(doc, 'meta[name="generator"]', { name: 'generator', content: `404 Web Architect Studio ${VERSION}` });
    setMeta(doc, 'meta[name="robots"]', { name: 'robots', content: 'index,follow,max-image-preview:large' });
    setMeta(doc, 'meta[property="og:title"]', { property: 'og:title', content: title });
    setMeta(doc, 'meta[property="og:description"]', { property: 'og:description', content: description });
    setMeta(doc, 'meta[property="og:type"]', { property: 'og:type', content: 'website' });
    setMeta(doc, 'meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    setMeta(doc, 'meta[name="theme-color"]', { name: 'theme-color', content: '#0b0d12' });

    if (publicUrl) {
      setLink(doc, 'link[rel="canonical"]', { rel: 'canonical', href: `${publicUrl}/` });
      setMeta(doc, 'meta[property="og:url"]', { property: 'og:url', content: `${publicUrl}/` });
    }

    if (pwa) {
      setLink(doc, 'link[rel="manifest"]', { rel: 'manifest', href: './manifest.webmanifest' });
      setLink(doc, 'link[rel="icon"]', { rel: 'icon', href: './icon.svg', type: 'image/svg+xml' });
      const existing = doc.querySelector('script[data-u404-pwa]');
      if (!existing) {
        const script = doc.createElement('script');
        script.dataset.u404Pwa = 'true';
        script.textContent = "if('serviceWorker' in navigator){addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));}";
        doc.body.appendChild(script);
      }
    }

    doc.documentElement.dataset.generator = `web-architect-${VERSION}`;
    return `<!doctype html>\n${doc.documentElement.outerHTML}`;
  };

  const getProjectSnapshot = (publicUrl, pwa) => ({
    schema: 'u404-web-architect-project',
    version: 4,
    studioVersion: VERSION,
    modelId: $('.model-card.selected')?.dataset.id || localStorage.getItem('404-web-architect-selected') || null,
    brief: {
      brandName: $('#brandName')?.value.trim() || '',
      offer: $('#offer')?.value.trim() || '',
      audience: $('#audience')?.value.trim() || '',
      mainCta: $('#mainCta')?.value.trim() || '',
      tone: $('#tone')?.value || '',
      intensity: Number($('#intensity')?.value || 0)
    },
    architecture: $('#architectureSelect')?.value || null,
    outputSkin: $('.skin-btn.active')?.dataset.skin || localStorage.getItem('404-web-architect-skin') || null,
    appTheme: $('#appTheme')?.value || localStorage.getItem('404-web-architect-app-theme') || 'oro',
    sections: $$('#sectionEditor [data-section-id]').map((row) => ({
      id: row.dataset.sectionId,
      title: $('.section-title-input', row)?.value || '',
      enabled: $('.section-enabled', row)?.checked !== false
    })),
    production: { publicUrl, pwa },
    updatedAt: new Date().toISOString()
  });

  const buildQaReport = (audit, publicUrl, pwa) => {
    const lines = audit.checks.map((item) => `- [${item.ok ? 'x' : ' '}] **${item.label}** — ${item.detail}`);
    return `# Production QA Report\n\n- **Studio:** 404 Web Architect Studio ${VERSION}\n- **Score:** ${audit.score}/100\n- **Resultado:** ${audit.passed}/${audit.total} comprobaciones superadas\n- **URL pública:** ${publicUrl || 'No definida'}\n- **PWA:** ${pwa ? 'Activada' : 'Desactivada'}\n- **Fecha:** ${new Date().toISOString()}\n\n## Comprobaciones\n\n${lines.join('\n')}\n\n## Gate\n\n${audit.score >= 90 ? 'APTO para revisión final y publicación.' : 'REVISAR antes de publicar: corrige los puntos pendientes y vuelve a ejecutar el Production Gate.'}\n`;
  };

  const buildReadme = (brand, publicUrl, pwa, score) => `# ${brand}\n\nExportación Production Architect de **404 Web Architect Studio ${VERSION}**.\n\n## Contenido\n\n- \`index.html\` — web final\n- \`404.html\` — fallback compatible con GitHub Pages\n- \`project.json\` — proyecto reimportable en Web Architect Studio\n- \`QA_REPORT.md\` — auditoría previa a publicación\n${pwa ? '- `manifest.webmanifest`, `sw.js` e `icon.svg` — PWA/offline\n' : ''}- \`.nojekyll\` — compatibilidad GitHub Pages\n${publicUrl ? '- `robots.txt` y `sitemap.xml` — indexación\n' : '- `robots.txt` — reglas básicas de indexación\n'}\n## Quality Gate\n\nPuntuación de exportación: **${score}/100**.\n\n## Publicación en GitHub Pages\n\n1. Sube todos los archivos a la raíz del repositorio.\n2. Ve a **Settings → Pages**.\n3. Selecciona **Deploy from a branch**, rama \`main\` y carpeta \`/root\`.\n4. Publica y comprueba la URL final en móvil y escritorio.\n${publicUrl ? `\nURL configurada: ${publicUrl}/\n` : '\nAntes de SEO definitivo, define la URL pública en Production Center y vuelve a exportar.\n'}\n`;

  const CRC_TABLE = (() => {
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n += 1) {
      let c = n;
      for (let k = 0; k < 8; k += 1) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      table[n] = c >>> 0;
    }
    return table;
  })();

  const crc32 = (bytes) => {
    let crc = 0xFFFFFFFF;
    bytes.forEach((byte) => { crc = CRC_TABLE[(crc ^ byte) & 0xFF] ^ (crc >>> 8); });
    return (crc ^ 0xFFFFFFFF) >>> 0;
  };
  const pushU16 = (target, value) => target.push(value & 255, (value >>> 8) & 255);
  const pushU32 = (target, value) => target.push(value & 255, (value >>> 8) & 255, (value >>> 16) & 255, (value >>> 24) & 255);

  const createZipBlob = (files) => {
    const encoder = new TextEncoder();
    const output = [];
    const central = [];
    let offset = 0;
    Object.entries(files).forEach(([filename, content]) => {
      const name = encoder.encode(filename);
      const data = encoder.encode(String(content));
      const crc = crc32(data);
      const local = [];
      pushU32(local, 0x04034B50); pushU16(local, 20); pushU16(local, 0x0800); pushU16(local, 0);
      pushU16(local, 0); pushU16(local, 0); pushU32(local, crc); pushU32(local, data.length); pushU32(local, data.length);
      pushU16(local, name.length); pushU16(local, 0);
      output.push(...local, ...name, ...data);
      const entry = [];
      pushU32(entry, 0x02014B50); pushU16(entry, 20); pushU16(entry, 20); pushU16(entry, 0x0800); pushU16(entry, 0);
      pushU16(entry, 0); pushU16(entry, 0); pushU32(entry, crc); pushU32(entry, data.length); pushU32(entry, data.length);
      pushU16(entry, name.length); pushU16(entry, 0); pushU16(entry, 0); pushU16(entry, 0); pushU16(entry, 0); pushU32(entry, 0); pushU32(entry, offset);
      central.push(...entry, ...name);
      offset += local.length + name.length + data.length;
    });
    const centralOffset = output.length;
    output.push(...central);
    pushU32(output, 0x06054B50); pushU16(output, 0); pushU16(output, 0);
    pushU16(output, Object.keys(files).length); pushU16(output, Object.keys(files).length);
    pushU32(output, central.length); pushU32(output, centralOffset); pushU16(output, 0);
    return new Blob([new Uint8Array(output)], { type: 'application/zip' });
  };

  const downloadBlob = (filename, blob) => {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1200);
  };

  const renderAudit = (audit) => {
    const score = $('#productionScore');
    const list = $('#productionAuditList');
    if (score) {
      score.textContent = `${audit.score}/100`;
      score.dataset.grade = audit.score >= 90 ? 'pass' : audit.score >= 75 ? 'warn' : 'fail';
    }
    if (list) {
      list.innerHTML = audit.checks.map((item) => `
        <article class="production-check ${item.ok ? 'is-ok' : 'is-warning'}">
          <span class="production-check-dot" aria-hidden="true"></span>
          <div><strong>${item.label}</strong><small>${item.detail}</small></div>
          <span class="badge">${item.ok ? 'OK' : 'Revisar'}</span>
        </article>`).join('');
    }
  };

  async function runProductionAudit() {
    const button = $('#productionAudit');
    if (button) button.disabled = true;
    try {
      const html = await captureGeneratedHtml();
      const audit = auditHtml(html);
      renderAudit(audit);
      window.__WEB_ARCHITECT_V4_LAST_AUDIT__ = audit;
      toast(`Production Gate: ${audit.score}/100.`);
      return { html, audit };
    } catch (error) {
      toast(`No se pudo auditar: ${error.message}`);
      throw error;
    } finally {
      if (button) button.disabled = false;
    }
  }

  async function downloadProductionZip() {
    const button = $('#productionDownload');
    if (button) button.disabled = true;
    try {
      const { html, audit } = await runProductionAudit();
      const publicUrl = normalizePublicUrl($('#productionPublicUrl')?.value);
      const pwa = $('#productionPwa')?.checked !== false;
      const brand = $('#brandName')?.value.trim() || 'Proyecto Web';
      const enhancedHtml = enhanceHtml(html, { publicUrl, pwa });
      const project = getProjectSnapshot(publicUrl, pwa);
      const files = {
        'index.html': enhancedHtml,
        '404.html': enhancedHtml,
        'README.md': buildReadme(brand, publicUrl, pwa, audit.score),
        'project.json': JSON.stringify(project, null, 2),
        'QA_REPORT.md': buildQaReport(audit, publicUrl, pwa),
        'robots.txt': publicUrl ? `User-agent: *\nAllow: /\nSitemap: ${publicUrl}/sitemap.xml\n` : 'User-agent: *\nAllow: /\n',
        '.nojekyll': ''
      };
      if (publicUrl) {
        files['sitemap.xml'] = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escapeXml(publicUrl)}/</loc><changefreq>monthly</changefreq><priority>1.0</priority></url></urlset>\n`;
      }
      if (pwa) {
        files['manifest.webmanifest'] = buildManifest(brand, publicUrl);
        files['sw.js'] = buildServiceWorker();
        files['icon.svg'] = buildIcon(brand);
      }
      downloadBlob(`${slugify(brand)}-production-v4.zip`, createZipBlob(files));
      toast(`ZIP Production v4 exportado · QA ${audit.score}/100.`);
    } catch (error) {
      console.error('[Web Architect v4]', error);
    } finally {
      if (button) button.disabled = false;
    }
  }

  const injectProductionCenter = () => {
    const auditPanel = $('.audit-panel');
    if (!auditPanel || $('#productionCenter')) return;
    const footer = $('.step-footer', auditPanel);
    const section = document.createElement('section');
    section.className = 'production-center';
    section.id = 'productionCenter';
    section.setAttribute('aria-labelledby', 'production-title');
    section.innerHTML = `
      <div class="production-head">
        <div>
          <p class="eyebrow">Production Architect · v${VERSION}</p>
          <h3 id="production-title">Preflight antes de publicar</h3>
          <p>Audita la salida real y genera un paquete GitHub Pages con SEO técnico, QA y PWA opcional.</p>
        </div>
        <strong id="productionScore" class="production-score" data-grade="idle">—/100</strong>
      </div>
      <div class="production-controls">
        <label>URL pública <span>(opcional)</span><input id="productionPublicUrl" type="url" inputmode="url" placeholder="https://usuario.github.io/proyecto"></label>
        <label class="production-toggle"><input id="productionPwa" type="checkbox" checked><span>Incluir PWA/offline</span></label>
        <button class="ghost" id="productionAudit" type="button">Ejecutar Production Gate</button>
        <button class="primary" id="productionDownload" type="button">Descargar ZIP Producción</button>
      </div>
      <div class="production-audit-list" id="productionAuditList" aria-live="polite">
        <p class="production-empty">Ejecuta el Production Gate para revisar la salida generada.</p>
      </div>`;
    auditPanel.insertBefore(section, footer || null);
    $('#productionAudit')?.addEventListener('click', () => runProductionAudit().catch(() => {}));
    $('#productionDownload')?.addEventListener('click', downloadProductionZip);
  };

  const updateStudioBranding = () => {
    document.title = '404 Web Architect Studio 4.0 · Production Architect';
    const label = $('.brand-block small');
    if (label) label.textContent = 'Studio 4.0 · Production Architect · offline';
    const heroLead = $('.hero-copy .lead');
    if (heroLead && !heroLead.textContent.includes('Production Gate')) {
      heroLead.textContent = 'Combina 1000 direcciones creativas con 12 arquitecturas reales, edita secciones, ejecuta Production Gate y descarga una web lista para GitHub Pages.';
    }
  };

  const registerStudioServiceWorker = () => {
    if (!('serviceWorker' in navigator) || !/^https?:$/.test(location.protocol)) return;
    window.addEventListener('load', () => navigator.serviceWorker.register('./studio-sw.js').catch(() => {}), { once: true });
  };

  const init = () => {
    updateStudioBranding();
    injectProductionCenter();
    registerStudioServiceWorker();
    document.documentElement.dataset.studioVersion = VERSION;
    window.WebArchitectProduction = Object.freeze({ version: VERSION, audit: runProductionAudit, exportZip: downloadProductionZip });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();