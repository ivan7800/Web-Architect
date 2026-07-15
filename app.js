(() => {
  'use strict';

  const models = Array.isArray(window.MODELS_404) ? window.MODELS_404 : [];
  const DEFAULT_PALETTE = ['#070A12', '#121A2A', '#7CFFCB', '#E8F1FF'];
  const INITIAL_VISIBLE = 16;
  const LOAD_STEP = 20;
  const SANS  = "'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif";
  const SERIF = "Georgia, 'Iowan Old Style', 'Times New Roman', serif";
  const MONO  = "'SFMono-Regular', ui-monospace, 'SF Mono', 'Courier New', monospace";

  /* El tema del estudio y el diseño exportado son sistemas separados.
     Los temas proceden del U404 Style Kit; las SKINS de abajo pertenecen
     exclusivamente a la web que el usuario está construyendo. */
  const APP_THEMES = {
    santuario: { bg:'#0F141F', bg2:'#161D2C', text:'#EDE7DA', brand:'#D8A85F', brand2:'#8FA68E', btn:'#1C1508' },
    bosque:    { bg:'#0E1512', bg2:'#15211B', text:'#E4EDE2', brand:'#A4C89A', brand2:'#D8C08A', btn:'#101A0D' },
    oceano:    { bg:'#0A131C', bg2:'#0F1E2C', text:'#E0EBF2', brand:'#8FC3D9', brand2:'#C9B98A', btn:'#0A1820' },
    luna:      { bg:'#111318', bg2:'#1A1D25', text:'#E8EAF0', brand:'#C7CCDE', brand2:'#9BA6C4', btn:'#14161D' },
    aurora:    { bg:'#0D1220', bg2:'#131B30', text:'#E3F0EC', brand:'#8FD9C0', brand2:'#B79BE0', btn:'#0B1A15' },
    niebla:    { bg:'#171A1D', bg2:'#20242A', text:'#E6E9EC', brand:'#B9C4CC', brand2:'#8FA0A8', btn:'#171B1F' },
    piedra:    { bg:'#15130F', bg2:'#1F1C16', text:'#EAE3D4', brand:'#C7B79A', brand2:'#8FA68E', btn:'#181307' },
    ambar:     { bg:'#171009', bg2:'#22180D', text:'#F2E6D2', brand:'#E4B36A', brand2:'#C88A5A', btn:'#1D1204' },
    obsidiana: { bg:'#0A0B0E', bg2:'#111319', text:'#E4E6EE', brand:'#A8B0CE', brand2:'#7C849E', btn:'#0E1016' },
    oro:       { bg:'#131108', bg2:'#1D1A0E', text:'#F1E9D2', brand:'#E8CB78', brand2:'#B9A25E', btn:'#1B1504' }
  };

  const ARCHITECTURES = [
    { id:'conversion', name:'Conversión premium', description:'Hero dominante, prueba rápida, beneficios, proceso, FAQ y CTA final.', columns:3, hero:'center', fit:['saas','startup','fintech','producto','marketing'] },
    { id:'split', name:'Producto en split', description:'Mensaje y CTA a la izquierda con escenario visual o producto a la derecha.', columns:3, hero:'split', fit:['app','software','tecnologia','ia'] },
    { id:'editorial', name:'Editorial de autor', description:'Ritmo de revista, tipografía protagonista y lectura pausada para obras y autores.', columns:2, hero:'editorial', fit:['autor','libro','editorial','kdp','cultura'] },
    { id:'portfolio', name:'Portfolio inmersivo', description:'Presentación personal y mosaico de proyectos con foco visual.', columns:2, hero:'minimal', fit:['portfolio','fotografia','arte','arquitectura','creativo'] },
    { id:'dashboard', name:'Dashboard de producto', description:'Barra lateral, métricas y módulos para herramientas y paneles profesionales.', columns:3, hero:'dashboard', fit:['dashboard','analitica','admin','finanzas'] },
    { id:'catalog', name:'Catálogo comercial', description:'Colección de productos o servicios con filtros visuales y llamadas de compra.', columns:4, hero:'compact', fit:['tienda','ecommerce','catalogo','moda'] },
    { id:'cinematic', name:'Cinematográfica', description:'Hero a pantalla completa y bloques narrativos de alto impacto.', columns:2, hero:'cinematic', fit:['gaming','horror','cine','musica','entretenimiento'] },
    { id:'magazine', name:'Magazine visual', description:'Historia destacada, contenidos secundarios y jerarquía editorial multicolumna.', columns:3, hero:'magazine', fit:['revista','noticias','blog','media'] },
    { id:'event', name:'Evento y agenda', description:'Fecha, propuesta, ponentes, programación y registro siempre visibles.', columns:3, hero:'event', fit:['evento','festival','conferencia','curso'] },
    { id:'hospitality', name:'Hospitality y reservas', description:'Imagen aspiracional, disponibilidad, servicios y confianza para reservar.', columns:3, hero:'hospitality', fit:['hotel','restaurante','viajes','turismo','inmobiliaria'] },
    { id:'docs', name:'Documentación técnica', description:'Navegación lateral, contenido legible y bloques técnicos escaneables.', columns:1, hero:'docs', fit:['documentacion','developer','api','soporte'] },
    { id:'community', name:'Comunidad y membresía', description:'Impacto colectivo, actividad, ventajas y acceso a la comunidad.', columns:3, hero:'community', fit:['comunidad','foro','social','membresia'] }
  ];

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
    skin: 'dark',
    appTheme: 'oro',
    architecture: 'conversion',
    sections: []
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const safeStorage = {
    get(key) {
      try { return window.localStorage.getItem(key); } catch { return null; }
    },
    set(key, value) {
      try { window.localStorage.setItem(key, value); } catch { /* storage bloqueado */ }
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
      appTheme:         $('#appTheme'),
      architectureSelect: $('#architectureSelect'),
      architectureDescription: $('#architectureDescription'),
      sectionEditor:    $('#sectionEditor'),
      sectionCount:     $('#sectionCount'),
      addSection:       $('#addSection'),
      saveProject:      $('#saveProject'),
      importProject:    $('#importProject'),
      resetProject:     $('#resetProject'),
      projectFile:      $('#projectFile'),
      downloadZip:      $('#downloadZip'),
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

  /* ── TEMA DEL ESTUDIO U404 ────────────────────────────── */
  const applyAppTheme = (id) => {
    const theme = APP_THEMES[id] || APP_THEMES.oro;
    state.appTheme = APP_THEMES[id] ? id : 'oro';
    const root = document.documentElement;
    root.dataset.u404Skin = state.appTheme;
    root.style.setProperty('--bg', theme.bg);
    root.style.setProperty('--bg2', theme.bg2);
    root.style.setProperty('--text', theme.text);
    root.style.setProperty('--brand', theme.brand);
    root.style.setProperty('--brand-2', theme.brand2);
    root.style.setProperty('--brand-btn-text', theme.btn);
    root.style.setProperty('--radius', '20px');
    root.style.setProperty('--font-title', "Georgia, 'Iowan Old Style', 'Times New Roman', serif");
    root.style.setProperty('--font-body', SANS);
    root.style.setProperty('--heading-tracking', '-0.045em');
    root.style.setProperty('--eyebrow-transform', 'uppercase');
    root.style.setProperty('--eyebrow-tracking', '.22em');
    root.style.setProperty('color-scheme', 'dark');
    if (els.appTheme) els.appTheme.value = state.appTheme;
    safeStorage.set('404-web-architect-app-theme', state.appTheme);
  };

  /* ── ARQUITECTURAS Y EDITOR DE SECCIONES ─────────────── */
  const getArchitecture = () => ARCHITECTURES.find((a) => a.id === state.architecture) || ARCHITECTURES[0];

  const recommendArchitecture = (model = state.selected) => {
    const haystack = normalizeText(`${model?.category || ''} ${model?.title || ''} ${model?.purpose || ''}`);
    return ARCHITECTURES.find((arch) => arch.fit.some((term) => haystack.includes(normalizeText(term)))) || ARCHITECTURES[0];
  };

  const makeSection = (title, index = 0) => ({
    id: `sec-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`,
    title: String(title || `Sección ${index + 1}`).slice(0, 80),
    enabled: true
  });

  const resetSectionsFromModel = (model = state.selected) => {
    state.sections = (Array.isArray(model?.sections) ? model.sections : ['Beneficios', 'Proceso', 'FAQ', 'Contacto'])
      .map((title, index) => makeSection(title, index));
  };

  const getActiveSections = () => state.sections.filter((section) => section.enabled && section.title.trim());

  const fillArchitectures = () => {
    if (!els.architectureSelect) return;
    els.architectureSelect.innerHTML = ARCHITECTURES.map((arch) =>
      `<option value="${arch.id}">${escapeHtml(arch.name)}</option>`
    ).join('');
  };

  const renderSectionEditor = () => {
    if (!els.sectionEditor) return;
    const active = getActiveSections().length;
    els.sectionCount.textContent = `${active} ${active === 1 ? 'sección activa' : 'secciones activas'}`;
    els.sectionEditor.innerHTML = state.sections.map((section, index) => `
      <div class="section-editor-row" data-section-id="${escapeHtml(section.id)}">
        <span class="section-handle" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
        <input class="section-title-input" type="text" maxlength="80" value="${escapeHtml(section.title)}" aria-label="Nombre de la sección ${index + 1}">
        <label class="visibility-toggle" title="Mostrar u ocultar sección">
          <input class="section-enabled" type="checkbox" ${section.enabled ? 'checked' : ''}>
          <span>${section.enabled ? 'Visible' : 'Oculta'}</span>
        </label>
        <div class="section-row-actions">
          <button type="button" data-action="up" aria-label="Subir sección" ${index === 0 ? 'disabled' : ''}>↑</button>
          <button type="button" data-action="down" aria-label="Bajar sección" ${index === state.sections.length - 1 ? 'disabled' : ''}>↓</button>
          <button type="button" data-action="delete" aria-label="Eliminar sección">×</button>
        </div>
      </div>`).join('') || '<p class="empty">No hay secciones. Añade una para construir la página.</p>';
  };

  const renderArchitectureControls = () => {
    const arch = getArchitecture();
    if (els.architectureSelect) els.architectureSelect.value = arch.id;
    if (els.architectureDescription) els.architectureDescription.textContent = arch.description;
    renderSectionEditor();
  };

  /* ── SKINS DE LA WEB GENERADA ───────────────────────────── */
  const skinState = { query: '', category: '' };

  const findSkin = (id) => SKINS.find((s) => s.id === id) || SKINS[0];

  const applySkin = (id) => {
    const skin = findSkin(id);
    state.skin = skin.id;
    document.documentElement.setAttribute('data-skin', skin.id);
    safeStorage.set('404-web-architect-skin', skin.id);
    renderSkinGallery();
    if (els.sitePreview && state.selected) renderSelected();
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


  const cardTemplate = (model, index = 0) => {
    const color = safeColor(model.palette?.[2]);
    const isSel = state.selected?.id === model.id;
    const stagger = Math.min(Number(index) || 0, 12);
    return `
      <button class="model-card${isSel ? ' selected' : ''}" type="button"
        data-id="${escapeHtml(model.id)}"
        aria-pressed="${isSel}"
        style="--c1:${color}22;--i:${stagger}">
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
    const topSections = (getActiveSections().length ? getActiveSections().map((section) => section.title) : model.sections).slice(0, 12);
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
    const html = buildExportHtml();
    const sections = getActiveSections();
    const palette = getOutputPalette();
    const contrast = contrastRatio(palette[0], palette[3]);
    const checks = [
      ['Arquitectura', sections.length >= 4, `${getArchitecture().name}: ${sections.length} secciones activas y jerarquía diferenciada.`],
      ['Contenido', brief.brandName.length >= 3 && brief.offer.length >= 20, 'Marca, propuesta, público y CTA tienen contenido suficiente.'],
      ['Accesibilidad', html.includes('<h1>') && html.includes('aria-label=') && contrast >= 4.5, `HTML semántico y contraste estimado ${contrast.toFixed(1)}:1.`],
      ['UX móvil', html.includes('@media(max-width:760px)'), 'Grid, navegación y hero incluyen adaptación a móvil.'],
      ['Seguridad', !/<script[^>]*src=/i.test(html) && !/javascript:/i.test(html), 'Salida autónoma, escapada y sin scripts ni llamadas externas.'],
      ['SEO', html.includes('<meta name="description"') && html.includes('<title>'), 'Título, descripción, idioma y viewport presentes.'],
      ['GitHub Pages', html.startsWith('<!doctype html>'), 'Documento estático válido y exportación ZIP con README y proyecto fuente.']
    ];
    const passed = checks.filter(([, ok]) => ok).length;
    const grade = (7.5 + (passed / checks.length) * 2.5).toFixed(1);
    els.auditGrade.textContent = `${grade}/10`;
    const score100 = Math.round(Number(grade) * 10);
    els.heroScore.textContent = String(score100);
    els.heroScore.style.setProperty('--score', String(score100));
    els.auditList.innerHTML = checks.map(([title, ok, text]) => `
      <article class="audit-item ${ok ? 'audit-ok' : 'audit-warning'}">
        <span class="audit-dot" aria-hidden="true"></span>
        <div><strong>${escapeHtml(title)}</strong><p>${escapeHtml(text)}</p></div>
        <span class="badge">${ok ? 'ok' : 'mejorar'}</span>
      </article>`).join('');
  };

  const hexToRgb = (hex) => {
    const clean = safeColor(hex).slice(1);
    return [0, 2, 4].map((i) => parseInt(clean.slice(i, i + 2), 16));
  };

  const contrastRatio = (a, b) => {
    const luminance = (hex) => {
      const rgb = hexToRgb(hex).map((v) => {
        const c = v / 255;
        return c <= .03928 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4;
      });
      return .2126 * rgb[0] + .7152 * rgb[1] + .0722 * rgb[2];
    };
    const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (high + .05) / (low + .05);
  };

  const getOutputPalette = () => {
    const skin = findSkin(state.skin);
    return [skin.bg, skin.bg2, skin.brand, skin.text].map((c, i) => safeColor(c, DEFAULT_PALETTE[i]));
  };

  const architectureVisual = (arch) => {
    const labels = {
      dashboard:'Datos en tiempo real', catalog:'Colección destacada', event:'Próxima sesión · 20:00',
      hospitality:'Disponibilidad inmediata', docs:'Guía de inicio', community:'12.4K miembros',
      editorial:'Edición seleccionada', portfolio:'Proyecto destacado', cinematic:'Una experiencia inmersiva',
      magazine:'Historia principal', split:'Vista del producto', conversion:'Resultado medible'
    };
    return `<aside class="site-visual" aria-label="${escapeHtml(labels[arch.id] || 'Vista destacada')}">
      <span class="visual-kicker">${escapeHtml(arch.name)}</span>
      <strong>${escapeHtml(labels[arch.id] || 'Vista destacada')}</strong>
      <div class="visual-lines"><i></i><i></i><i></i></div>
    </aside>`;
  };

  /* ── RENDER SELECTED ────────────────────────────────────── */
  const renderSelected = (syncControls = true) => {
    const model = state.selected;
    if (!model) return;
    const brief = getBrief();
    state.brief = brief;
    saveBrief();

    const palette = getOutputPalette();
    const arch = getArchitecture();
    const sections = getActiveSections();

    els.selectedSummary.innerHTML = `
      <h3>${escapeHtml(model.title)}</h3>
      <p><strong>Objetivo:</strong> ${escapeHtml(model.purpose)}</p>
      <p><strong>Arquitectura:</strong> ${escapeHtml(arch.name)} · <strong>Skin:</strong> ${escapeHtml(findSkin(state.skin).name)}</p>
      <div class="meta-row">
        ${sections.slice(0, 6).map((s) => `<span class="badge">${escapeHtml(s.title)}</span>`).join('')}
      </div>`;

    els.sitePreview.style.setProperty('--preview-bg',   palette[0]);
    els.sitePreview.style.setProperty('--preview-text', palette[3]);
    els.sitePreview.style.setProperty('--accent',       palette[2]);
    els.sitePreview.style.setProperty('--accent-soft',  withAlpha(palette[2], '33'));

    els.sitePreview.className = `site-preview arch-${arch.id}`;
    els.sitePreview.innerHTML = `
      <section class="site-hero">
        <nav class="site-nav" aria-label="Preview navegación">
          <span class="site-logo">${escapeHtml(brief.brandName)}</span>
          <span class="site-nav-links">
            ${sections.slice(0, 3).map((section) => `<span>${escapeHtml(section.title)}</span>`).join('')}<span>Contacto</span>
          </span>
        </nav>
        <div class="site-hero-grid">
          <div class="site-hero-copy">
            <p class="eyebrow">${escapeHtml(model.category)} · ${escapeHtml(model.style)}</p>
            <h2>${escapeHtml(buildHeadline(model, brief))}</h2>
            <p>${escapeHtml(previewCopy(model, brief))}</p>
            <a href="#contacto-preview" class="site-cta">${escapeHtml(brief.mainCta || model.cta)}</a>
          </div>
          ${architectureVisual(arch)}
        </div>
      </section>
      <section class="site-sections" aria-label="Secciones propuestas">
        ${sections.map((sec, i) => `
          <article class="site-section-card">
            <strong>${String(i + 1).padStart(2, '0')} · ${escapeHtml(sec.title)}</strong>
            <span>${escapeHtml(sectionDescription(sec.title, model, brief))}</span>
          </article>`).join('')}
      </section>
      <footer class="site-footer" id="contacto-preview">
        <span>${escapeHtml(model.layout)} · ${escapeHtml(model.font)}</span>
        <span>${escapeHtml(model.cta)}</span>
      </footer>`;

    renderBlueprint(model, brief);
    renderAudit(model, brief);
    if (syncControls) renderArchitectureControls();
    renderGrid();
  };

  /* ── EXPORT HTML ────────────────────────────────────────── */
  const buildExportBody = (arch, model, brief, cards, proofItems) => {
    const nav = `<header class="wrap nav"><strong class="logo">${escapeHtml(brief.brandName)}</strong><nav aria-label="Principal"><a href="#contenido">Explorar</a><a href="#contacto">Contacto</a></nav></header>`;
    const hero = `<section class="hero wrap"><div class="hero-copy"><p class="eyebrow">${escapeHtml(arch.name)} · ${escapeHtml(model.style)}</p><h1>${escapeHtml(buildHeadline(model, brief))}</h1><p>${escapeHtml(previewCopy(model, brief))}</p><a class="cta" href="#contacto">${escapeHtml(brief.mainCta || model.cta)}</a></div><aside class="hero-art" aria-label="Escenario visual"><span>${escapeHtml(model.category)}</span><strong>${escapeHtml(model.signature)}</strong><i></i><i></i><i></i></aside></section>`;
    const proof = `<section class="wrap proof" aria-label="Indicadores clave">${proofItems}</section>`;
    const grid = `<section class="wrap grid" id="contenido" aria-label="Secciones de la página">${cards}</section>`;

    if (arch.id === 'dashboard') return `${nav}<main class="dashboard-shell"><aside class="side-nav" aria-label="Módulos"><strong>Control Center</strong><span>Resumen</span><span>Actividad</span><span>Informes</span></aside><div>${hero}<section class="wrap metric-grid">${proofItems}</section>${grid}</div></main>`;
    if (arch.id === 'docs') return `${nav}<main class="wrap docs-shell"><aside class="docs-nav" aria-label="Documentación"><strong>Contenido</strong>${getActiveSections().map((s) => `<span>${escapeHtml(s.title)}</span>`).join('')}</aside><article>${hero}<div id="contenido" class="docs-content">${cards}</div></article></main>`;
    if (arch.id === 'magazine') return `${nav}<main>${hero}<section class="wrap magazine-lead" id="contenido"><article><p class="eyebrow">Historia destacada</p><h2>${escapeHtml(brief.offer)}</h2><p>${escapeHtml(brief.audience)}</p></article><aside>${proofItems}</aside></section>${grid}</main>`;
    if (arch.id === 'event') return `${nav}<main>${hero}<section class="wrap action-bar"><strong>Próxima sesión</strong><span>Acceso · Agenda · Ponentes</span><a class="cta" href="#contacto">Reservar plaza</a></section>${grid}${proof}</main>`;
    if (arch.id === 'hospitality') return `${nav}<main>${hero}<form class="wrap booking-bar" aria-label="Consulta de disponibilidad"><label>Llegada<input type="date"></label><label>Salida<input type="date"></label><label>Personas<select><option>2 personas</option></select></label><button class="cta" type="button">Consultar</button></form>${grid}${proof}</main>`;
    if (arch.id === 'catalog') return `${nav}<main>${hero}<section class="wrap catalog-tools" aria-label="Filtros"><strong>Colección</strong><span>Destacados</span><span>Novedades</span><span>Selección</span></section>${grid}${proof}</main>`;
    if (arch.id === 'editorial') return `${nav}<main class="editorial-main">${hero}<section class="wrap editorial-intro" id="contenido"><p class="eyebrow">Edición seleccionada</p><h2>${escapeHtml(brief.offer)}</h2></section>${grid}${proof}</main>`;
    if (arch.id === 'community') return `${nav}<main>${hero}<section class="wrap community-stats">${proofItems}<span class="pill">Comunidad activa</span></section>${grid}</main>`;
    if (arch.id === 'portfolio') return `${nav}<main>${hero}<section class="wrap portfolio-grid" id="contenido">${cards}</section>${proof}</main>`;
    if (arch.id === 'cinematic') return `${nav}<main class="cinematic-main">${hero}<section class="wrap scene-grid" id="contenido">${cards}</section>${proof}</main>`;
    return `${nav}<main>${hero}${proof}${grid}</main>`;
  };

  const buildExportHtml = () => {
    const model = state.selected;
    if (!model) return '';
    const brief = getBrief();
    const p = getOutputPalette();
    const arch = getArchitecture();
    const bp = buildBlueprintData(model, brief);
    const cards = getActiveSections().map((sec, i) => `
      <article class="card">
        <small>${String(i + 1).padStart(2, '0')}</small>
        <h2>${escapeHtml(sec.title)}</h2>
        <p>${escapeHtml(sectionDescription(sec.title, model, brief))}</p>
      </article>`).join('\n');
    const proofItems = bp.kpis.map((k) => `<span class="pill">${escapeHtml(k)}</span>`).join('');
    const body = buildExportBody(arch, model, brief, cards, proofItems);

    return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escapeHtml(brief.offer)}">
  <title>${escapeHtml(brief.brandName)} · ${escapeHtml(model.category)}</title>
  <style>
    :root{--bg:${p[0]};--panel:${p[1]};--accent:${p[2]};--text:${p[3]};--muted:color-mix(in srgb,var(--text),transparent 32%);--line:color-mix(in srgb,var(--text),transparent 86%);--cols:${arch.columns}}
    *{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;min-height:100vh;background:radial-gradient(circle at 85% 0,color-mix(in srgb,var(--accent),transparent 84%),transparent 34%),var(--bg);color:var(--text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;letter-spacing:-.02em}a{color:inherit}.wrap{width:min(1160px,calc(100% - 32px));margin-inline:auto}.nav{display:flex;justify-content:space-between;gap:20px;align-items:center;padding:22px 0}.nav nav{display:flex;gap:18px}.nav a{text-decoration:none;color:var(--muted)}.logo{font-weight:950}.hero{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(260px,.85fr);gap:clamp(24px,6vw,80px);align-items:center;padding:clamp(70px,10vw,140px) 0 70px}.eyebrow{color:var(--accent);text-transform:uppercase;letter-spacing:.16em;font-size:.75rem;font-weight:850}.hero h1{max-width:900px;font-size:clamp(3rem,8vw,7rem);line-height:.9;letter-spacing:-.07em;margin:12px 0 20px}.hero p{max-width:680px;color:var(--muted);font-size:1.15rem;line-height:1.7}.hero-art{min-height:360px;padding:30px;border:1px solid var(--line);border-radius:34px;background:linear-gradient(150deg,color-mix(in srgb,var(--accent),transparent 82%),var(--panel));display:flex;flex-direction:column;justify-content:flex-end;box-shadow:0 40px 100px rgba(0,0,0,.3)}.hero-art span{color:var(--muted)}.hero-art strong{font-size:1.5rem;margin:8px 0 24px}.hero-art i{display:block;height:5px;margin-top:8px;border-radius:8px;background:var(--accent);opacity:.7}.hero-art i:nth-last-child(2){width:72%}.hero-art i:last-child{width:44%}.cta{display:inline-flex;align-items:center;justify-content:center;min-height:52px;margin-top:18px;padding:0 22px;border:0;border-radius:999px;background:var(--accent);color:var(--bg);text-decoration:none;font-weight:900}.proof,.community-stats{display:flex;flex-wrap:wrap;gap:10px;padding:10px 0 34px}.pill{display:inline-flex;border:1px solid var(--line);border-radius:999px;padding:.6rem .9rem}.grid,.portfolio-grid,.scene-grid{display:grid;grid-template-columns:repeat(var(--cols),minmax(0,1fr));gap:16px;padding:26px 0 70px}.card{min-height:210px;border:1px solid var(--line);background:color-mix(in srgb,var(--text),transparent 95%);border-radius:24px;padding:24px}.card small{color:var(--accent);font-weight:900}.card h2{font-size:1.3rem}.card p{color:var(--muted);line-height:1.65}.footer{border-top:1px solid var(--line);padding:30px 0;color:var(--muted);display:flex;justify-content:space-between;gap:18px}.side-nav,.docs-nav{border:1px solid var(--line);background:var(--panel);padding:24px;display:grid;align-content:start;gap:14px}.dashboard-shell{display:grid;grid-template-columns:220px 1fr;max-width:1440px;margin:auto}.dashboard-shell .hero{padding-top:46px}.metric-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.docs-shell{display:grid;grid-template-columns:240px 1fr;gap:38px}.docs-nav{position:sticky;top:16px;height:max-content;border-radius:20px}.docs-content{display:grid;gap:14px;padding-bottom:70px}.docs-content .card{min-height:0}.magazine-lead,.editorial-intro{display:grid;grid-template-columns:1.5fr .5fr;gap:30px;padding:38px 0;border-block:1px solid var(--line)}.action-bar,.booking-bar,.catalog-tools{display:flex;align-items:center;gap:20px;flex-wrap:wrap;padding:18px 22px;border:1px solid var(--line);border-radius:22px;background:var(--panel)}.action-bar .cta,.booking-bar .cta{margin:0 0 0 auto}.booking-bar label{display:grid;gap:5px;color:var(--muted)}.booking-bar input,.booking-bar select{min-height:42px;padding:0 10px;border:1px solid var(--line);background:var(--bg);color:var(--text);border-radius:10px}.portfolio-grid{grid-template-columns:repeat(2,1fr)}.portfolio-grid .card:nth-child(3n+1){grid-row:span 2;min-height:440px}.cinematic-main .hero{min-height:82vh}.editorial-main{font-family:Georgia,'Times New Roman',serif}body[data-architecture="catalog"] .grid{grid-template-columns:repeat(4,1fr)}body[data-architecture="catalog"] .card{border-radius:8px}body[data-architecture="split"] .hero-art{transform:rotate(2deg)}
    @media(max-width:760px){.nav,.footer{align-items:flex-start;flex-direction:column}.nav nav{flex-wrap:wrap}.hero{grid-template-columns:1fr;padding:44px 0 32px}.hero h1{font-size:clamp(2.7rem,15vw,4.8rem)}.hero-art{min-height:220px}.grid,.portfolio-grid,.scene-grid,.metric-grid{grid-template-columns:1fr}.portfolio-grid .card:nth-child(3n+1){grid-row:auto;min-height:210px}.dashboard-shell,.docs-shell{grid-template-columns:1fr}.side-nav,.docs-nav{position:static;display:flex;overflow:auto}.magazine-lead,.editorial-intro{grid-template-columns:1fr}.action-bar .cta,.booking-bar .cta{margin-left:0;width:100%}}
  </style>
</head>
<body data-architecture="${arch.id}">
  ${body}
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

  const downloadBlob = (filename, blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  /* ZIP almacenado (sin compresión) implementado localmente para mantener
     la app autosuficiente y sin dependencias de producción. */
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

  const getProjectData = () => ({
    schema: 'u404-web-architect-project',
    version: 3,
    modelId: state.selected?.id || null,
    brief: getBrief(),
    architecture: state.architecture,
    sections: state.sections.map(({ id, title, enabled }) => ({ id, title, enabled })),
    outputSkin: state.skin,
    appTheme: state.appTheme,
    updatedAt: new Date().toISOString()
  });

  const applyProjectData = (project) => {
    if (!project || typeof project !== 'object') throw new Error('Proyecto no válido');
    const model = models.find((item) => item.id === project.modelId) || state.selected || models[0];
    state.selected = model;
    state.architecture = ARCHITECTURES.some((a) => a.id === project.architecture) ? project.architecture : recommendArchitecture(model).id;
    state.sections = Array.isArray(project.sections)
      ? project.sections.slice(0, 20).map((section, index) => ({
          id: String(section.id || `import-${index}`).slice(0, 100),
          title: String(section.title || `Sección ${index + 1}`).slice(0, 80),
          enabled: section.enabled !== false
        }))
      : [];
    if (!state.sections.length) resetSectionsFromModel(model);
    const brief = project.brief && typeof project.brief === 'object' ? project.brief : {};
    ['brandName', 'offer', 'audience', 'mainCta', 'tone', 'intensity'].forEach((key) => {
      if (els[key] && brief[key] !== undefined) els[key].value = String(brief[key]).slice(0, 500);
    });
    applyAppTheme(APP_THEMES[project.appTheme] ? project.appTheme : state.appTheme);
    state.skin = SKINS.some((skin) => skin.id === project.outputSkin) ? project.outputSkin : state.skin;
    document.documentElement.dataset.skin = state.skin;
    if (els.intensityVal) els.intensityVal.value = els.intensity.value;
    renderSelected();
    renderRecommended();
  };

  const saveProjectLocal = () => {
    safeStorage.set('404-web-architect-studio-project', JSON.stringify(getProjectData()));
    toast('Proyecto guardado en este navegador.');
  };

  const buildProjectReadme = () => {
    const brief = getBrief();
    return `# ${brief.brandName}\n\nWeb generada con 404 Web Architect Studio 3.0.\n\n## Publicar en GitHub Pages\n\n1. Sube index.html a la raíz de un repositorio.\n2. Abre Settings → Pages.\n3. Elige Deploy from a branch, main y /root.\n4. Guarda los cambios.\n\n## Proyecto fuente\n\nEl archivo project.json permite volver a importar la configuración en Web Architect Studio.\n`;
  };

  const downloadGithubZip = () => {
    const project = JSON.stringify(getProjectData(), null, 2);
    const blob = createZipBlob({
      'index.html': buildExportHtml(),
      'README.md': buildProjectReadme(),
      'project.json': project,
      '.nojekyll': ''
    });
    downloadBlob(`${slugify(getBrief().brandName)}-github-pages.zip`, blob);
    toast('ZIP GitHub Pages descargado.');
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

    return `# Kit comercial · ${brief.brandName}\n\n## Modelo elegido\n\n- **Modelo:** ${model.title}\n- **Categoría:** ${model.category}\n- **Estilo:** ${model.style}\n- **Arquitectura:** ${getArchitecture().name}\n- **Skin:** ${findSkin(state.skin).name}\n- **Puntuación base:** ${model.score}/100\n\n## Veredicto\n\n${bp.verdict}\n\n## Posicionamiento\n\n${bp.positioning.map((i) => `- ${i}`).join('\n')}\n\n## Copy base\n\n${copy}\n\n## Arquitectura de información\n\n${arch}\n\n## Plan de producción\n\n${plan}\n\n## Checklist QA/release\n\n${qa}\n\n## KPIs recomendados\n\n${kpis}\n\n## Prompt maestro\n\n${buildPrompt()}\n`;
  };

  /* ── SELECT MODEL ───────────────────────────────────────── */
  const selectModel = (id) => {
    const found = models.find((m) => m.id === id);
    if (!found) return;
    state.selected = found;
    state.architecture = recommendArchitecture(found).id;
    resetSectionsFromModel(found);
    safeStorage.set('404-web-architect-selected', found.id);
    renderSelected();
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

  /* ── STEPPER GUIADO ──────────────────────────────────────
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
      return `<button type="button" class="step-pill" data-state="${st}" data-target="${s.id}" role="tab" aria-selected="${s.id === stepState.current}">${mark}<span class="step-num">${s.id}.</span> ${escapeHtml(s.label)}</button>`;
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
    if (n > stepState.maxReached) return;
    window.location.hash = `paso-${n}`;
  };

  const validateBrief = () => {
    const required = [els.brandName, els.offer, els.audience, els.mainCta];
    const ok = required.every((input) => input && input.value.trim().length > 0);
    if (els.briefError) els.briefError.classList.toggle('visible', !ok);
    return ok;
  };

  const initStepper = () => {
    window.addEventListener('hashchange', () => showStep(stepFromHash()));

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
    showStep(stepState.current);
  };

  /* ── EVENTS ─────────────────────────────────────────────── */
  const initEvents = () => {
    // Tema U404 del estudio (independiente de la skin exportada)
    els.appTheme?.addEventListener('change', (e) => {
      applyAppTheme(e.target.value);
      toast(`Tema del estudio: ${e.target.selectedOptions[0].textContent}`);
    });

    // Arquitectura y editor visual de secciones
    els.architectureSelect?.addEventListener('change', (e) => {
      state.architecture = e.target.value;
      safeStorage.set('404-web-architect-architecture', state.architecture);
      renderSelected();
      toast(`Arquitectura: ${getArchitecture().name}`);
    });
    els.addSection?.addEventListener('click', () => {
      state.sections.push(makeSection('Nueva sección', state.sections.length));
      renderSelected();
    });
    els.sectionEditor?.addEventListener('input', (e) => {
      const row = e.target.closest('[data-section-id]');
      const section = state.sections.find((item) => item.id === row?.dataset.sectionId);
      if (!section) return;
      if (e.target.matches('.section-title-input')) section.title = e.target.value.slice(0, 80);
      if (e.target.matches('.section-enabled')) section.enabled = e.target.checked;
      renderSelected(false);
      if (e.target.matches('.section-enabled')) renderSectionEditor();
    });
    els.sectionEditor?.addEventListener('click', (e) => {
      const button = e.target.closest('[data-action]');
      const row = e.target.closest('[data-section-id]');
      if (!button || !row) return;
      const index = state.sections.findIndex((item) => item.id === row.dataset.sectionId);
      if (index < 0) return;
      if (button.dataset.action === 'delete') state.sections.splice(index, 1);
      if (button.dataset.action === 'up' && index > 0) [state.sections[index - 1], state.sections[index]] = [state.sections[index], state.sections[index - 1]];
      if (button.dataset.action === 'down' && index < state.sections.length - 1) [state.sections[index + 1], state.sections[index]] = [state.sections[index], state.sections[index + 1]];
      renderSelected();
    });

    // Gestión de proyecto
    els.saveProject?.addEventListener('click', saveProjectLocal);
    els.importProject?.addEventListener('click', () => els.projectFile?.click());
    els.projectFile?.addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const project = JSON.parse(await file.text());
        applyProjectData(project);
        saveProjectLocal();
        toast('Proyecto importado correctamente.');
      } catch {
        toast('El archivo no contiene un proyecto válido.');
      } finally {
        e.target.value = '';
      }
    });
    els.resetProject?.addEventListener('click', () => {
      if (!window.confirm('¿Crear un proyecto nuevo y restablecer el editor?')) return;
      state.selected = models[0];
      state.architecture = recommendArchitecture(state.selected).id;
      resetSectionsFromModel(state.selected);
      safeStorage.set('404-web-architect-studio-project', '');
      applyAppTheme('oro');
      applySkin('dark');
      renderSelected();
      toast('Proyecto nuevo preparado.');
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
    els.downloadZip?.addEventListener('click', downloadGithubZip);
    els.downloadJson.addEventListener('click', () => {
      const payload = JSON.stringify(getProjectData(), null, 2);
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
    restoreBrief();
    try {
      const studioProject = JSON.parse(safeStorage.get('404-web-architect-studio-project') || 'null');
      if (studioProject?.schema === 'u404-web-architect-project') {
        applyProjectData(studioProject);
        setPreviewMode('desktop');
        return;
      }
    } catch { /* proyecto guardado antiguo o incompleto */ }

    const savedId   = safeStorage.get('404-web-architect-selected');
    const savedModel = models.find((m) => m.id === savedId);
    if (savedModel) state.selected = savedModel;
    state.architecture = ARCHITECTURES.some((a) => a.id === safeStorage.get('404-web-architect-architecture'))
      ? safeStorage.get('404-web-architect-architecture')
      : recommendArchitecture(state.selected).id;
    resetSectionsFromModel(state.selected);
    applyAppTheme(APP_THEMES[safeStorage.get('404-web-architect-app-theme')]
      ? safeStorage.get('404-web-architect-app-theme')
      : 'oro');
    const savedSkin = safeStorage.get('404-web-architect-skin');
    state.skin = SKINS.some((s) => s.id === savedSkin) ? savedSkin : 'dark';
    document.documentElement.dataset.skin = state.skin;
    renderSkinGallery();
    if (els.intensityVal) els.intensityVal.value = els.intensity?.value || 8;
    setPreviewMode('desktop');
  };

  /* ── INIT ───────────────────────────────────────────────── */
  /* ── CAPA DE MOVIMIENTO (progressive enhancement) ─────────
     Todo es opcional y seguro en jsdom: si falta una API o el
     usuario prefiere menos movimiento, se muestra el estado
     final sin animar. */
  const prefersReducedMotion = () => {
    try { return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true; }
    catch { return false; }
  };

  const animateCount = (el, target, duration = 1100) => {
    if (typeof requestAnimationFrame !== 'function' || prefersReducedMotion()) {
      el.textContent = String(target);
      return;
    }
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const initMotion = () => {
    // Contadores del hero
    $$('.metrics dt[data-count]').forEach((dt) => {
      const target = parseInt(dt.dataset.count, 10);
      if (Number.isFinite(target)) animateCount(dt, target);
    });

    // Revelado al hacer scroll: solo se activa si existe la API.
    if (typeof IntersectionObserver === 'function' && !prefersReducedMotion()) {
      document.documentElement.classList.add('js-anim');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      $$('.panel-head, .recommended-block, .architecture-studio, .preview-shell, .selected-summary, .footer').forEach((node) => {
        node.classList.add('reveal');
        observer.observe(node);
      });
    }

    // Botones "Volver" del asistente
    document.addEventListener('click', (event) => {
      const back = event.target.closest?.('[data-step-back]');
      if (back) goToStep(Number(back.dataset.stepBack));
    });
  };

  const init = () => {
    readElements();
    if (!models.length) {
      document.body.innerHTML = '<main style="padding:2rem;font-family:sans-serif"><h1>No se han cargado modelos.</h1><p>Comprueba que models.js existe junto a index.html.</p></main>';
      return;
    }
    fillFilters();
    fillArchitectures();
    initEvents();
    restoreState();
    renderGrid();
    renderSelected();
    renderRecommended();
    initStepper();
    initMotion();
  };

  document.addEventListener('DOMContentLoaded', init, { once: true });
})();
