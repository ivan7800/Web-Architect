(() => {
  'use strict';

  const VERSION = '4.1.0';
  const PREMIUM_VERSION = '4.1';
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

  const escapeHtml = (value) => String(value ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');

  const escapeXml = (value) => String(value ?? '')
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
      link.href = '#contacto-local';
      link.textContent = button.textContent?.trim() || 'Consultar';
      button.replaceWith(link);
    });

    // Studio 3.x reutilizaba id="contenido" en la introducción y en la rejilla
    // de Editorial/Magazine. Conservamos el id en la zona de contenido real.
    const contentNodes = $$('#contenido', doc);
    if (contentNodes.length > 1) {
      const preferred = contentNodes.find((node) => node.matches('.grid,.portfolio-grid,.scene-grid,.docs-content')) || contentNodes.at(-1);
      contentNodes.forEach((node) => {
        if (node !== preferred) node.removeAttribute('id');
      });
    }
    return doc;
  };

  const getProductionContext = (publicUrl = '', pwa = true) => ({
    publicUrl,
    pwa,
    brand: $('#brandName')?.value.trim() || 'Proyecto Web',
    offer: $('#offer')?.value.trim() || 'Una propuesta digital clara y útil',
    audience: $('#audience')?.value.trim() || 'personas que buscan una experiencia clara',
    mainCta: $('#mainCta')?.value.trim() || 'Contactar',
    tone: $('#tone')?.value || '',
    intensity: Number($('#intensity')?.value || 0),
    architecture: $('#architectureSelect')?.value || 'conversion',
    sections: $$('#sectionEditor [data-section-id]')
      .filter((row) => $('.section-enabled', row)?.checked !== false)
      .map((row) => $('.section-title-input', row)?.value?.trim())
      .filter(Boolean)
      .slice(0, 8)
  });

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

  const ensureMobileNavigation = (doc) => {
    const header = $('.nav', doc);
    const navigation = $('.nav nav', doc);
    if (!header || !navigation || $('.u404-nav-toggle', header)) return;

    navigation.id = navigation.id || 'u404-site-nav';
    navigation.classList.add('u404-nav-links');
    const button = doc.createElement('button');
    button.type = 'button';
    button.className = 'u404-nav-toggle';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', navigation.id);
    button.textContent = 'Menú';
    header.insertBefore(button, navigation);
  };

  const blockVariantFor = (architecture) => {
    if (['editorial', 'portfolio', 'cinematic', 'magazine', 'hospitality', 'catalog'].includes(architecture)) return 'gallery';
    if (['dashboard', 'docs', 'event', 'community'].includes(architecture)) return 'stats';
    return 'pricing';
  };

  const buildTrustBlock = (context) => `
    <section class="u404-section u404-trust" data-u404-block="trust" aria-labelledby="u404-trust-title">
      <p class="u404-kicker">Una propuesta con foco</p>
      <h2 id="u404-trust-title">Pensado para ${escapeHtml(context.audience)}</h2>
      <div class="u404-cards u404-cards-3">
        <article><strong>Qué ofrece</strong><p>${escapeHtml(context.offer)}</p></article>
        <article><strong>Para quién</strong><p>${escapeHtml(context.audience)}</p></article>
        <article><strong>Siguiente paso</strong><p>La acción principal es clara: <b>${escapeHtml(context.mainCta)}</b>.</p></article>
      </div>
    </section>`;

  const buildPricingBlock = (context) => `
    <section class="u404-section" data-u404-block="pricing" aria-labelledby="u404-pricing-title">
      <p class="u404-kicker">Opciones</p>
      <h2 id="u404-pricing-title">Tres maneras de empezar con ${escapeHtml(context.brand)}</h2>
      <div class="u404-cards u404-cards-3 u404-pricing-grid">
        <article><span class="u404-plan">Inicio</span><strong>Explorar</strong><p>Conoce la propuesta y valida si encaja con lo que necesitas.</p><a class="u404-action" href="#contenido">Ver contenido</a></article>
        <article class="is-featured"><span class="u404-plan">Recomendado</span><strong>Avanzar</strong><p>Da el siguiente paso sobre ${escapeHtml(context.offer)}.</p><a class="u404-action" href="#contacto-local">${escapeHtml(context.mainCta)}</a></article>
        <article><span class="u404-plan">A medida</span><strong>Hablar</strong><p>Prepara una solicitud con tu contexto y guárdala localmente.</p><a class="u404-action" href="#contacto-local">Preparar solicitud</a></article>
      </div>
    </section>`;

  const buildGalleryBlock = (context) => {
    const labels = context.sections.length ? context.sections : ['Identidad', 'Experiencia', 'Contenido', 'Detalle', 'Producto', 'Resultado'];
    const tiles = Array.from({ length: 6 }, (_, index) => {
      const label = labels[index % labels.length];
      return `<article class="u404-gallery-tile"><span>${String(index + 1).padStart(2, '0')}</span><strong>${escapeHtml(label)}</strong><small>${escapeHtml(context.brand)}</small></article>`;
    }).join('');
    return `
      <section class="u404-section" data-u404-block="gallery" aria-labelledby="u404-gallery-title">
        <p class="u404-kicker">Galería estructural</p>
        <h2 id="u404-gallery-title">Una lectura visual de la propuesta</h2>
        <div class="u404-gallery" aria-label="Galería de secciones y direcciones visuales">${tiles}</div>
      </section>`;
  };

  const buildStatsBlock = (context) => {
    const sectionCount = Math.max(context.sections.length, 1);
    return `
      <section class="u404-section" data-u404-block="stats" aria-labelledby="u404-stats-title">
        <p class="u404-kicker">Resumen</p>
        <h2 id="u404-stats-title">La propuesta, de un vistazo</h2>
        <div class="u404-stats">
          <article><strong>${sectionCount}</strong><span>bloques de contenido activos</span></article>
          <article><strong>1</strong><span>acción principal: ${escapeHtml(context.mainCta)}</span></article>
          <article><strong>0</strong><span>dependencias externas necesarias</span></article>
        </div>
      </section>`;
  };

  const buildFaqBlock = (context) => `
    <section class="u404-section" data-u404-block="faq" aria-labelledby="u404-faq-title">
      <p class="u404-kicker">Preguntas frecuentes</p>
      <h2 id="u404-faq-title">Lo esencial antes de continuar</h2>
      <div class="u404-faq-list">
        <details><summary>¿Qué ofrece ${escapeHtml(context.brand)}?</summary><p>${escapeHtml(context.offer)}</p></details>
        <details><summary>¿Para quién está pensado?</summary><p>La propuesta está orientada a ${escapeHtml(context.audience)}.</p></details>
        <details><summary>¿Cuál es el siguiente paso?</summary><p>Usa la acción “${escapeHtml(context.mainCta)}” o prepara una solicitud desde el formulario local.</p></details>
        <details><summary>¿El formulario envía mis datos a un servidor?</summary><p>No. Esta versión estática prepara y guarda el borrador únicamente en tu dispositivo; no realiza envíos de red.</p></details>
      </div>
    </section>`;

  const buildLocalFormBlock = (context) => `
    <section class="u404-section u404-contact" id="contacto-local" data-u404-block="local-form" aria-labelledby="u404-contact-title">
      <div>
        <p class="u404-kicker">Contacto local-first</p>
        <h2 id="u404-contact-title">Prepara tu solicitud</h2>
        <p>Completa el formulario para generar un borrador que se guarda en este dispositivo y se copia al portapapeles cuando sea posible.</p>
      </div>
      <form data-u404-local-form novalidate>
        <label>Nombre<input name="name" type="text" autocomplete="name" required maxlength="80"></label>
        <label>Email<input name="email" type="email" autocomplete="email" required maxlength="160"></label>
        <label class="u404-form-wide">Mensaje<textarea name="message" rows="5" required maxlength="1200" placeholder="Cuéntanos qué necesitas sobre ${escapeHtml(context.offer)}"></textarea></label>
        <button class="u404-action u404-form-wide" type="submit">Preparar y copiar solicitud</button>
        <p class="u404-form-note u404-form-wide">Privacidad: el contenido no se envía a ningún servidor.</p>
        <p class="u404-form-status u404-form-wide" role="status" aria-live="polite"></p>
      </form>
    </section>`;

  const injectPremiumBlocks = (doc, context) => {
    if ($('[data-u404-premium-root]', doc)) return;
    const main = $('main', doc);
    if (!main) return;

    const root = doc.createElement('div');
    root.className = 'u404-premium-root wrap';
    root.dataset.u404PremiumRoot = PREMIUM_VERSION;

    const variant = blockVariantFor(context.architecture);
    const variantBlock = variant === 'gallery'
      ? buildGalleryBlock(context)
      : variant === 'stats'
        ? buildStatsBlock(context)
        : buildPricingBlock(context);

    root.innerHTML = `${buildTrustBlock(context)}${variantBlock}${buildFaqBlock(context)}${buildLocalFormBlock(context)}`;
    main.insertAdjacentElement('afterend', root);
  };

  const injectStructuredData = (doc, context) => {
    if ($('script[data-u404-schema]', doc)) return;
    const graph = [
      {
        '@type': 'WebSite',
        name: context.brand,
        description: context.offer,
        inLanguage: 'es'
      },
      {
        '@type': 'Organization',
        name: context.brand,
        description: context.offer
      }
    ];
    if (context.publicUrl) {
      graph[0].url = `${context.publicUrl}/`;
      graph[1].url = `${context.publicUrl}/`;
    }
    const script = doc.createElement('script');
    script.type = 'application/ld+json';
    script.dataset.u404Schema = PREMIUM_VERSION;
    script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
    doc.head.appendChild(script);
  };

  const injectPremiumStyles = (doc) => {
    if ($('style[data-u404-premium-styles]', doc)) return;
    const style = doc.createElement('style');
    style.dataset.u404PremiumStyles = PREMIUM_VERSION;
    style.textContent = `
      .u404-nav-toggle{display:none;min-height:44px;padding:.65rem 1rem;border:1px solid var(--line);border-radius:999px;background:transparent;color:var(--text);font:inherit;font-weight:800;cursor:pointer}
      .u404-premium-root{padding-block:18px 78px}.u404-section{padding:clamp(42px,7vw,86px) 0;border-top:1px solid var(--line)}
      .u404-section h2{max-width:820px;margin:.45rem 0 1.25rem;font-size:clamp(2rem,5vw,4.4rem);line-height:.98;letter-spacing:-.05em}
      .u404-section p{line-height:1.7}.u404-kicker{margin:0;color:var(--accent);font-size:.76rem;font-weight:900;letter-spacing:.16em;text-transform:uppercase}
      .u404-cards{display:grid;gap:14px}.u404-cards-3{grid-template-columns:repeat(3,minmax(0,1fr))}.u404-cards article,.u404-stats article,.u404-faq-list details{border:1px solid var(--line);background:color-mix(in srgb,var(--text),transparent 96%);border-radius:20px;padding:22px}
      .u404-cards article strong{display:block;font-size:1.15rem;margin:.35rem 0}.u404-cards article p{margin:.3rem 0;color:var(--muted)}
      .u404-pricing-grid .is-featured{outline:2px solid color-mix(in srgb,var(--accent),transparent 35%);transform:translateY(-6px)}.u404-plan{display:inline-flex;color:var(--accent);font-size:.76rem;font-weight:900;text-transform:uppercase;letter-spacing:.12em}
      .u404-action{display:inline-flex;align-items:center;justify-content:center;min-height:48px;margin-top:14px;padding:.7rem 1rem;border:0;border-radius:999px;background:var(--accent);color:var(--bg);font:inherit;font-weight:900;text-decoration:none;cursor:pointer}
      .u404-gallery{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.u404-gallery-tile{min-height:190px;display:flex;flex-direction:column;justify-content:flex-end;padding:20px;border:1px solid var(--line);border-radius:22px;background:linear-gradient(145deg,color-mix(in srgb,var(--accent),transparent 76%),color-mix(in srgb,var(--panel),transparent 8%));overflow:hidden}.u404-gallery-tile span{color:var(--accent);font-weight:900}.u404-gallery-tile strong{font-size:1.2rem;margin-top:auto}.u404-gallery-tile small{color:var(--muted);margin-top:.35rem}
      .u404-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.u404-stats article{display:grid;gap:8px}.u404-stats strong{font-size:clamp(2.5rem,6vw,5rem);line-height:1;color:var(--accent)}.u404-stats span{color:var(--muted)}
      .u404-faq-list{display:grid;gap:10px}.u404-faq-list summary{cursor:pointer;font-weight:900}.u404-faq-list details p{margin:.85rem 0 0;color:var(--muted)}
      .u404-contact{display:grid;grid-template-columns:.8fr 1.2fr;gap:clamp(22px,6vw,70px);align-items:start}.u404-contact form{display:grid;grid-template-columns:1fr 1fr;gap:14px}.u404-contact label{display:grid;gap:7px;color:var(--muted);font-weight:750}.u404-contact input,.u404-contact textarea{width:100%;border:1px solid var(--line);border-radius:14px;background:var(--panel);color:var(--text);padding:.85rem 1rem;font:inherit}.u404-form-wide{grid-column:1/-1}.u404-form-note,.u404-form-status{margin:0;color:var(--muted);font-size:.88rem}.u404-form-status[data-state="ok"]{color:var(--accent)}.u404-form-status[data-state="error"]{color:#ff8d8d}
      @media(max-width:760px){.u404-nav-toggle{display:inline-flex;margin-left:auto}.nav{flex-wrap:wrap}.nav .u404-nav-links{display:none;width:100%;flex-direction:column;align-items:flex-start;padding-top:10px}.nav[data-menu-open="true"] .u404-nav-links{display:flex}.u404-cards-3,.u404-gallery,.u404-stats,.u404-contact{grid-template-columns:1fr}.u404-pricing-grid .is-featured{transform:none}.u404-contact form{grid-template-columns:1fr}.u404-form-wide{grid-column:auto}.u404-premium-root{padding-bottom:50px}}
      @media(prefers-reduced-motion:reduce){.u404-pricing-grid .is-featured{transform:none}.u404-nav-links{scroll-behavior:auto}}
    `;
    doc.head.appendChild(style);
  };

  const injectPremiumRuntime = (doc) => {
    if ($('script[data-u404-runtime]', doc)) return;
    const script = doc.createElement('script');
    script.dataset.u404Runtime = PREMIUM_VERSION;
    script.textContent = `(()=>{'use strict';const q=(s,r=document)=>r.querySelector(s);const nav=q('.nav');const toggle=q('.u404-nav-toggle');if(nav&&toggle){toggle.addEventListener('click',()=>{const open=nav.dataset.menuOpen==='true';nav.dataset.menuOpen=String(!open);toggle.setAttribute('aria-expanded',String(!open));});q('.u404-nav-links')?.addEventListener('click',e=>{if(e.target.closest('a')){nav.dataset.menuOpen='false';toggle.setAttribute('aria-expanded','false');}});}const form=q('[data-u404-local-form]');if(form){const status=q('.u404-form-status',form);const pageTitle=${JSON.stringify(doc.title)};form.addEventListener('submit',async e=>{e.preventDefault();if(!form.reportValidity())return;const data=new FormData(form);const draft=[pageTitle,'Nombre: '+String(data.get('name')||''),'Email: '+String(data.get('email')||''),'Mensaje: '+String(data.get('message')||'')].join('\\n');try{localStorage.setItem('u404-contact-draft',draft);}catch{}let copied=false;try{await navigator.clipboard.writeText(draft);copied=true;}catch{}if(status){status.dataset.state='ok';status.textContent=copied?'Solicitud guardada localmente y copiada al portapapeles.':'Solicitud guardada localmente en este dispositivo.';}});}})();`;
    doc.body.appendChild(script);
  };

  const injectPremiumOutput = (doc, context) => {
    ensureMobileNavigation(doc);
    injectPremiumBlocks(doc, context);
    injectStructuredData(doc, context);
    injectPremiumStyles(doc);
    injectPremiumRuntime(doc);
    doc.documentElement.dataset.u404Premium = PREMIUM_VERSION;
  };

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
    const inertButtons = $$('button[type="button"]', doc).filter((button) => !button.matches('.u404-nav-toggle'));
    const premiumBlocks = $$('[data-u404-block]', doc);
    const localForm = $('[data-u404-local-form]', doc);
    const schema = $('script[type="application/ld+json"][data-u404-schema]', doc);
    const mobileNav = $('.u404-nav-toggle[aria-controls]', doc) && $('.u404-nav-links', doc);
    const faqCount = $$('[data-u404-block="faq"] details', doc).length;

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
      { id: 'security', label: 'Seguridad · salida local', ok: externalScripts.length === 0 && !inlineHandlers, detail: externalScripts.length || inlineHandlers ? 'Revisar scripts externos o handlers inline.' : 'Sin scripts externos ni handlers inline.' },
      { id: 'schema', label: 'SEO · Schema.org', ok: Boolean(schema), detail: schema ? 'JSON-LD local incluido.' : 'Falta JSON-LD.' },
      { id: 'mobile-nav', label: 'UX · navegación móvil', ok: Boolean(mobileNav), detail: mobileNav ? 'Menú móvil accesible incluido.' : 'Falta navegación móvil.' },
      { id: 'faq', label: 'Contenido · FAQ funcional', ok: faqCount >= 3, detail: `${faqCount} preguntas con details/summary.` },
      { id: 'local-form', label: 'Privacidad · formulario local', ok: Boolean(localForm), detail: localForm ? 'Formulario local-first incluido.' : 'Falta formulario local.' },
      { id: 'premium-blocks', label: 'Contenido · bloques premium', ok: premiumBlocks.length >= 4, detail: `${premiumBlocks.length} bloques premium detectados.` },
      { id: 'actions', label: 'UX · controles accionables', ok: inertButtons.length === 0, detail: inertButtons.length ? `${inertButtons.length} botones sin acción conocida.` : 'Sin botones inertes detectados.' }
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

  const buildServiceWorker = () => `const CACHE='web-architect-export-v4.1';\nconst CORE=['./','./index.html','./manifest.webmanifest','./icon.svg'];\nself.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));});\nself.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});\nself.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;const url=new URL(event.request.url);if(url.origin!==location.origin)return;if(event.request.mode==='navigate'){event.respondWith(fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put('./index.html',copy));return response;}).catch(()=>caches.match('./index.html')));return;}event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response;})));});\n`;

  const enhanceHtml = (html, { publicUrl, pwa }) => {
    const doc = repairInertControls(new DOMParser().parseFromString(html, 'text/html'));
    const context = getProductionContext(publicUrl, pwa);
    const title = doc.querySelector('title')?.textContent.trim() || context.brand;
    const description = doc.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() || context.offer || title;

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

    injectPremiumOutput(doc, context);

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
    production: { publicUrl, pwa, premiumOutput: PREMIUM_VERSION },
    updatedAt: new Date().toISOString()
  });

  const buildQaReport = (audit, publicUrl, pwa) => {
    const lines = audit.checks.map((item) => `- [${item.ok ? 'x' : ' '}] **${item.label}** — ${item.detail}`);
    return `# Production QA Report\n\n- **Studio:** 404 Web Architect Studio ${VERSION}\n- **Premium Output:** ${PREMIUM_VERSION}\n- **Score:** ${audit.score}/100\n- **Resultado:** ${audit.passed}/${audit.total} comprobaciones superadas\n- **URL pública:** ${publicUrl || 'No definida'}\n- **PWA:** ${pwa ? 'Activada' : 'Desactivada'}\n- **Fecha:** ${new Date().toISOString()}\n\n## Comprobaciones\n\n${lines.join('\n')}\n\n## Gate\n\n${audit.score >= 90 ? 'APTO para revisión final y publicación.' : 'REVISAR antes de publicar: corrige los puntos pendientes y vuelve a ejecutar el Production Gate.'}\n`;
  };

  const buildReadme = (brand, publicUrl, pwa, score) => `# ${brand}\n\nExportación **Premium Output ${PREMIUM_VERSION}** de 404 Web Architect Studio ${VERSION}.\n\n## Incluye\n\n- Navegación móvil accesible\n- Bloques premium adaptados a la arquitectura\n- FAQ nativa con details/summary\n- Formulario local-first sin backend ni telemetría\n- Schema.org JSON-LD\n- Quality Gate sobre la salida final\n\n## Archivos\n\n- \`index.html\` — web final\n- \`404.html\` — fallback compatible con GitHub Pages\n- \`project.json\` — proyecto reimportable en Web Architect Studio\n- \`QA_REPORT.md\` — auditoría previa a publicación\n${pwa ? '- `manifest.webmanifest`, `sw.js` e `icon.svg` — PWA/offline\n' : ''}- \`.nojekyll\` — compatibilidad GitHub Pages\n${publicUrl ? '- `robots.txt` y `sitemap.xml` — indexación\n' : '- `robots.txt` — reglas básicas de indexación\n'}\n## Quality Gate\n\nPuntuación de exportación: **${score}/100**.\n\n## Publicación en GitHub Pages\n\n1. Sube todos los archivos a la raíz del repositorio.\n2. Ve a **Settings → Pages**.\n3. Selecciona **Deploy from a branch**, rama \`main\` y carpeta \`/root\`.\n4. Publica y comprueba la URL final en móvil y escritorio.\n${publicUrl ? `\nURL configurada: ${publicUrl}/\n` : '\nAntes de SEO definitivo, define la URL pública en Production Center y vuelve a exportar.\n'}\n`;

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

  async function buildProductionOutput() {
    const rawHtml = await captureGeneratedHtml();
    const publicUrl = normalizePublicUrl($('#productionPublicUrl')?.value);
    const pwa = $('#productionPwa')?.checked !== false;
    const html = enhanceHtml(rawHtml, { publicUrl, pwa });
    const audit = auditHtml(html);
    return { rawHtml, html, audit, publicUrl, pwa, architecture: $('#architectureSelect')?.value || 'conversion' };
  }

  async function runProductionAudit() {
    const button = $('#productionAudit');
    if (button) button.disabled = true;
    try {
      const output = await buildProductionOutput();
      renderAudit(output.audit);
      window.__WEB_ARCHITECT_V4_LAST_AUDIT__ = output.audit;
      toast(`Production Gate: ${output.audit.score}/100.`);
      return output;
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
      const { html, audit, publicUrl, pwa } = await runProductionAudit();
      const brand = $('#brandName')?.value.trim() || 'Proyecto Web';
      const project = getProjectSnapshot(publicUrl, pwa);
      const files = {
        'index.html': html,
        '404.html': html,
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
      downloadBlob(`${slugify(brand)}-production-v4.1.zip`, createZipBlob(files));
      toast(`ZIP Production 4.1 exportado · QA ${audit.score}/100.`);
    } catch (error) {
      console.error('[Web Architect 4.1]', error);
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
          <p class="eyebrow">Premium Output Engine · v${VERSION}</p>
          <h3 id="production-title">Preflight de la web final</h3>
          <p>Enriquece la salida con navegación móvil, bloques funcionales, Schema.org y formulario local-first antes de empaquetarla para GitHub Pages.</p>
        </div>
        <strong id="productionScore" class="production-score" data-grade="idle">—/100</strong>
      </div>
      <div class="production-controls">
        <label>URL pública <span>(opcional)</span><input id="productionPublicUrl" type="url" inputmode="url" placeholder="https://usuario.github.io/proyecto"></label>
        <label class="production-toggle"><input id="productionPwa" type="checkbox" checked><span>Incluir PWA/offline</span></label>
        <button class="ghost" id="productionAudit" type="button">Ejecutar Production Gate</button>
        <button class="primary" id="productionDownload" type="button">Descargar ZIP Premium</button>
      </div>
      <div class="production-audit-list" id="productionAuditList" aria-live="polite">
        <p class="production-empty">Ejecuta el Production Gate para revisar la salida final enriquecida.</p>
      </div>`;
    auditPanel.insertBefore(section, footer || null);
    $('#productionAudit')?.addEventListener('click', () => runProductionAudit().catch(() => {}));
    $('#productionDownload')?.addEventListener('click', downloadProductionZip);
  };

  const updateStudioBranding = () => {
    document.title = '404 Web Architect Studio 4.1 · Premium Output Engine';
    const description = $('meta[name="description"]');
    if (description) description.setAttribute('content', '404 Web Architect Studio 4.1: constructor offline con Premium Output Engine, Production Gate, PWA y exportación GitHub Pages.');
    const label = $('.brand-block small');
    if (label) label.textContent = 'Studio 4.1 · Premium Output Engine · offline';
    const heroLead = $('.hero-copy .lead');
    if (heroLead) {
      heroLead.textContent = 'Combina 1000 direcciones creativas con 12 arquitecturas reales y exporta una web enriquecida con navegación móvil, bloques funcionales, Schema.org y QA automático.';
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
    window.WebArchitectProduction = Object.freeze({
      version: VERSION,
      premiumVersion: PREMIUM_VERSION,
      audit: runProductionAudit,
      exportZip: downloadProductionZip,
      preview: buildProductionOutput
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
