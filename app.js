(() => {
  'use strict';

  const models = Array.isArray(window.MODELS_404) ? window.MODELS_404 : [];
  const DEFAULT_PALETTE = ['#070A12', '#121A2A', '#7CFFCB', '#E8F1FF'];
  const INITIAL_VISIBLE = 16;
  const LOAD_STEP = 20;
  const SANS  = "'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif";
  const SERIF = "Georgia, 'Iowan Old Style', 'Times New Roman', serif";
  const MONO  = "'SFMono-Regular', ui-monospace, 'SF Mono', 'Courier New', monospace";
  const DEFAULT_SKIN = 'obsidian';
  const STORAGE_KEYS = [
    '404-web-architect-brief',
    '404-web-architect-selected',
    '404-web-architect-skin',
    '404-web-architect-step'
  ];

  const QUICK_PRESETS = {
    autor: {
      brandName: 'I. Roig / Universo 404',
      offer: 'Web de autor premium para novelas oscuras, universo narrativo, apps 404 y enlaces a Amazon',
      audience: 'Lectores de thriller psicológico, horror cósmico, misterio oscuro y ficción de culto',
      mainCta: 'Entrar al universo',
      tone: 'Cinematográfico',
      intensity: 9,
      search: 'web de autor novela landing de novela kdp dark academia premium oscuro'
    },
    app: {
      brandName: '404 App Studio',
      offer: 'Landing premium para presentar una app web, demo, beneficios, capturas y llamada a probarla',
      audience: 'Usuarios avanzados que buscan herramientas útiles, rápidas y visualmente cuidadas',
      mainCta: 'Probar la app',
      tone: 'Futurista limpio',
      intensity: 8,
      search: 'saas app dashboard ia landing producto digital demo'
    },
    producto: {
      brandName: 'Marca Premium',
      offer: 'Página de venta elegante para un producto diferenciado con prueba social y propuesta clara',
      audience: 'Compradores exigentes que valoran diseño, confianza y una decisión fácil',
      mainCta: 'Comprar ahora',
      tone: 'Premium oscuro',
      intensity: 8,
      search: 'producto fisico tienda boutique luxury brand ecommerce premium'
    },
    servicio: {
      brandName: 'Estudio Profesional',
      offer: 'Web de servicios premium para captar clientes, explicar proceso, mostrar casos y cerrar contactos',
      audience: 'Empresas, creadores y profesionales que necesitan una solución seria y rápida',
      mainCta: 'Solicitar propuesta',
      tone: 'Corporativo elite',
      intensity: 7,
      search: 'agencia digital consultoria portfolio creativo corporate saas'
    }
  };

  const SKIN_CATEGORIES = [
    { id: 'neon',      label: 'Oscuras / neón' },
    { id: 'editorial', label: 'Editorial / claras' },
    { id: 'gotico',    label: 'Gótico / horror' },
    { id: 'lujo',      label: 'Lujo / minimalista' },
    { id: 'natura',    label: 'Naturaleza' },
    { id: 'retro',     label: 'Retro / vintage' },
    { id: 'corp',      label: 'Corporate / SaaS' }
  ];

  /* Cada skin define solo su identidad: color base + tipografía + radio.
     Todo lo demás (líneas, sombras, overlays, muted) se deriva en CSS
     con color-mix(), así que añadir una skin no toca styles.css. */
  const SKINS = [
    // ── Oscuras / neón ──────────────────────────────────────
    { id: 'dark',       name: 'Neon Dark',   category: 'neon', mode: 'dark',
      bg: '#060912', bg2: '#0a0f1e', text: '#edf4ff', brand: '#7cffcb', brand2: '#8b5cf6',
      btnText: '#04100d', radius: 24, fontTitle: SANS, fontBody: SANS },
    { id: 'cyberpunk',  name: 'Cyberpunk',   category: 'neon', mode: 'dark',
      bg: '#0a0010', bg2: '#12001a', text: '#f0e6ff', brand: '#ff00cc', brand2: '#00eeff',
      btnText: '#1a001a', radius: 10, fontTitle: MONO, fontBody: SANS,
      heading: '-0.02em', eyebrow: { transform: 'uppercase', tracking: '.22em' } },
    { id: 'synthwave',  name: 'Synthwave',   category: 'neon', mode: 'dark',
      bg: '#170826', bg2: '#20103a', text: '#ffe9fb', brand: '#ff2e88', brand2: '#00d4ff',
      btnText: '#1a0210', radius: 18, fontTitle: SANS, fontBody: SANS,
      eyebrow: { transform: 'uppercase', tracking: '.18em' } },
    { id: 'matrix',     name: 'Matrix',      category: 'neon', mode: 'dark',
      bg: '#000803', bg2: '#04140a', text: '#c9ffd6', brand: '#00ff66', brand2: '#0a5c2a',
      btnText: '#00230d', radius: 6, fontTitle: MONO, fontBody: MONO },
    { id: 'vaporwave',  name: 'Vaporwave',   category: 'neon', mode: 'dark',
      bg: '#1a0e2e', bg2: '#241640', text: '#fbe8ff', brand: '#ff71ce', brand2: '#01cdfe',
      btnText: '#1a0e26', radius: 22, fontTitle: SANS, fontBody: SANS },
    { id: 'blackout',   name: 'Blackout',    category: 'neon', mode: 'dark',
      bg: '#050505', bg2: '#0c0c0c', text: '#ffffff', brand: '#ffffff', brand2: '#8a8a8a',
      btnText: '#050505', radius: 4, fontTitle: MONO, fontBody: SANS,
      eyebrow: { transform: 'uppercase', tracking: '.26em' } },

    // ── Editorial / claras ──────────────────────────────────
    { id: 'light',      name: 'Focus Light', category: 'editorial', mode: 'light',
      bg: '#f0f4f9', bg2: '#e6ecf5', text: '#0f172a', brand: '#047857', brand2: '#6d28d9',
      btnText: '#ecfdf5', radius: 18, fontTitle: SANS, fontBody: SANS },
    { id: 'solar',      name: 'Solar Warm',  category: 'editorial', mode: 'light',
      bg: '#fdf6ec', bg2: '#f5e8d5', text: '#1c0f00', brand: '#d4580a', brand2: '#9b3a00',
      btnText: '#fff8f0', radius: 16, fontTitle: SERIF, fontBody: SANS, heading: '-0.02em' },
    { id: 'paper',      name: 'Paper',       category: 'editorial', mode: 'light',
      bg: '#faf8f3', bg2: '#f0ecdf', text: '#201b12', brand: '#2b2b2b', brand2: '#8a6d3b',
      btnText: '#faf8f3', radius: 6, fontTitle: SERIF, fontBody: SERIF, heading: '-0.01em' },
    { id: 'nordic',     name: 'Nordic',      category: 'editorial', mode: 'light',
      bg: '#eef1f4', bg2: '#e1e7ec', text: '#1b2a33', brand: '#3b6ea5', brand2: '#6b8f9e',
      btnText: '#f2f7fb', radius: 14, fontTitle: SANS, fontBody: SANS },
    { id: 'cream',      name: 'Cream',       category: 'editorial', mode: 'light',
      bg: '#fbf3e7', bg2: '#f2e4cd', text: '#2e2210', brand: '#b08968', brand2: '#7f5539',
      btnText: '#fbf3e7', radius: 16, fontTitle: SERIF, fontBody: SANS, heading: '-0.02em' },
    { id: 'daylight',   name: 'Daylight',    category: 'editorial', mode: 'light',
      bg: '#ffffff', bg2: '#eef2ff', text: '#0f172a', brand: '#2563eb', brand2: '#7c3aed',
      btnText: '#ffffff', radius: 18, fontTitle: SANS, fontBody: SANS },

    // ── Gótico / horror ──────────────────────────────────────
    { id: 'santa-bruna',   name: 'Santa Bruna',   category: 'gotico', mode: 'dark',
      bg: '#0d0407', bg2: '#170810', text: '#f2e6e2', brand: '#a13a4a', brand2: '#4a0e14',
      btnText: '#fdf0ee', radius: 8, fontTitle: SERIF, fontBody: SERIF, heading: '-0.01em' },
    { id: 'grimoire',      name: 'Grimoire',      category: 'gotico', mode: 'dark',
      bg: '#0a0806', bg2: '#171208', text: '#ede4d3', brand: '#c9a04e', brand2: '#3d2b1a',
      btnText: '#171208', radius: 6, fontTitle: SERIF, fontBody: SERIF, heading: '0em' },
    { id: 'necronomicon',  name: 'Necronomicon',  category: 'gotico', mode: 'dark',
      bg: '#050505', bg2: '#0c130e', text: '#dcefe1', brand: '#5fa677', brand2: '#1a3320',
      btnText: '#08130b', radius: 4, fontTitle: SERIF, fontBody: SANS, heading: '-0.01em' },
    { id: 'blackwood',     name: 'Blackwood',     category: 'gotico', mode: 'dark',
      bg: '#0b0a0d', bg2: '#161320', text: '#e9e2f0', brand: '#8c5c8c', brand2: '#2e1f2e',
      btnText: '#160f16', radius: 10, fontTitle: SERIF, fontBody: SANS },
    { id: 'ravenscroft',   name: 'Ravenscroft',   category: 'gotico', mode: 'dark',
      bg: '#08080a', bg2: '#14151a', text: '#e6e8ec', brand: '#b6bcc6', brand2: '#374151',
      btnText: '#14151a', radius: 6, fontTitle: SERIF, fontBody: SANS, heading: '-0.01em' },
    { id: 'widows-veil',   name: "Widow's Veil",  category: 'gotico', mode: 'dark',
      bg: '#0c0509', bg2: '#1a0a10', text: '#f0e0e4', brand: '#8a3f52', brand2: '#2a0f14',
      btnText: '#fbeef1', radius: 8, fontTitle: SERIF, fontBody: SERIF, heading: '-0.01em' },

    // ── Lujo / minimalista ───────────────────────────────────
    { id: 'obsidian',   name: 'Obsidian',    category: 'lujo', mode: 'dark',
      bg: '#0e0e0e', bg2: '#141414', text: '#f5f5f5', brand: '#e8d5b7', brand2: '#c4a882',
      btnText: '#1a1208', radius: 12, fontTitle: SERIF, fontBody: SANS, heading: '-0.02em' },
    { id: 'ivory',      name: 'Ivory',       category: 'lujo', mode: 'light',
      bg: '#f7f5f0', bg2: '#ece7db', text: '#1a1a1a', brand: '#1a1a1a', brand2: '#6b6b6b',
      btnText: '#f7f5f0', radius: 4, fontTitle: SANS, fontBody: SANS,
      eyebrow: { transform: 'uppercase', tracking: '.2em' } },
    { id: 'champagne',  name: 'Champagne',   category: 'lujo', mode: 'dark',
      bg: '#14100c', bg2: '#1c1611', text: '#f2e9db', brand: '#d4af6a', brand2: '#8c7250',
      btnText: '#1c1611', radius: 10, fontTitle: SERIF, fontBody: SANS, heading: '-0.01em' },
    { id: 'platinum',   name: 'Platinum',    category: 'lujo', mode: 'dark',
      bg: '#17181a', bg2: '#1f2124', text: '#e8eaed', brand: '#c8ccd1', brand2: '#8a8f98',
      btnText: '#17181a', radius: 8, fontTitle: SANS, fontBody: SANS },

    // ── Naturaleza ────────────────────────────────────────────
    { id: 'aurora',     name: 'Aurora',      category: 'natura', mode: 'dark',
      bg: '#040c14', bg2: '#071320', text: '#d8f5ff', brand: '#00e6c8', brand2: '#3b6fff',
      btnText: '#001a18', radius: 22, fontTitle: SANS, fontBody: SANS },
    { id: 'forest',     name: 'Forest',      category: 'natura', mode: 'dark',
      bg: '#0a120c', bg2: '#10190f', text: '#dcecdc', brand: '#5fb37e', brand2: '#2d5a3d',
      btnText: '#0a1a0f', radius: 20, fontTitle: SANS, fontBody: SANS },
    { id: 'terracotta', name: 'Terracotta',  category: 'natura', mode: 'dark',
      bg: '#1c120c', bg2: '#241811', text: '#f2e2d4', brand: '#c9683a', brand2: '#8a4526',
      btnText: '#1c120c', radius: 16, fontTitle: SERIF, fontBody: SANS, heading: '-0.02em' },
    { id: 'moss',       name: 'Moss',        category: 'natura', mode: 'dark',
      bg: '#0e120d', bg2: '#161b14', text: '#e2e8dd', brand: '#8bab6e', brand2: '#465e35',
      btnText: '#111a0e', radius: 18, fontTitle: SANS, fontBody: SANS },
    { id: 'desert',     name: 'Desert',      category: 'natura', mode: 'light',
      bg: '#f4ead9', bg2: '#e9d8bc', text: '#3a2a15', brand: '#c17a3d', brand2: '#8a5a2e',
      btnText: '#f4ead9', radius: 14, fontTitle: SERIF, fontBody: SANS, heading: '-0.02em' },

    // ── Retro / vintage ───────────────────────────────────────
    { id: 'typewriter', name: 'Typewriter',  category: 'retro', mode: 'light',
      bg: '#f2ede2', bg2: '#e6ddc9', text: '#2b2620', brand: '#2b2620', brand2: '#6b5f4d',
      btnText: '#f2ede2', radius: 2, fontTitle: MONO, fontBody: MONO,
      heading: '0em', eyebrow: { transform: 'none', tracking: '.02em' } },
    { id: 'sepia',      name: 'Sepia',       category: 'retro', mode: 'dark',
      bg: '#2c2013', bg2: '#392b1a', text: '#f0e0c4', brand: '#d4b06a', brand2: '#8a6d3f',
      btnText: '#241a0e', radius: 10, fontTitle: SERIF, fontBody: SERIF, heading: '-0.01em' },
    { id: 'arcade',     name: 'Arcade 8-bit', category: 'retro', mode: 'dark',
      bg: '#0a0a1a', bg2: '#14142c', text: '#f0f0ff', brand: '#ffcc00', brand2: '#ff3860',
      btnText: '#1a0a00', radius: 0, fontTitle: MONO, fontBody: MONO,
      eyebrow: { transform: 'uppercase', tracking: '.24em' } },
    { id: 'vinyl',      name: 'Vinyl',       category: 'retro', mode: 'dark',
      bg: '#14110f', bg2: '#1e1916', text: '#f0e6de', brand: '#d4443a', brand2: '#8a2e26',
      btnText: '#1a0e0c', radius: 999, fontTitle: SERIF, fontBody: SANS, heading: '-0.02em' },
    { id: 'newsprint',  name: 'Newsprint',   category: 'retro', mode: 'light',
      bg: '#ece8de', bg2: '#dfd9c9', text: '#1c1c1c', brand: '#1c1c1c', brand2: '#555044',
      btnText: '#ece8de', radius: 2, fontTitle: SERIF, fontBody: SERIF, heading: '0em' },

    // ── Corporate / SaaS ──────────────────────────────────────
    { id: 'slate',      name: 'Slate',       category: 'corp', mode: 'dark',
      bg: '#10141c', bg2: '#161c27', text: '#e6ebf5', brand: '#5b8def', brand2: '#3a5ba8',
      btnText: '#0a1220', radius: 14, fontTitle: SANS, fontBody: SANS },
    { id: 'indigo-corp', name: 'Indigo Corp', category: 'corp', mode: 'light',
      bg: '#ffffff', bg2: '#eef0fd', text: '#1e1b3a', brand: '#4338ca', brand2: '#1e1b4b',
      btnText: '#ffffff', radius: 12, fontTitle: SANS, fontBody: SANS },
    { id: 'mono-tech',  name: 'Mono Tech',   category: 'corp', mode: 'dark',
      bg: '#0c0c0e', bg2: '#151517', text: '#f0f0f0', brand: '#ffffff', brand2: '#737373',
      btnText: '#0c0c0e', radius: 6, fontTitle: MONO, fontBody: SANS }
  ];

  const state = {
    query: '',
    category: '',
    style: '',
    sort: 'score',
    visible: INITIAL_VISIBLE,
    selected: models[0] || null,
    brief: {},
    skin: DEFAULT_SKIN
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const safeStorage = {
    get(key) {
      try { return window.localStorage.getItem(key); } catch { return null; }
    },
    set(key, value) {
      try { window.localStorage.setItem(key, value); } catch { /* storage bloqueado */ }
    },
    remove(key) {
      try { window.localStorage.removeItem(key); } catch { /* storage bloqueado */ }
    }
  };

  const escapeHtml = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const normalizeText = (value = '') => String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

  const slugify = (value = 'web') => normalizeText(value)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'web';

  const safeColor = (value, fallback = '#7CFFCB') => {
    const color = String(value || '').trim();
    return /^#[0-9a-fA-F]{6}$/.test(color) ? color.toUpperCase() : fallback;
  };

  const withAlpha = (hex, alpha = '33') => `${safeColor(hex)}${alpha}`;

  const els = {};

  const readElements = () => {
    Object.assign(els, {
      grid:             $('#modelGrid'),
      recommendedGrid:  $('#recommendedGrid'),
      recommendedIntro: $('#recommendedIntro'),
      resultCount:      $('#resultCount'),
      categoryFilter:   $('#categoryFilter'),
      styleFilter:      $('#styleFilter'),
      sortFilter:       $('#sortFilter'),
      searchInput:      $('#searchInput'),
      selectedSummary:  $('#selectedSummary'),
      sitePreview:      $('#sitePreview'),
      previewShell:     $('#previewShell'),
      heroScore:        $('#heroScore'),
      auditGrade:       $('#auditGrade'),
      auditList:        $('#auditList'),
      blueprintOutput:  $('#blueprintOutput'),
      toast:            $('#toast'),
      briefForm:        $('#briefForm'),
      brandName:        $('#brandName'),
      offer:            $('#offer'),
      audience:         $('#audience'),
      mainCta:          $('#mainCta'),
      tone:             $('#tone'),
      intensity:        $('#intensity'),
      intensityVal:     $('#intensityVal'),
      loadMore:         $('#loadMore'),
      applyBrief:       $('#applyBrief'),
      generateFromInputs: $('#generateFromInputs'),
      scrollCatalog:    $('#scrollCatalog'),
      randomBtn:        $('#randomBtn'),
      copyPrompt:       $('#copyPrompt'),
      copyHtml:         $('#copyHtml'),
      downloadHtml:     $('#downloadHtml'),
      downloadJson:     $('#downloadJson'),
      copyBlueprint:    $('#copyBlueprint'),
      downloadKit:      $('#downloadKit'),
      copyChecklist:    $('#copyChecklist'),
      desktopPreview:   $('#desktopPreview'),
      mobilePreview:    $('#mobilePreview'),
      stepper:          $('#stepper'),
      skinGallery:      $('#skinGallery'),
      skinChips:        $('#skinChips'),
      skinSearch:       $('#skinSearch'),
      briefContinue:    $('#briefContinue'),
      briefError:       $('#briefError'),
      catalogContinue:  $('#catalogContinue'),
      builderContinue:  $('#builderContinue'),
      productContinue:  $('#productContinue'),
      finishBtn:        $('#finishBtn')
    });
  };

  /* ── TOAST ─────────────────────────────────────────────── */
  const toast = (message) => {
    if (!els.toast) return;
    els.toast.textContent = message;
    els.toast.classList.add('show');
    window.clearTimeout(toast.timer);
    toast.timer = window.setTimeout(() => els.toast.classList.remove('show'), 2300);
  };

  /* ── BRIEF ─────────────────────────────────────────────── */
  const getBrief = () => ({
    brandName: els.brandName?.value.trim() || 'Proyecto sin nombre',
    offer:     els.offer?.value.trim()     || 'Una propuesta clara y profesional',
    audience:  els.audience?.value.trim()  || 'usuarios exigentes',
    mainCta:   els.mainCta?.value.trim()   || (state.selected?.cta || 'Empezar'),
    tone:      els.tone?.value             || 'Premium oscuro',
    intensity: Number(els.intensity?.value || 8)
  });

  const saveBrief = () => safeStorage.set('404-web-architect-brief', JSON.stringify(getBrief()));

  const restoreBrief = () => {
    try {
      const saved = JSON.parse(safeStorage.get('404-web-architect-brief') || 'null');
      if (!saved || typeof saved !== 'object') return;
      ['brandName', 'offer', 'audience', 'mainCta', 'tone', 'intensity'].forEach((key) => {
        if (els[key] && saved[key] !== undefined) els[key].value = saved[key];
      });
      if (els.intensityVal) els.intensityVal.value = els.intensity?.value || 8;
    } catch { /* brief antiguo o corrupto */ }
  };

  /* ── SKINS (v2.0) ──────────────────────────────────────────
     Cada skin fija ~9 propiedades vía CSS custom properties;
     el resto (líneas, overlays, glows, muted) se deriva solo
     en styles.css con color-mix(). Ver comentario en :root. */
  const skinState = { query: '', category: '' };

  const findSkin = (id) => SKINS.find((s) => s.id === id) || SKINS[0];

  const applySkin = (id) => {
    const skin = findSkin(id);
    state.skin = skin.id;
    const root = document.documentElement.style;
    root.setProperty('--bg', skin.bg);
    root.setProperty('--bg2', skin.bg2);
    root.setProperty('--text', skin.text);
    root.setProperty('--brand', skin.brand);
    root.setProperty('--brand-2', skin.brand2);
    root.setProperty('--brand-btn-text', skin.btnText);
    root.setProperty('--radius', `${skin.radius}px`);
    root.setProperty('--font-title', skin.fontTitle);
    root.setProperty('--font-body', skin.fontBody);
    root.setProperty('--heading-tracking', skin.heading || '-0.06em');
    root.setProperty('--eyebrow-transform', skin.eyebrow?.transform || 'uppercase');
    root.setProperty('--eyebrow-tracking', skin.eyebrow?.tracking || '.14em');
    document.documentElement.setAttribute('data-skin', skin.id);
    document.documentElement.setAttribute('data-mode', skin.mode);
    document.documentElement.style.setProperty('color-scheme', skin.mode);
    safeStorage.set('404-web-architect-skin', skin.id);
    renderSkinGallery();
  };

  const getFilteredSkins = () => {
    const q = normalizeText(skinState.query);
    return SKINS.filter((s) =>
      (!skinState.category || s.category === skinState.category) &&
      (!q || normalizeText(`${s.name} ${s.category}`).includes(q)));
  };

  const skinCardTemplate = (skin) => `
    <button type="button" class="skin-btn${skin.id === state.skin ? ' active' : ''}"
      data-skin="${escapeHtml(skin.id)}" aria-pressed="${skin.id === state.skin}">
      <span class="skin-swatch" style="background:linear-gradient(135deg, ${safeColor(skin.brand)}, ${safeColor(skin.brand2)})"></span>
      <span class="skin-name">${escapeHtml(skin.name)}</span>
      <span class="skin-font-sample" style="font-family:${skin.fontTitle}">${escapeHtml(skin.name)}</span>
    </button>`;

  const renderSkinChips = () => {
    if (!els.skinChips) return;
    const all = `<button type="button" class="skin-chip" data-cat="" aria-pressed="${!skinState.category}">Todas</button>`;
    const chips = SKIN_CATEGORIES.map((c) =>
      `<button type="button" class="skin-chip" data-cat="${c.id}" aria-pressed="${skinState.category === c.id}">${escapeHtml(c.label)}</button>`
    ).join('');
    els.skinChips.innerHTML = all + chips;
  };

  const renderSkinGallery = () => {
    if (!els.skinGallery) return;
    const visible = getFilteredSkins();
    els.skinGallery.innerHTML = visible.map(skinCardTemplate).join('') ||
      '<p class="skin-empty">Ninguna skin coincide con esa búsqueda.</p>';
    renderSkinChips();
  };

  /* ── FILTERS ────────────────────────────────────────────── */
  const unique = (key) => [...new Set(models.map((m) => m[key]).filter(Boolean))]
    .sort((a, b) => String(a).localeCompare(String(b), 'es'));

  const fillFilters = () => {
    unique('category').forEach((cat) => {
      const opt = document.createElement('option');
      opt.value = cat; opt.textContent = cat;
      els.categoryFilter.appendChild(opt);
    });
    unique('style').forEach((sty) => {
      const opt = document.createElement('option');
      opt.value = sty; opt.textContent = sty;
      els.styleFilter.appendChild(opt);
    });
  };

  const getFiltered = () => {
    const q = normalizeText(state.query);
    return models
      .filter((model) => {
        const hay = normalizeText([
          model.title, model.category, model.style,
          model.layout, model.purpose, model.vibe,
          ...(Array.isArray(model.tags) ? model.tags : [])
        ].join(' '));
        return (!q || hay.includes(q)) &&
          (!state.category || model.category === state.category) &&
          (!state.style    || model.style    === state.style);
      })
      .sort((a, b) => {
        if (state.sort === 'score') return b.score - a.score || a.title.localeCompare(b.title, 'es');
        return String(a[state.sort]).localeCompare(String(b[state.sort]), 'es') || b.score - a.score;
      });
  };

  /* ── RECOMENDACIÓN SEGÚN BRIEF ──────────────────────────── */
  const STOPWORDS = new Set(['de','la','el','los','las','un','una','para','con','que','y','o','a','en','del','al','tu','su','sus','es','muy']);

  const getRecommended = (limit = 3) => {
    const brief = getBrief();
    const queryWords = normalizeText([brief.offer, brief.audience, brief.tone].join(' '))
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 2 && !STOPWORDS.has(w));

    if (!queryWords.length) {
      return models.slice().sort((a, b) => b.score - a.score).slice(0, limit);
    }

    const scored = models.map((model) => {
      const hay = normalizeText([
        model.title, model.category, model.style, model.layout,
        model.purpose, model.vibe, model.audience,
        ...(Array.isArray(model.tags) ? model.tags : [])
      ].join(' '));
      const matchCount = queryWords.reduce((acc, w) => acc + (hay.includes(w) ? 1 : 0), 0);
      return { model, matchCount };
    });

    const withMatches = scored.filter((entry) => entry.matchCount > 0);
    const pool = withMatches.length ? withMatches : scored;

    return pool
      .sort((a, b) => b.matchCount - a.matchCount || b.model.score - a.model.score)
      .slice(0, limit)
      .map((entry) => entry.model);
  };

  const renderRecommended = () => {
    if (!els.recommendedGrid) return;
    const brief = getBrief();
    const picks = getRecommended(3);
    els.recommendedGrid.innerHTML = picks.map(cardTemplate).join('');
    if (els.recommendedIntro) {
      els.recommendedIntro.textContent =
        `Según tu brief: ${brief.tone.toLowerCase()}, intensidad ${brief.intensity}/10.`;
    }
  };

  const scoreModelAgainstText = (model, text) => {
    const terms = normalizeText(text)
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 2 && !STOPWORDS.has(w));
    const hay = normalizeText([
      model.title, model.category, model.style, model.layout,
      model.purpose, model.vibe, model.audience,
      ...(Array.isArray(model.tags) ? model.tags : [])
    ].join(' '));
    const matches = terms.reduce((acc, term) => acc + (hay.includes(term) ? 1 : 0), 0);
    return matches * 1000 + Number(model.score || 0);
  };

  const bestModelForText = (text) => models
    .slice()
    .sort((a, b) => scoreModelAgainstText(b, text) - scoreModelAgainstText(a, text))[0];

  const applyQuickPreset = (presetId) => {
    const preset = QUICK_PRESETS[presetId];
    if (!preset) return;
    ['brandName', 'offer', 'audience', 'mainCta', 'tone', 'intensity'].forEach((key) => {
      if (els[key] && preset[key] !== undefined) els[key].value = preset[key];
    });
    if (els.intensityVal) els.intensityVal.value = preset.intensity;
    saveBrief();
    const best = bestModelForText(preset.search);
    if (best) state.selected = best;
    if (best) safeStorage.set('404-web-architect-selected', best.id);
    state.query = '';
    state.category = '';
    state.style = '';
    state.visible = INITIAL_VISIBLE;
    if (els.searchInput) els.searchInput.value = '';
    if (els.categoryFilter) els.categoryFilter.value = '';
    if (els.styleFilter) els.styleFilter.value = '';
    renderGrid();
    renderSelected();
    renderRecommended();
    unlockStep(2);
    toast(`Modo aplicado: ${preset.brandName}. Ya tienes modelo recomendado.`);
  };


  const cardTemplate = (model) => {
    const color = safeColor(model.palette?.[2]);
    const isSel = state.selected?.id === model.id;
    return `
      <button class="model-card${isSel ? ' selected' : ''}" type="button"
        data-id="${escapeHtml(model.id)}"
        aria-pressed="${isSel}"
        style="--c1:${color}22">
        <span class="badge score-badge">${escapeHtml(String(model.score))}/100</span>
        <h3>${escapeHtml(model.title)}</h3>
        <p>${escapeHtml(model.purpose)}</p>
        <div class="meta-row">
          <span class="badge">${escapeHtml(model.layout)}</span>
          <span class="badge">${escapeHtml(model.style)}</span>
          <span class="badge">${escapeHtml(model.tags?.[0] || 'pro')}</span>
        </div>
      </button>`;
  };

  const renderGrid = () => {
    const filtered = getFiltered();
    els.resultCount.textContent = `${filtered.length} resultado${filtered.length === 1 ? '' : 's'}`;
    const visible = filtered.slice(0, state.visible);
    els.grid.innerHTML = visible.map(cardTemplate).join('') ||
      '<p class="empty">No hay resultados. Prueba con otra búsqueda, categoría o estilo.</p>';
    els.loadMore.hidden = filtered.length <= state.visible;
  };

  /* ── COPY / HEADLINE HELPERS ────────────────────────────── */
  const previewCopy = (model, brief) => {
    const toneLine = brief.tone
      ? `con un tono ${brief.tone.toLowerCase()}`
      : `con estética ${model.style}`;
    return `${brief.offer}. Diseñada para ${brief.audience}, ${toneLine}, con estructura ${model.layout.toLowerCase()} y una experiencia móvil clara.`;
  };

  const buildHeadline = (model, brief) => {
    const cat = normalizeText(model.category);
    if (cat.includes('autor') || cat.includes('novela') || cat.includes('kdp'))
      return `${brief.brandName}: una web literaria que convierte curiosidad en lectores`;
    if (cat.includes('saas') || cat.includes('ia') || cat.includes('dashboard'))
      return `${brief.brandName}: convierte tu producto en una experiencia imposible de ignorar`;
    if (cat.includes('restaurante') || cat.includes('hotel') || cat.includes('viajes'))
      return `${brief.brandName}: una presencia digital que invita a reservar`;
    return `${brief.brandName}: una página profesional con estructura de alto impacto`;
  };

  const sectionDescription = (section, model, brief) => {
    const clean = normalizeText(section);
    if (clean.includes('hero'))         return `Primera pantalla con promesa clara, estética ${model.style.toLowerCase()} y CTA visible.`;
    if (clean.includes('precio') || clean.includes('planes')) return 'Bloque de decisión con opciones simples, beneficios y objeciones resueltas.';
    if (clean.includes('testimonio') || clean.includes('resena') || clean.includes('opiniones')) return 'Prueba social para aumentar confianza antes del CTA final.';
    if (clean.includes('faq'))          return 'Preguntas clave para reducir fricción y evitar dudas de compra.';
    if (clean.includes('contacto') || clean.includes('reserva')) return `Cierre orientado a ${brief.mainCta.toLowerCase()} sin distraer al usuario.`;
    return `Contenido diseñado para ${brief.audience.toLowerCase()} con jerarquía visual limpia.`;
  };

  /* ── BLUEPRINT ──────────────────────────────────────────── */
  const buildBlueprintData = (model, brief) => {
    const topSections = model.sections.slice(0, 8);
    const normCat = normalizeText(model.category);
    const isAutor  = normCat.includes('autor') || normCat.includes('novela') || normCat.includes('kdp');
    const isSaaS   = normCat.includes('saas') || normCat.includes('dashboard') || normCat.includes('ia');
    const isLocal  = normCat.includes('restaurante') || normCat.includes('hotel') || normCat.includes('viajes');

    const primaryGoal = isAutor
      ? 'convertir visitantes en lectores y compradores potenciales'
      : isSaaS
        ? 'convertir tráfico frío en demos, leads o pruebas cualificadas'
        : 'presentar una propuesta clara, memorable y orientada a conversión';

    const kpis = isLocal
      ? ['Reservas iniciadas', 'Clicks al CTA', 'Tiempo en página']
      : isAutor
        ? ['Clicks a comprar/leer', 'Suscripciones', 'Scroll hasta obras']
        : ['Leads generados', 'Clicks de CTA', 'Conversión de hero'];

    return {
      title: `${brief.brandName} · ${model.title}`,
      verdict: `Modelo recomendado para ${primaryGoal} con estética ${model.style.toLowerCase()} y estructura ${model.layout.toLowerCase()}.`,
      positioning: [
        `Promesa: ${buildHeadline(model, brief)}.`,
        `Público: ${brief.audience}.`,
        `Diferenciador visual: ${model.signature}.`,
        `CTA principal: ${brief.mainCta || model.cta}.`
      ],
      copyBlocks: [
        ['Hero',      buildHeadline(model, brief)],
        ['Subtítulo', previewCopy(model, brief)],
        ['CTA',       brief.mainCta || model.cta],
        ['Prueba',    `Diseño ${model.style.toLowerCase()} con narrativa clara, secciones ordenadas y foco en confianza.`]
      ],
      informationArchitecture: topSections.map((section, i) => ({
        order: i + 1,
        section,
        goal: sectionDescription(section, model, brief)
      })),
      productionPlan: [
        'Definir hero con promesa, objeción principal y CTA visible antes del primer scroll.',
        'Crear bloques de confianza: métricas, prueba social, casos de uso o fragmentos de obra según categoría.',
        'Reducir el formulario o acción final a un único objetivo medible.',
        'Validar móvil antes que escritorio: 360 px, 390 px, 768 px y escritorio ancho.',
        'Publicar en GitHub Pages con README, licencia, capturas y checklist de release.'
      ],
      qaChecklist: [
        'No hay scroll horizontal en móvil.',
        'Todos los botones tienen estado focus-visible y área táctil cómoda.',
        'El CTA principal aparece en hero y cierre.',
        'HTML exportado no contiene datos sin escapar ni dependencias externas.',
        'La página mantiene contraste suficiente en modo oscuro y foco.',
        'La exportación HTML abre sin servidor local.',
        'El README explica instalación, uso, demo y publicación.'
      ],
      kpis
    };
  };

  const renderBlueprint = (model, brief) => {
    if (!els.blueprintOutput) return;
    const bp = buildBlueprintData(model, brief);
    els.blueprintOutput.innerHTML = `
      <article class="blueprint-card blueprint-main">
        <span class="badge score-badge">Estrategia</span>
        <h3>${escapeHtml(bp.title)}</h3>
        <p>${escapeHtml(bp.verdict)}</p>
      </article>
      <article class="blueprint-card">
        <h3>Posicionamiento</h3>
        <ul>${bp.positioning.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
      </article>
      <article class="blueprint-card">
        <h3>Copy base</h3>
        <ul>${bp.copyBlocks.map(([l, v]) => `<li><strong>${escapeHtml(l)}:</strong> ${escapeHtml(v)}</li>`).join('')}</ul>
      </article>
      <article class="blueprint-card">
        <h3>Arquitectura</h3>
        <ol>${bp.informationArchitecture.slice(0, 6).map((item) =>
          `<li><strong>${escapeHtml(item.section)}</strong><span>${escapeHtml(item.goal)}</span></li>`
        ).join('')}</ol>
      </article>
      <article class="blueprint-card">
        <h3>KPIs</h3>
        <div class="meta-row">${bp.kpis.map((k) => `<span class="badge">${escapeHtml(k)}</span>`).join('')}</div>
      </article>`;
  };

  /* ── AUDIT ──────────────────────────────────────────────── */
  const renderAudit = (model, brief) => {
    // FIX: puntuación real basada en score del modelo sin clamp artificial
    const base = model.score / 10;
    const intensityBonus = brief.intensity >= 7 ? 0.1 : 0;
    const grade = Math.min(10, base + intensityBonus).toFixed(1);
    els.auditGrade.textContent = `${grade}/10`;

    const audits = [
      ['Arquitectura',    'Hero, prueba, beneficios, objeciones, FAQ y CTA final. Correcta para conversión.'],
      ['UX móvil',        'Diseño mobile-first, botones grandes, grid fluido, preview móvil y controles táctiles claros.'],
      ['Accesibilidad',   'HTML semántico, foco visible, contraste alto, skip link, estados aria y textos de CTA claros.'],
      ['Seguridad',       'Sin dependencias externas, salida escapada, colores saneados y CSP defensiva en index.html.'],
      ['Rendimiento',     'Proyecto estático ligero, datos locales y sin llamadas a red.'],
      ['GitHub',          'Compatible con GitHub Pages: publicación directa desde la interfaz web, sin Actions ni dependencias.'],
      ['Riesgo pendiente','El modelo no sustituye test humano real ni copy final específico de marca.']
    ];
    els.auditList.innerHTML = audits.map(([title, text], i) => `
      <article class="audit-item">
        <span class="audit-dot" aria-hidden="true"></span>
        <div><strong>${escapeHtml(title)}</strong><p>${escapeHtml(text)}</p></div>
        <span class="badge">${i === audits.length - 1 ? 'vigilar' : 'ok'}</span>
      </article>`).join('');
  };

  /* ── RENDER SELECTED ────────────────────────────────────── */
  const renderSelected = () => {
    const model = state.selected;
    if (!model) return;
    const brief = getBrief();
    state.brief = brief;
    saveBrief();

    const palette = (Array.isArray(model.palette) ? model.palette : DEFAULT_PALETTE)
      .map((c, i) => safeColor(c, DEFAULT_PALETTE[i]));

    els.heroScore.textContent = String(model.score);
    els.selectedSummary.innerHTML = `
      <h3>${escapeHtml(model.title)}</h3>
      <p><strong>Objetivo:</strong> ${escapeHtml(model.purpose)}</p>
      <p><strong>Firma visual:</strong> ${escapeHtml(model.signature)}</p>
      <div class="meta-row">
        ${model.sections.slice(0, 6).map((s) => `<span class="badge">${escapeHtml(s)}</span>`).join('')}
      </div>`;

    els.sitePreview.style.setProperty('--preview-bg',   palette[0]);
    els.sitePreview.style.setProperty('--preview-text', palette[3]);
    els.sitePreview.style.setProperty('--accent',       palette[2]);
    els.sitePreview.style.setProperty('--accent-soft',  withAlpha(palette[2], '33'));

    els.sitePreview.innerHTML = `
      <section class="site-hero">
        <nav class="site-nav" aria-label="Preview navegación">
          <span class="site-logo">${escapeHtml(brief.brandName)}</span>
          <span class="site-nav-links">
            <span>Modelo</span><span>Beneficios</span><span>Proceso</span><span>Contacto</span>
          </span>
        </nav>
        <p class="eyebrow">${escapeHtml(model.category)} · ${escapeHtml(model.style)}</p>
        <h2>${escapeHtml(buildHeadline(model, brief))}</h2>
        <p>${escapeHtml(previewCopy(model, brief))}</p>
        <a href="#contacto-preview" class="site-cta">${escapeHtml(brief.mainCta || model.cta)}</a>
      </section>
      <section class="site-sections" aria-label="Secciones propuestas">
        ${model.sections.slice(0, 6).map((sec, i) => `
          <article class="site-section-card">
            <strong>${String(i + 1).padStart(2, '0')} · ${escapeHtml(sec)}</strong>
            <span>${escapeHtml(sectionDescription(sec, model, brief))}</span>
          </article>`).join('')}
      </section>
      <footer class="site-footer" id="contacto-preview">
        <span>${escapeHtml(model.layout)} · ${escapeHtml(model.font)}</span>
        <span>${escapeHtml(model.cta)}</span>
      </footer>`;

    renderBlueprint(model, brief);
    renderAudit(model, brief);
    renderGrid();
  };

  /* ── EXPORT HTML ────────────────────────────────────────── */
  const buildExportHtml = () => {
    const model = state.selected;
    if (!model) return '';
    const brief = getBrief();
    const p = (Array.isArray(model.palette) ? model.palette : DEFAULT_PALETTE)
      .map((c, i) => safeColor(c, DEFAULT_PALETTE[i]));
    const bp = buildBlueprintData(model, brief);

    const cards = model.sections.map((sec, i) => `
      <article class="card">
        <small>${String(i + 1).padStart(2, '0')}</small>
        <h3>${escapeHtml(sec)}</h3>
        <p>${escapeHtml(sectionDescription(sec, model, brief))}</p>
      </article>`).join('\n');

    const proofItems  = bp.kpis.map((k) => `<span class="pill">${escapeHtml(k)}</span>`).join('');
    const planItems   = bp.productionPlan.slice(0, 4).map((item, i) =>
      `<li><strong>${String(i + 1).padStart(2, '0')}</strong><span>${escapeHtml(item)}</span></li>`).join('');
    const faqItems = [
      ['¿Está lista para móvil?',           'Sí. La estructura se plantea mobile-first y con CTA visible en pantallas pequeñas.'],
      ['¿Se puede publicar en GitHub Pages?','Sí. Es HTML estático sin backend ni dependencias externas.'],
      ['¿Qué debo personalizar?',           'Marca, imágenes, prueba social real, enlaces finales y métricas de conversión.']
    ].map(([q, a]) => `<details><summary>${escapeHtml(q)}</summary><p>${escapeHtml(a)}</p></details>`).join('');

    return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escapeHtml(brief.offer)}">
  <title>${escapeHtml(brief.brandName)} · ${escapeHtml(model.category)}</title>
  <style>
    :root{--bg:${p[0]};--panel:${p[1]};--accent:${p[2]};--text:${p[3]};--muted:rgba(255,255,255,.72);--line:rgba(255,255,255,.14)}
    *{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:radial-gradient(circle at 85% 0,color-mix(in srgb,var(--accent),transparent 84%),transparent 34%),var(--bg);color:var(--text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;letter-spacing:-.02em}a{color:inherit}.wrap{width:min(1120px,calc(100% - 32px));margin:auto}.nav{display:flex;justify-content:space-between;gap:16px;align-items:center;padding:24px 0}.logo{font-weight:950}.nav span:last-child{color:var(--muted)}.hero{padding:72px 0 48px}.eyebrow{color:var(--accent);text-transform:uppercase;letter-spacing:.14em;font-size:.78rem;font-weight:850}.hero h1{max-width:980px;font-size:clamp(3rem,9vw,7rem);line-height:.88;letter-spacing:-.08em;margin:12px 0 20px}.hero p,.section-intro{max-width:720px;color:var(--muted);font-size:1.15rem;line-height:1.7}.cta{display:inline-flex;align-items:center;justify-content:center;min-height:52px;margin-top:18px;padding:0 22px;border-radius:999px;background:var(--accent);color:#07100d;text-decoration:none;font-weight:900}.proof{display:flex;flex-wrap:wrap;gap:10px;padding:8px 0 30px}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding:22px 0 46px}.card,.process,.faq details{border:1px solid var(--line);background:rgba(255,255,255,.055);border-radius:24px;padding:22px}.card{min-height:190px}.card small{color:var(--accent);font-weight:900}.card h3{font-size:1.25rem}.card p{color:var(--muted);line-height:1.6}.process{margin-bottom:18px}.process ol{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;padding:0;margin:0;list-style:none}.process li{display:grid;grid-template-columns:auto 1fr;gap:10px;color:var(--muted);line-height:1.5}.process strong{color:var(--accent)}.faq{display:grid;gap:10px;margin:18px 0 54px}.faq summary{cursor:pointer;font-weight:850}.faq p{color:var(--muted);line-height:1.6}.footer{border-top:1px solid var(--line);padding:28px 0;color:var(--muted);display:flex;justify-content:space-between;gap:18px}.pill{border:1px solid var(--line);border-radius:999px;padding:.5rem .8rem}@media(max-width:760px){.nav,.footer{align-items:flex-start;flex-direction:column}.grid,.process ol{grid-template-columns:1fr}.hero{padding:44px 0 32px}.hero h1{font-size:clamp(2.7rem,15vw,4.8rem)}}
  </style>
</head>
<body>
  <header class="wrap nav"><strong class="logo">${escapeHtml(brief.brandName)}</strong><span>${escapeHtml(model.category)} · ${escapeHtml(model.style)}</span></header>
  <main class="wrap">
    <section class="hero">
      <p class="eyebrow">${escapeHtml(model.layout)} · listo para GitHub</p>
      <h1>${escapeHtml(buildHeadline(model, brief))}</h1>
      <p>${escapeHtml(previewCopy(model, brief))}</p>
      <a class="cta" href="#contacto">${escapeHtml(brief.mainCta || model.cta)}</a>
    </section>
    <section class="proof" aria-label="Indicadores de conversión sugeridos">${proofItems}</section>
    <section class="grid" aria-label="Secciones de la página">${cards}</section>
    <section class="process" aria-labelledby="proceso">
      <p class="eyebrow" id="proceso">Plan de producción</p>
      <p class="section-intro">Una hoja de ruta breve para convertir esta landing en una pieza publicable y medible.</p>
      <ol>${planItems}</ol>
    </section>
    <section class="faq" aria-label="Preguntas frecuentes">${faqItems}</section>
  </main>
  <footer class="wrap footer" id="contacto"><span>${escapeHtml(model.signature)}</span><span class="pill">${escapeHtml(brief.mainCta || model.cta)}</span></footer>
</body>
</html>`;
  };

  /* ── DOWNLOAD / COPY HELPERS ────────────────────────────── */
  const downloadText = (filename, content, type = 'text/plain') => {
    const blob = new Blob([content], { type });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const copyText = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      toast(`${label} copiado.`);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;left:-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      toast(`${label} copiado.`);
    }
  };

  /* ── PROMPT ─────────────────────────────────────────────── */
  const buildPrompt = () => {
    const model = state.selected;
    if (!model) return '';
    const brief = getBrief();
    return `${model.prompt}\n\nBrief específico:\n- Marca: ${brief.brandName}\n- Oferta: ${brief.offer}\n- Público: ${brief.audience}\n- CTA: ${brief.mainCta}\n- Tono: ${brief.tone}\n- Intensidad visual: ${brief.intensity}/10\n\nEntrega esperada: HTML, CSS y JS limpios, responsive, accesibles, con copy profesional, arquitectura de conversión, checklist QA, microcopy de CTA y sin dependencias innecesarias.`;
  };

  /* ── MARKDOWN KIT ───────────────────────────────────────── */
  const buildQaChecklistText = () => {
    if (!state.selected) return '';
    return buildBlueprintData(state.selected, getBrief()).qaChecklist
      .map((item, i) => `${String(i + 1).padStart(2, '0')}. ${item}`)
      .join('\n');
  };

  const buildMarkdownKit = () => {
    const model = state.selected;
    if (!model) return '';
    const brief = getBrief();
    const bp    = buildBlueprintData(model, brief);
    const arch  = bp.informationArchitecture.map((item) => `${item.order}. **${item.section}** — ${item.goal}`).join('\n');
    const copy  = bp.copyBlocks.map(([l, v]) => `- **${l}:** ${v}`).join('\n');
    const plan  = bp.productionPlan.map((item) => `- [ ] ${item}`).join('\n');
    const qa    = bp.qaChecklist.map((item) => `- [ ] ${item}`).join('\n');
    const kpis  = bp.kpis.map((item) => `- ${item}`).join('\n');

    return `# Kit comercial · ${brief.brandName}\n\n## Modelo elegido\n\n- **Modelo:** ${model.title}\n- **Categoría:** ${model.category}\n- **Estilo:** ${model.style}\n- **Layout:** ${model.layout}\n- **Puntuación:** ${model.score}/100\n\n## Veredicto\n\n${bp.verdict}\n\n## Posicionamiento\n\n${bp.positioning.map((i) => `- ${i}`).join('\n')}\n\n## Copy base\n\n${copy}\n\n## Arquitectura de información\n\n${arch}\n\n## Plan de producción\n\n${plan}\n\n## Checklist QA/release\n\n${qa}\n\n## KPIs recomendados\n\n${kpis}\n\n## Prompt maestro\n\n${buildPrompt()}\n`;
  };

  /* ── SELECT MODEL ───────────────────────────────────────── */
  const selectModel = (id) => {
    const found = models.find((m) => m.id === id);
    if (!found) return;
    state.selected = found;
    safeStorage.set('404-web-architect-selected', found.id);
    renderSelected();
    renderGrid();
    renderRecommended();
    toast(`Modelo seleccionado: ${found.title}`);
  };

  /* ── PREVIEW MODE ───────────────────────────────────────── */
  const setPreviewMode = (mode) => {
    const isMobile = mode === 'mobile';
    els.previewShell.classList.toggle('mobile',  isMobile);
    els.previewShell.classList.toggle('desktop', !isMobile);
    els.desktopPreview.classList.toggle('active', !isMobile);
    els.mobilePreview.classList.toggle('active',  isMobile);
    els.desktopPreview.setAttribute('aria-pressed', String(!isMobile));
    els.mobilePreview.setAttribute('aria-pressed',  String(isMobile));
  };

  /* ── STEPPER (v2.0) ──────────────────────────────────────
     Navegación guiada por hash (#paso-1..#paso-5). El progreso
     máximo alcanzado se guarda en localStorage; solo se puede
     navegar hacia pasos ya completados, nunca saltar adelante. */
  const STEPS = [
    { id: 1, label: 'Brief' },
    { id: 2, label: 'Catálogo' },
    { id: 3, label: 'Personalizar' },
    { id: 4, label: 'Exportar' },
    { id: 5, label: 'Auditoría' }
  ];
  const stepState = { current: 1, maxReached: 1 };

  const readMaxReached = () => {
    const saved = parseInt(safeStorage.get('404-web-architect-step') || '1', 10);
    return Number.isFinite(saved) && saved >= 1 && saved <= STEPS.length ? saved : 1;
  };
  const saveMaxReached = (n) => safeStorage.set('404-web-architect-step', String(n));

  const stepFromHash = () => {
    const match = /^#paso-(\d)$/.exec(window.location.hash);
    const n = match ? parseInt(match[1], 10) : 1;
    return n >= 1 && n <= STEPS.length ? n : 1;
  };

  const renderStepper = () => {
    if (!els.stepper) return;
    els.stepper.innerHTML = STEPS.map((s) => {
      const st = s.id === stepState.current ? 'current' : s.id <= stepState.maxReached ? 'done' : 'locked';
      const mark = st === 'done' ? '<span aria-hidden="true">✓</span> ' : '';
      return `<button type="button" class="step-pill" data-state="${st}" data-target="${s.id}" role="tab" aria-selected="${s.id === stepState.current}" aria-disabled="${st === 'locked'}">${mark}<span class="step-num">${s.id}.</span> ${escapeHtml(s.label)}</button>`;
    }).join('');
  };

  const showStep = (n) => {
    stepState.current = n;
    $$('.step-panel').forEach((panel) => {
      panel.classList.toggle('step-active', Number(panel.dataset.step) === n);
    });
    renderStepper();
    const active = $(`.step-panel[data-step="${n}"]`);
    if (active) active.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const unlockStep = (n) => {
    if (n > stepState.maxReached) {
      stepState.maxReached = n;
      saveMaxReached(n);
    }
  };

  const goToStep = (n) => {
    if (n < 1 || n > STEPS.length) return;
    if (n > stepState.maxReached) {
      toast('Completa los pasos anteriores antes de avanzar.');
      return;
    }
    window.location.hash = `paso-${n}`;
    showStep(n);
  };

  const showRequestedStep = (requested, notify = false) => {
    const allowed = requested <= stepState.maxReached ? requested : stepState.maxReached;
    if (requested !== allowed) {
      if (notify) toast('Ese paso aún está bloqueado. Completa los pasos anteriores.');
      if (window.location.hash !== `#paso-${allowed}`) window.location.hash = `paso-${allowed}`;
      showStep(allowed);
      return;
    }
    showStep(allowed);
  };

  const validateBrief = () => {
    const required = [els.brandName, els.offer, els.audience, els.mainCta];
    const ok = required.every((input) => input && input.value.trim().length > 0);
    if (els.briefError) els.briefError.classList.toggle('visible', !ok);
    return ok;
  };

  const initStepper = () => {
    window.addEventListener('hashchange', () => showRequestedStep(stepFromHash(), true));

    els.stepper?.addEventListener('click', (e) => {
      const btn = e.target.closest('.step-pill');
      if (btn) goToStep(Number(btn.dataset.target));
    });

    els.briefContinue?.addEventListener('click', () => {
      if (!validateBrief()) { toast('Completa el brief antes de continuar.'); return; }
      renderSelected();
      renderRecommended();
      unlockStep(2);
      goToStep(2);
    });
    els.catalogContinue?.addEventListener('click', () => {
      unlockStep(3);
      goToStep(3);
    });
    els.builderContinue?.addEventListener('click', () => {
      unlockStep(4);
      goToStep(4);
    });
    els.productContinue?.addEventListener('click', () => {
      unlockStep(5);
      goToStep(5);
    });
    els.finishBtn?.addEventListener('click', () => {
      toast('¡Listo! Puedes volver a cualquier paso cuando quieras.');
    });

    stepState.maxReached = readMaxReached();
    const hasExplicitHash = /^#paso-[1-5]$/.test(window.location.hash);
    const requested = hasExplicitHash ? stepFromHash() : stepState.maxReached;
    stepState.current = requested <= stepState.maxReached ? requested : stepState.maxReached;
    if (window.location.hash !== `#paso-${stepState.current}`) {
      window.location.hash = `paso-${stepState.current}`;
    }
    showRequestedStep(stepState.current);
  };

  /* ── RESET / CLEAR FLOW ─────────────────────────────────── */
  const resetFlow = () => {
    const hasProgress = stepState.maxReached > 1 || STORAGE_KEYS.some((key) => safeStorage.get(key));
    if (hasProgress && !window.confirm('¿Quieres borrar el progreso actual y volver al paso 1?')) return;

    STORAGE_KEYS.forEach((key) => safeStorage.remove(key));

    els.briefForm?.reset();
    state.query = '';
    state.category = '';
    state.style = '';
    state.sort = 'score';
    state.visible = INITIAL_VISIBLE;
    state.selected = models[0] || null;
    state.brief = {};
    skinState.query = '';
    skinState.category = '';

    if (els.searchInput) els.searchInput.value = '';
    if (els.categoryFilter) els.categoryFilter.value = '';
    if (els.styleFilter) els.styleFilter.value = '';
    if (els.sortFilter) els.sortFilter.value = 'score';
    if (els.skinSearch) els.skinSearch.value = '';
    if (els.intensityVal) els.intensityVal.value = els.intensity?.value || 8;
    if (els.briefError) els.briefError.classList.remove('visible');

    stepState.current = 1;
    stepState.maxReached = 1;
    applySkin(DEFAULT_SKIN);
    setPreviewMode('desktop');
    renderGrid();
    renderSelected();
    renderRecommended();

    if (window.location.hash !== '#paso-1') window.location.hash = 'paso-1';
    showStep(1);
    toast('Progreso limpiado. Vuelves al paso 1.');
  };

  /* ── EVENTS ─────────────────────────────────────────────── */
  const initEvents = () => {
    document.addEventListener('click', (e) => {
      const resetBtn = e.target.closest('[data-reset-flow]');
      if (resetBtn) { resetFlow(); return; }

      const presetBtn = e.target.closest('[data-preset]');
      if (presetBtn) applyQuickPreset(presetBtn.dataset.preset);
    });

    // Skin gallery (paso 3): clic delegado + búsqueda + filtro por categoría
    els.skinGallery?.addEventListener('click', (e) => {
      const btn = e.target.closest('.skin-btn');
      if (btn) applySkin(btn.dataset.skin);
    });
    els.skinSearch?.addEventListener('input', (e) => {
      skinState.query = e.target.value;
      renderSkinGallery();
    });
    els.skinChips?.addEventListener('click', (e) => {
      const chip = e.target.closest('.skin-chip');
      if (!chip) return;
      skinState.category = chip.dataset.cat || '';
      renderSkinGallery();
    });

    // Intensity range → output en tiempo real (FIX: sin output visible antes)
    els.intensity.addEventListener('input', () => {
      if (els.intensityVal) els.intensityVal.value = els.intensity.value;
      renderSelected();
    });
    els.intensity.addEventListener('change', () => {
      if (els.intensityVal) els.intensityVal.value = els.intensity.value;
    });

    // Grid clicks
    els.grid.addEventListener('click', (e) => {
      const card = e.target.closest('.model-card');
      if (card) selectModel(card.dataset.id);
    });
    els.recommendedGrid?.addEventListener('click', (e) => {
      const card = e.target.closest('.model-card');
      if (card) selectModel(card.dataset.id);
    });

    // Search / filters
    els.searchInput.addEventListener('input', (e) => {
      state.query = e.target.value;
      state.visible = INITIAL_VISIBLE;
      renderGrid();
    });
    els.categoryFilter.addEventListener('change', (e) => {
      state.category = e.target.value;
      state.visible = INITIAL_VISIBLE;
      renderGrid();
    });
    els.styleFilter.addEventListener('change', (e) => {
      state.style = e.target.value;
      state.visible = INITIAL_VISIBLE;
      renderGrid();
    });
    els.sortFilter.addEventListener('change', (e) => {
      state.sort = e.target.value;
      state.visible = INITIAL_VISIBLE;
      renderGrid();
    });
    els.loadMore.addEventListener('click', () => {
      state.visible += LOAD_STEP;
      renderGrid();
    });

    // Brief
    els.applyBrief.addEventListener('click', () => {
      renderSelected();
      renderRecommended();
      toast('Brief aplicado al preview.');
    });
    ['brandName', 'offer', 'audience', 'mainCta', 'tone'].forEach((id) => {
      const el = $(`#${id}`);
      if (!el) return;
      el.addEventListener('input', renderSelected);
      el.addEventListener('change', renderSelected);
    });

    // Hero buttons
    els.generateFromInputs.addEventListener('click', () => {
      if (!validateBrief()) { goToStep(1); toast('Completa el brief antes de generar.'); return; }
      renderSelected();
      renderRecommended();
      unlockStep(2);
      unlockStep(3);
      goToStep(3);
    });
    els.scrollCatalog.addEventListener('click', () => {
      if (!validateBrief()) { goToStep(1); toast('Completa el brief antes de explorar el catálogo.'); return; }
      unlockStep(2);
      goToStep(2);
    });
    els.randomBtn.addEventListener('click', () => {
      const pool = getFiltered().length ? getFiltered() : models;
      if (!pool.length) return;
      selectModel(pool[Math.floor(Math.random() * pool.length)].id);
    });

    // Export / copy
    els.copyPrompt.addEventListener('click', () => copyText(buildPrompt(), 'Prompt profesional'));
    els.copyHtml.addEventListener('click', () => copyText(buildExportHtml(), 'HTML'));
    els.downloadHtml.addEventListener('click', () => {
      downloadText(`${slugify(getBrief().brandName)}-landing.html`, buildExportHtml(), 'text/html;charset=utf-8');
      toast('HTML descargado.');
    });
    els.downloadJson.addEventListener('click', () => {
      const payload = JSON.stringify({
        model: state.selected,
        brief: getBrief(),
        blueprint: buildBlueprintData(state.selected, getBrief()),
        generatedAt: new Date().toISOString()
      }, null, 2);
      downloadText(`${slugify(getBrief().brandName)}-modelo.json`, payload, 'application/json;charset=utf-8');
      toast('JSON descargado.');
    });
    els.copyBlueprint.addEventListener('click', () => copyText(buildMarkdownKit(), 'Propuesta comercial'));
    els.downloadKit.addEventListener('click', () => {
      downloadText(`${slugify(getBrief().brandName)}-kit-comercial.md`, buildMarkdownKit(), 'text/markdown;charset=utf-8');
      toast('Kit Markdown descargado.');
    });
    els.copyChecklist.addEventListener('click', () => copyText(buildQaChecklistText(), 'Checklist QA'));

    // Preview device
    els.desktopPreview.addEventListener('click', () => setPreviewMode('desktop'));
    els.mobilePreview.addEventListener('click',  () => setPreviewMode('mobile'));
  };

  /* ── RESTORE STATE ──────────────────────────────────────── */
  const restoreState = () => {
    const savedId   = safeStorage.get('404-web-architect-selected');
    const savedModel = models.find((m) => m.id === savedId);
    if (savedModel) state.selected = savedModel;

    const savedSkin = safeStorage.get('404-web-architect-skin');
    applySkin(SKINS.some((s) => s.id === savedSkin) ? savedSkin : DEFAULT_SKIN);

    restoreBrief();
    if (els.intensityVal) els.intensityVal.value = els.intensity?.value || 8;
    setPreviewMode('desktop');
  };

  /* ── INIT ───────────────────────────────────────────────── */
  const init = () => {
    readElements();
    if (!models.length) {
      document.body.innerHTML = '<main style="padding:2rem;font-family:sans-serif"><h1>No se han cargado modelos.</h1><p>Comprueba que models.js existe junto a index.html.</p></main>';
      return;
    }
    fillFilters();
    initEvents();
    restoreState();
    renderGrid();
    renderSelected();
    renderRecommended();
    initStepper();
  };

  document.addEventListener('DOMContentLoaded', init, { once: true });
})();
