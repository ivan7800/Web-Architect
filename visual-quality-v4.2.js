(() => {
  'use strict';

  const VERSION = '4.2.0';
  const VISUAL_VERSION = '4.2';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const waitFrame = () => new Promise((resolve) => requestAnimationFrame(() => resolve()));
  const base = window.WebArchitectProduction;

  if (!base || typeof base.preview !== 'function') {
    console.error('[Web Architect 4.2] Premium Output Engine 4.1 no disponible.');
    return;
  }

  const toast = (message) => {
    const node = $('#toast');
    if (!node) return;
    node.textContent = message;
    node.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => node.classList.remove('show'), 2800);
  };

  const escapeHtml = (value) => String(value ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');

  const escapeXml = (value) => String(value ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');

  const slugify = (value) => String(value || 'proyecto')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'proyecto';

  const byteSize = (value) => new TextEncoder().encode(String(value || '')).length;

  const setMeta = (doc, selector, attrs) => {
    let node = doc.head.querySelector(selector);
    if (!node) {
      node = doc.createElement('meta');
      doc.head.appendChild(node);
    }
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    return node;
  };

  const profileFor = (architecture) => {
    if (['editorial', 'magazine'].includes(architecture)) return 'editorial';
    if (['portfolio', 'cinematic', 'hospitality'].includes(architecture)) return 'immersive';
    if (['dashboard', 'docs'].includes(architecture)) return 'system';
    if (['catalog'].includes(architecture)) return 'commerce';
    if (['event', 'community'].includes(architecture)) return 'social';
    return 'conversion';
  };

  const contextFromStudio = (output) => ({
    brand: $('#brandName')?.value.trim() || 'Proyecto Web',
    offer: $('#offer')?.value.trim() || 'Una propuesta digital clara y útil',
    audience: $('#audience')?.value.trim() || 'personas que buscan una experiencia clara',
    mainCta: $('#mainCta')?.value.trim() || 'Contactar',
    tone: $('#tone')?.value || '',
    intensity: Number($('#intensity')?.value || 0),
    architecture: output.architecture || $('#architectureSelect')?.value || 'conversion',
    publicUrl: output.publicUrl || '',
    pwa: output.pwa !== false,
    sections: $$('#sectionEditor [data-section-id]')
      .filter((row) => $('.section-enabled', row)?.checked !== false)
      .map((row) => $('.section-title-input', row)?.value?.trim())
      .filter(Boolean)
      .slice(0, 10)
  });

  const heroSvg = (context, profile) => {
    const label = escapeHtml(`${context.brand} · dirección visual ${profile}`);
    const common = `viewBox="0 0 720 440" role="img" aria-label="${label}" class="u404-v42-svg"`;
    const title = `<title>${label}</title>`;

    if (profile === 'editorial') return `<svg ${common}>${title}<rect width="720" height="440" rx="28" fill="currentColor" opacity=".035"/><line x1="52" y1="66" x2="668" y2="66" stroke="currentColor" opacity=".22"/><line x1="52" y1="372" x2="668" y2="372" stroke="currentColor" opacity=".22"/><text x="52" y="210" fill="currentColor" font-size="132" font-family="Georgia,serif" font-weight="700" opacity=".9">${escapeXml(context.brand.slice(0, 2).toUpperCase())}</text><text x="56" y="278" fill="currentColor" font-size="21" font-family="system-ui,sans-serif" opacity=".62">EDITORIAL / ${escapeXml(context.architecture.toUpperCase())}</text><rect x="470" y="116" width="198" height="198" rx="8" fill="none" stroke="currentColor" opacity=".28"/><rect x="496" y="142" width="146" height="146" rx="73" fill="currentColor" opacity=".08"/></svg>`;

    if (profile === 'immersive') return `<svg ${common}>${title}<defs><linearGradient id="u404g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="currentColor" stop-opacity=".22"/><stop offset="1" stop-color="currentColor" stop-opacity=".02"/></linearGradient></defs><rect width="720" height="440" rx="28" fill="url(#u404g)"/><circle cx="555" cy="118" r="82" fill="currentColor" opacity=".12"/><path d="M0 352 142 214 278 322 416 162 720 360V440H0Z" fill="currentColor" opacity=".12"/><path d="M0 385 194 270 326 358 500 246 720 382" fill="none" stroke="currentColor" stroke-width="3" opacity=".34"/><text x="52" y="82" fill="currentColor" font-family="system-ui,sans-serif" font-size="17" font-weight="800" opacity=".7">${escapeXml(context.brand.toUpperCase())}</text><text x="52" y="112" fill="currentColor" font-family="system-ui,sans-serif" font-size="13" opacity=".5">IMMERSIVE VISUAL / ${escapeXml(context.architecture.toUpperCase())}</text></svg>`;

    if (profile === 'system') return `<svg ${common}>${title}<rect width="720" height="440" rx="28" fill="currentColor" opacity=".025"/><g stroke="currentColor" opacity=".11"><path d="M40 88H680M40 160H680M40 232H680M40 304H680M40 376H680"/><path d="M120 40V400M240 40V400M360 40V400M480 40V400M600 40V400"/></g><rect x="64" y="76" width="204" height="112" rx="16" fill="currentColor" opacity=".1"/><rect x="294" y="76" width="362" height="48" rx="14" fill="currentColor" opacity=".15"/><rect x="294" y="140" width="274" height="48" rx="14" fill="currentColor" opacity=".07"/><rect x="64" y="216" width="592" height="152" rx="18" fill="none" stroke="currentColor" opacity=".24"/><polyline points="92,330 172,284 248,316 340,250 430,292 520,236 626,274" fill="none" stroke="currentColor" stroke-width="5" opacity=".58"/><text x="84" y="112" fill="currentColor" font-size="18" font-family="ui-monospace,monospace" font-weight="800">${escapeXml(context.brand.slice(0, 18))}</text></svg>`;

    if (profile === 'commerce') return `<svg ${common}>${title}<rect width="720" height="440" rx="28" fill="currentColor" opacity=".025"/><g fill="currentColor"><rect x="50" y="62" width="188" height="316" rx="22" opacity=".08"/><rect x="266" y="62" width="188" height="316" rx="22" opacity=".13"/><rect x="482" y="62" width="188" height="316" rx="22" opacity=".08"/><rect x="70" y="82" width="148" height="158" rx="14" opacity=".12"/><rect x="286" y="82" width="148" height="158" rx="14" opacity=".2"/><rect x="502" y="82" width="148" height="158" rx="14" opacity=".12"/></g><g stroke="currentColor" opacity=".28"><path d="M72 280H198M288 280H414M504 280H630"/><path d="M72 310H168M288 310H384M504 310H600"/></g></svg>`;

    if (profile === 'social') return `<svg ${common}>${title}<rect width="720" height="440" rx="28" fill="currentColor" opacity=".025"/><g stroke="currentColor" stroke-width="2" opacity=".22"><path d="M360 218 176 116M360 218 554 106M360 218 594 304M360 218 166 326M176 116 166 326M554 106 594 304"/></g><g fill="currentColor"><circle cx="360" cy="218" r="64" opacity=".18"/><circle cx="176" cy="116" r="38" opacity=".11"/><circle cx="554" cy="106" r="44" opacity=".14"/><circle cx="594" cy="304" r="34" opacity=".1"/><circle cx="166" cy="326" r="48" opacity=".13"/></g><text x="360" y="225" text-anchor="middle" fill="currentColor" font-family="system-ui,sans-serif" font-size="16" font-weight="900">${escapeXml(context.brand.slice(0, 16))}</text></svg>`;

    return `<svg ${common}>${title}<rect width="720" height="440" rx="28" fill="currentColor" opacity=".025"/><rect x="54" y="64" width="612" height="312" rx="28" fill="none" stroke="currentColor" opacity=".18"/><circle cx="566" cy="152" r="92" fill="currentColor" opacity=".1"/><rect x="88" y="112" width="286" height="28" rx="14" fill="currentColor" opacity=".34"/><rect x="88" y="162" width="420" height="18" rx="9" fill="currentColor" opacity=".12"/><rect x="88" y="196" width="350" height="18" rx="9" fill="currentColor" opacity=".08"/><rect x="88" y="266" width="148" height="52" rx="26" fill="currentColor" opacity=".75"/><text x="88" y="94" fill="currentColor" font-family="system-ui,sans-serif" font-size="14" font-weight="900" opacity=".7">${escapeXml(context.brand.toUpperCase())}</text></svg>`;
  };

  const enhanceHero = (doc, context, profile) => {
    const heroArt = $('.hero-art', doc);
    if (!heroArt) return false;
    heroArt.classList.add('u404-v42-hero-visual');
    heroArt.dataset.visualProfile = profile;
    heroArt.innerHTML = `${heroSvg(context, profile)}<div class="u404-v42-hero-caption"><span>${escapeHtml(profile)}</span><strong>${escapeHtml(context.brand)}</strong></div>`;
    return true;
  };

  const injectVisualStyles = (doc) => {
    if ($('style[data-u404-v42-styles]', doc)) return;
    const style = doc.createElement('style');
    style.dataset.u404V42Styles = VISUAL_VERSION;
    style.textContent = `
      :root{--u404-v42-radius:clamp(18px,3vw,34px);--u404-v42-shadow:0 28px 80px rgba(0,0,0,.16)}
      .u404-v42-hero-visual{position:relative;isolation:isolate;overflow:hidden;min-height:clamp(300px,46vw,520px);padding:0!important;border-radius:var(--u404-v42-radius);box-shadow:var(--u404-v42-shadow)}
      .u404-v42-svg{display:block;width:100%;height:100%;min-height:inherit;color:var(--accent)}
      .u404-v42-hero-caption{position:absolute;left:24px;right:24px;bottom:22px;display:flex;justify-content:space-between;gap:14px;align-items:end;padding-top:16px;border-top:1px solid color-mix(in srgb,var(--text),transparent 76%);font-size:.75rem;letter-spacing:.12em;text-transform:uppercase}
      .u404-v42-hero-caption span{color:var(--muted)}.u404-v42-hero-caption strong{max-width:60%;text-align:right}
      .u404-premium-root .u404-section{content-visibility:auto;contain-intrinsic-size:1px 720px}
      .u404-gallery-tile,.u404-cards article,.card{transition:transform .24s ease,border-color .24s ease,background .24s ease}
      @media(hover:hover){.u404-gallery-tile:hover,.u404-cards article:hover,.card:hover{transform:translateY(-3px);border-color:color-mix(in srgb,var(--accent),transparent 48%)}}
      html[data-u404-visual-profile="editorial"] .hero h1,html[data-u404-visual-profile="editorial"] .u404-section h2{font-family:Georgia,'Times New Roman',serif;font-weight:600;letter-spacing:-.045em}
      html[data-u404-visual-profile="editorial"] .hero{grid-template-columns:minmax(0,1.35fr) minmax(260px,.65fr)}
      html[data-u404-visual-profile="editorial"] .u404-gallery{grid-template-columns:1.35fr .65fr .85fr}
      html[data-u404-visual-profile="immersive"] .hero{min-height:86vh;align-items:end}
      html[data-u404-visual-profile="immersive"] .hero h1{font-size:clamp(3.4rem,8.6vw,8rem)}
      html[data-u404-visual-profile="immersive"] .u404-gallery-tile:nth-child(1),html[data-u404-visual-profile="immersive"] .u404-gallery-tile:nth-child(5){grid-column:span 2;min-height:280px}
      html[data-u404-visual-profile="system"] .hero h1{font-size:clamp(2.7rem,6vw,5.4rem);max-width:760px}
      html[data-u404-visual-profile="system"] .u404-section h2{font-size:clamp(1.8rem,4vw,3.4rem)}
      html[data-u404-visual-profile="system"] .u404-stats strong{font-family:ui-monospace,SFMono-Regular,Consolas,monospace;letter-spacing:-.06em}
      html[data-u404-visual-profile="commerce"] .u404-gallery{grid-template-columns:repeat(3,minmax(0,1fr))}
      html[data-u404-visual-profile="commerce"] .u404-gallery-tile{aspect-ratio:4/5;min-height:0}
      html[data-u404-visual-profile="social"] .u404-section{border-top-style:dashed}
      html[data-u404-visual-profile="social"] .u404-stats article:nth-child(2){transform:translateY(-10px)}
      html[data-u404-visual-profile="conversion"] .u404-pricing-grid .is-featured{box-shadow:0 18px 60px color-mix(in srgb,var(--accent),transparent 82%)}
      @media(max-width:760px){.u404-v42-hero-visual{min-height:260px}.u404-v42-hero-caption{left:16px;right:16px;bottom:14px}.u404-v42-hero-caption strong{max-width:56%}html[data-u404-visual-profile="editorial"] .hero{grid-template-columns:1fr}html[data-u404-visual-profile="editorial"] .u404-gallery,html[data-u404-visual-profile="commerce"] .u404-gallery{grid-template-columns:1fr}html[data-u404-visual-profile="immersive"] .u404-gallery-tile:nth-child(1),html[data-u404-visual-profile="immersive"] .u404-gallery-tile:nth-child(5){grid-column:auto;min-height:210px}html[data-u404-visual-profile="social"] .u404-stats article:nth-child(2){transform:none}}
      @media(prefers-reduced-motion:reduce){.u404-gallery-tile,.u404-cards article,.card{transition:none!important;transform:none!important}}
    `;
    doc.head.appendChild(style);
  };

  const enrichStructuredData = (doc, context) => {
    const existing = $('script[type="application/ld+json"][data-u404-schema]', doc);
    let data = { '@context': 'https://schema.org', '@graph': [] };
    if (existing) {
      try { data = JSON.parse(existing.textContent || '{}'); } catch {}
      if (!Array.isArray(data['@graph'])) data['@graph'] = [];
    }
    const graph = data['@graph'];
    const types = new Set(graph.map((item) => item?.['@type']).filter(Boolean));
    const description = $('meta[name="description"]', doc)?.getAttribute('content') || context.offer;
    if (!types.has('WebPage')) {
      graph.push({
        '@type': 'WebPage',
        name: doc.title,
        description,
        inLanguage: 'es',
        ...(context.publicUrl ? { url: `${context.publicUrl}/` } : {})
      });
    }
    if (!types.has('FAQPage')) {
      const questions = $$('[data-u404-block="faq"] details', doc).map((details) => {
        const name = $('summary', details)?.textContent?.trim();
        const answer = $('p', details)?.textContent?.trim();
        return name && answer ? { '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text: answer } } : null;
      }).filter(Boolean);
      if (questions.length) graph.push({ '@type': 'FAQPage', mainEntity: questions });
    }
    const script = existing || doc.createElement('script');
    script.type = 'application/ld+json';
    script.dataset.u404Schema = VISUAL_VERSION;
    script.textContent = JSON.stringify(data);
    if (!existing) doc.head.appendChild(script);
  };

  const optimizeMedia = (doc) => {
    $$('img', doc).forEach((img, index) => {
      if (index > 0 && !img.hasAttribute('loading')) img.loading = 'lazy';
      if (!img.hasAttribute('decoding')) img.decoding = 'async';
      if (!img.hasAttribute('fetchpriority')) img.setAttribute('fetchpriority', index === 0 ? 'high' : 'low');
    });
  };

  const enhanceSeoMeta = (doc, context) => {
    const description = $('meta[name="description"]', doc)?.getAttribute('content') || context.offer;
    setMeta(doc, 'meta[name="application-name"]', { name: 'application-name', content: context.brand });
    setMeta(doc, 'meta[name="color-scheme"]', { name: 'color-scheme', content: 'dark light' });
    setMeta(doc, 'meta[property="og:site_name"]', { property: 'og:site_name', content: context.brand });
    setMeta(doc, 'meta[property="og:locale"]', { property: 'og:locale', content: 'es_ES' });
    setMeta(doc, 'meta[name="twitter:title"]', { name: 'twitter:title', content: doc.title });
    setMeta(doc, 'meta[name="twitter:description"]', { name: 'twitter:description', content: description });
    setMeta(doc, 'meta[name="generator"]', { name: 'generator', content: `404 Web Architect Studio ${VERSION}` });
  };

  const enhance42 = (html, context) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const profile = profileFor(context.architecture);
    doc.documentElement.dataset.u404Visual = VISUAL_VERSION;
    doc.documentElement.dataset.u404VisualProfile = profile;
    doc.body.classList.add('u404-v42');
    enhanceHero(doc, context, profile);
    injectVisualStyles(doc);
    optimizeMedia(doc);
    enrichStructuredData(doc, context);
    enhanceSeoMeta(doc, context);
    return { html: '<!doctype html>\n' + doc.documentElement.outerHTML, profile };
  };

  const externalResources = (doc) => {
    const urls = [];
    $$('script[src],link[rel="stylesheet"][href],img[src],source[src],video[src],audio[src]', doc).forEach((node) => {
      const value = node.getAttribute('src') || node.getAttribute('href') || '';
      if (/^(https?:)?\/\//i.test(value)) urls.push(value);
    });
    return urls;
  };

  const audit42 = (html, baseAudit) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const profile = doc.documentElement.dataset.u404VisualProfile || '';
    const allCss = $$('style', doc).map((node) => node.textContent || '').join('\n');
    const allJs = $$('script:not([src])', doc).map((node) => node.textContent || '').join('\n');
    const schemaText = $('script[type="application/ld+json"][data-u404-schema]', doc)?.textContent || '';
    let schemaTypes = [];
    try {
      const schema = JSON.parse(schemaText);
      schemaTypes = (schema['@graph'] || []).map((item) => item?.['@type']).filter(Boolean);
    } catch {}
    const resources = externalResources(doc);
    const images = $$('img', doc);
    const belowFoldImages = images.slice(1);
    const checks42 = [
      { id: 'v42-profile', label: 'Visual · perfil por arquitectura', ok: ['editorial', 'immersive', 'system', 'commerce', 'social', 'conversion'].includes(profile), detail: profile ? `Perfil ${profile}.` : 'Falta Visual DNA.' },
      { id: 'v42-hero', label: 'Visual · hero local', ok: Boolean($('.u404-v42-hero-visual svg', doc)), detail: $('.u404-v42-hero-visual svg', doc) ? 'Hero SVG local y escalable.' : 'No se detecta hero SVG.' },
      { id: 'v42-responsive-art', label: 'Visual · composición responsive', ok: /data-u404-visual-profile|u404-v42-hero/i.test(allCss) && /@media\s*\(max-width:760px\)/i.test(allCss), detail: 'Reglas visuales desktop/móvil incluidas.' },
      { id: 'v42-webpage-schema', label: 'SEO · WebPage Schema', ok: schemaTypes.includes('WebPage'), detail: schemaTypes.includes('WebPage') ? 'WebPage incluido.' : 'Falta WebPage.' },
      { id: 'v42-faq-schema', label: 'SEO · FAQPage Schema', ok: schemaTypes.includes('FAQPage'), detail: schemaTypes.includes('FAQPage') ? 'FAQPage enlazado al FAQ visible.' : 'Falta FAQPage.' },
      { id: 'v42-social-meta', label: 'SEO · social metadata', ok: Boolean($('meta[property="og:site_name"]', doc) && $('meta[name="twitter:title"]', doc) && $('meta[name="twitter:description"]', doc)), detail: 'Open Graph/Twitter enriquecidos.' },
      { id: 'v42-no-external', label: 'Performance · cero assets externos', ok: resources.length === 0, detail: resources.length ? `${resources.length} recursos externos detectados.` : 'Sin assets de terceros.' },
      { id: 'v42-html-budget', label: 'Performance · presupuesto HTML', ok: byteSize(html) <= 180000, detail: `${Math.round(byteSize(html) / 1024)} KB / 176 KB máx.` },
      { id: 'v42-css-budget', label: 'Performance · presupuesto CSS', ok: byteSize(allCss) <= 50000, detail: `${Math.round(byteSize(allCss) / 1024)} KB CSS inline / 49 KB máx.` },
      { id: 'v42-js-budget', label: 'Performance · presupuesto JS', ok: byteSize(allJs) <= 24000, detail: `${Math.round(byteSize(allJs) / 1024)} KB JS inline / 23 KB máx.` },
      { id: 'v42-render', label: 'Performance · render diferido', ok: /content-visibility\s*:\s*auto/i.test(allCss), detail: 'Secciones inferiores usan content-visibility.' },
      { id: 'v42-media', label: 'Performance · política de imágenes', ok: belowFoldImages.every((img) => img.getAttribute('loading') === 'lazy' && img.getAttribute('decoding') === 'async'), detail: images.length ? 'Imágenes inferiores lazy + async.' : 'Sin imágenes raster que optimizar.' }
    ];
    const baseChecks = Array.isArray(baseAudit?.checks) ? baseAudit.checks : [];
    const checks = [...baseChecks, ...checks42];
    const passed = checks.filter((item) => item.ok).length;
    return {
      checks,
      score: Math.round((passed / Math.max(checks.length, 1)) * 100),
      passed,
      total: checks.length,
      visualProfile: profile,
      budgets: {
        htmlBytes: byteSize(html),
        cssBytes: byteSize(allCss),
        jsBytes: byteSize(allJs),
        externalResources: resources.length
      }
    };
  };

  const renderAudit = (audit) => {
    const score = $('#productionScore');
    const list = $('#productionAuditList');
    if (score) {
      score.textContent = `${audit.score}/100`;
      score.dataset.grade = audit.score >= 92 ? 'pass' : audit.score >= 80 ? 'warn' : 'fail';
    }
    if (list) {
      list.innerHTML = audit.checks.map((item) => `
        <article class="production-check ${item.ok ? 'is-ok' : 'is-warning'}">
          <span class="production-check-dot" aria-hidden="true"></span>
          <div><strong>${escapeHtml(item.label)}</strong><small>${escapeHtml(item.detail)}</small></div>
          <span class="badge">${item.ok ? 'OK' : 'Revisar'}</span>
        </article>`).join('');
    }
  };

  async function buildOutput42() {
    const output = await base.preview();
    const context = contextFromStudio(output);
    const enhanced = enhance42(output.html, context);
    const audit = audit42(enhanced.html, output.audit);
    return { ...output, html: enhanced.html, audit, baseAudit: output.audit, visualProfile: enhanced.profile, context };
  }

  async function runAudit42() {
    const button = $('#productionAudit');
    if (button) button.disabled = true;
    try {
      const output = await buildOutput42();
      renderAudit(output.audit);
      window.__WEB_ARCHITECT_V42_LAST_AUDIT__ = output.audit;
      toast(`Visual + Performance Gate: ${output.audit.score}/100.`);
      return output;
    } catch (error) {
      console.error('[Web Architect 4.2]', error);
      toast(`No se pudo auditar 4.2: ${error.message}`);
      throw error;
    } finally {
      if (button) button.disabled = false;
    }
  }

  async function captureProjectJson() {
    const button = $('#downloadJson');
    if (!button) return null;
    let capturedBlob = null;
    const originalCreateObjectURL = URL.createObjectURL;
    const originalAnchorClick = HTMLAnchorElement.prototype.click;
    try {
      URL.createObjectURL = function capture(blob) {
        if (blob instanceof Blob && String(blob.type).includes('json')) capturedBlob = blob;
        return originalCreateObjectURL.call(URL, blob);
      };
      HTMLAnchorElement.prototype.click = function suppressProjectDownload() {
        if (String(this.download || '').toLowerCase().endsWith('.json')) return undefined;
        return originalAnchorClick.call(this);
      };
      button.click();
      await waitFrame();
      if (!capturedBlob) return null;
      return JSON.parse(await capturedBlob.text());
    } catch {
      return null;
    } finally {
      URL.createObjectURL = originalCreateObjectURL;
      HTMLAnchorElement.prototype.click = originalAnchorClick;
    }
  }

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
      const data = encoder.encode(content);
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

  const buildManifest = (brand) => JSON.stringify({
    name: brand,
    short_name: brand.slice(0, 24),
    description: `Sitio generado con 404 Web Architect Studio ${VERSION}`,
    id: './', start_url: './', scope: './', display: 'standalone',
    background_color: '#0b0d12', theme_color: '#0b0d12',
    icons: [{ src: './icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }]
  }, null, 2);

  const buildIcon = (brand) => {
    const initials = String(brand || '404').trim().slice(0, 3).toUpperCase();
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="${escapeXml(brand)}"><rect width="512" height="512" rx="116" fill="#0b0d12"/><rect x="30" y="30" width="452" height="452" rx="94" fill="none" stroke="#e8cb78" stroke-width="12"/><text x="256" y="292" text-anchor="middle" font-family="system-ui,sans-serif" font-size="138" font-weight="900" fill="#e8cb78">${escapeXml(initials)}</text></svg>`;
  };

  const buildServiceWorker = () => `const CACHE='web-architect-export-v4.2';\nconst CORE=['./','./index.html','./manifest.webmanifest','./icon.svg'];\nself.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));});\nself.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});\nself.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;const url=new URL(event.request.url);if(url.origin!==location.origin)return;if(event.request.mode==='navigate'){event.respondWith(fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put('./index.html',copy));return response;}).catch(()=>caches.match('./index.html')));return;}event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}return response;})));});\n`;

  const buildReadme = (output) => `# ${output.context.brand}\n\nSitio estático generado con **404 Web Architect Studio ${VERSION} — Visual Quality & Performance**.\n\n## Publicación\n\n1. Sube todo el contenido del ZIP a la raíz del repositorio.\n2. Activa GitHub Pages desde la rama principal.\n3. Si has indicado URL pública, revisa sitemap.xml y robots.txt.\n\n## Visual DNA\n\n- Arquitectura: ${output.context.architecture}\n- Perfil visual: ${output.visualProfile}\n- Production Gate: ${output.audit.score}/100\n\n## Privacidad\n\nLa web no incluye telemetría, cuentas ni dependencias externas de ejecución. El formulario local-first no envía datos a servidores.\n`;

  const buildQaReport = (output) => `# QA Report — Web Architect ${VERSION}\n\n- Score: **${output.audit.score}/100**\n- Arquitectura: **${output.context.architecture}**\n- Visual DNA: **${output.visualProfile}**\n- PWA: **${output.pwa ? 'sí' : 'no'}**\n\n## Checks\n\n${output.audit.checks.map((check) => `- [${check.ok ? 'x' : ' '}] ${check.label} — ${check.detail}`).join('\n')}\n`;

  const buildPerformanceReport = (output) => {
    const b = output.audit.budgets || {};
    return `# Performance Report — Web Architect ${VERSION}\n\n## Presupuestos\n\n- HTML: **${Math.round((b.htmlBytes || 0) / 1024)} KB** / 176 KB\n- CSS inline: **${Math.round((b.cssBytes || 0) / 1024)} KB** / 49 KB\n- JS inline: **${Math.round((b.jsBytes || 0) / 1024)} KB** / 23 KB\n- Recursos externos: **${b.externalResources || 0}**\n\n## Estrategia\n\n- Hero gráfico generado localmente en SVG.\n- Sin fuentes, scripts ni hojas de estilo de terceros.\n- Secciones inferiores con content-visibility.\n- Imágenes no prioritarias con lazy loading y decoding async cuando existen.\n- Reduced motion respetado.\n`;
  };

  async function downloadZip42() {
    const button = $('#productionDownload');
    if (button) button.disabled = true;
    try {
      const output = await runAudit42();
      const project = await captureProjectJson() || {};
      project.production = {
        ...(project.production || {}),
        studioVersion: VERSION,
        visualQuality: VISUAL_VERSION,
        premiumOutput: base.premiumVersion || '4.1',
        visualProfile: output.visualProfile,
        publicUrl: output.publicUrl || '',
        pwa: output.pwa
      };
      const visualDna = {
        schema: 'u404-visual-dna',
        version: VISUAL_VERSION,
        architecture: output.context.architecture,
        profile: output.visualProfile,
        tone: output.context.tone,
        intensity: output.context.intensity,
        principles: ['local-first', 'architecture-aware', 'responsive', 'reduced-motion', 'no-external-runtime-assets'],
        budgets: output.audit.budgets
      };
      const files = {
        'index.html': output.html,
        '404.html': output.html,
        'README.md': buildReadme(output),
        'project.json': JSON.stringify(project, null, 2),
        'VISUAL_DNA.json': JSON.stringify(visualDna, null, 2),
        'QA_REPORT.md': buildQaReport(output),
        'PERFORMANCE_REPORT.md': buildPerformanceReport(output),
        'robots.txt': output.publicUrl ? `User-agent: *\nAllow: /\nSitemap: ${output.publicUrl}/sitemap.xml\n` : 'User-agent: *\nAllow: /\n',
        '.nojekyll': ''
      };
      if (output.publicUrl) files['sitemap.xml'] = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escapeXml(output.publicUrl)}/</loc><changefreq>monthly</changefreq><priority>1.0</priority></url></urlset>\n`;
      if (output.pwa) {
        files['manifest.webmanifest'] = buildManifest(output.context.brand);
        files['sw.js'] = buildServiceWorker();
        files['icon.svg'] = buildIcon(output.context.brand);
      }
      downloadBlob(`${slugify(output.context.brand)}-production-v4.2.zip`, createZipBlob(files));
      toast(`ZIP 4.2 exportado · Visual/Performance ${output.audit.score}/100.`);
    } catch (error) {
      console.error('[Web Architect 4.2]', error);
      toast(`No se pudo exportar 4.2: ${error.message}`);
    } finally {
      if (button) button.disabled = false;
    }
  }

  const rewireProductionCenter = () => {
    const center = $('#productionCenter');
    if (!center) return;
    const eyebrow = $('.production-head .eyebrow', center);
    const title = $('#production-title', center);
    const intro = $('.production-head p:not(.eyebrow)', center);
    if (eyebrow) eyebrow.textContent = `Visual Quality & Performance · v${VERSION}`;
    if (title) title.textContent = 'Preflight visual, SEO y rendimiento';
    if (intro) intro.textContent = 'Aplica Visual DNA por arquitectura, hero SVG local, Schema.org enriquecido y presupuestos de rendimiento antes de empaquetar la web final.';

    const oldAudit = $('#productionAudit');
    if (oldAudit) {
      const freshAudit = oldAudit.cloneNode(true);
      freshAudit.textContent = 'Ejecutar Gate 4.2';
      oldAudit.replaceWith(freshAudit);
      freshAudit.addEventListener('click', () => runAudit42().catch(() => {}));
    }
    const oldDownload = $('#productionDownload');
    if (oldDownload) {
      const freshDownload = oldDownload.cloneNode(true);
      freshDownload.textContent = 'Descargar ZIP 4.2';
      oldDownload.replaceWith(freshDownload);
      freshDownload.addEventListener('click', downloadZip42);
    }
  };

  const updateBranding = () => {
    document.title = '404 Web Architect Studio 4.2 · Visual Quality & Performance';
    const description = $('meta[name="description"]');
    if (description) description.setAttribute('content', '404 Web Architect Studio 4.2: Premium Output con Visual DNA, SEO estructurado, Performance Gate, PWA y exportación GitHub Pages.');
    const label = $('.brand-block small');
    if (label) label.textContent = 'Studio 4.2 · Visual Quality & Performance · offline';
    const lead = $('.hero-copy .lead');
    if (lead) lead.textContent = 'Combina 1000 direcciones creativas con 12 arquitecturas y exporta webs con Visual DNA, hero SVG local, SEO estructurado, Performance Gate y cero dependencias externas de ejecución.';
  };

  const init = () => {
    if (!window.WebArchitectProduction || window.WebArchitectProduction.version !== base.version) return;
    updateBranding();
    rewireProductionCenter();
    document.documentElement.dataset.studioVersion = VERSION;
    window.WebArchitectProduction = Object.freeze({
      version: VERSION,
      premiumVersion: base.premiumVersion || '4.1',
      visualVersion: VISUAL_VERSION,
      baseVersion: base.version,
      audit: runAudit42,
      exportZip: downloadZip42,
      preview: buildOutput42
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
