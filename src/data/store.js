// ============================================================
//  STORE — data.json ↔ localStorage bridge
// ============================================================
//
//  TWO JOBS:
//
//  1. LOAD  — Store.init()
//     Fetches data.json on every page load. If the file contains
//     a non-empty tile array for the current breakpoint, the app
//     renders from it directly (the "JSON-first" path). Meta fields
//     (lang, avatar, text overrides) are also seeded into
//     localStorage so the rest of the app can read them normally.
//
//  2. SAVE  — Store.exportJson()
//     Builds a complete snapshot of the current portfolio state by
//     calling window.resolveTiles() for both breakpoints and reading
//     all meta from localStorage. Downloads the result as data.json.
//
//  WORKFLOW:
//     Edit → click Export → commit data.json to GitHub → deploy.
//     Any device that opens the site will fetch the new file and
//     render your latest layout immediately.
//
//  FALLBACK:
//     If data.json is missing, unreachable, empty, or malformed,
//     init() returns null and the app renders from localStorage +
//     CONFIG exactly as it always has. Nothing breaks.
// ============================================================

(function () {

  // ── localStorage key map ─────────────────────────────────────
  const LS = {
    customTiles:   'portfolio_custom_tiles',
    hiddenTiles:   'portfolio_hidden_tiles',
    layoutDesktop: 'portfolio_layout_desktop',
    layoutMobile:  'portfolio_layout_mobile',
    sizesDesktop:  'portfolio_sizes_desktop',
    sizesMobile:   'portfolio_sizes_mobile',
    overridesNo:   'portfolio_overrides_no',
    overridesEn:   'portfolio_overrides_en',
    avatar:        'portfolio_avatar',
    lang:          'portfolio_lang',
  };

  // ── Seed a localStorage key only when it is currently absent ─
  function seedIfEmpty(key, value) {
    if (localStorage.getItem(key) === null && value !== null && value !== undefined) {
      localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    }
  }

  // ── Apply meta fields from data.json into localStorage ───────
  // Only seeds keys that are not already set on this device.
  function seedMeta(json) {
    if (json.lang)   seedIfEmpty(LS.lang,   json.lang);
    if (json.avatar) seedIfEmpty(LS.avatar, json.avatar);

    const ov = json.overrides || {};
    if (ov.no && Object.keys(ov.no).length) seedIfEmpty(LS.overridesNo, ov.no);
    if (ov.en && Object.keys(ov.en).length) seedIfEmpty(LS.overridesEn, ov.en);
  }

  // ── Store.init() ──────────────────────────────────────────────
  // Fetches data.json. Seeds localStorage meta from it.
  // Returns the parsed JSON object so the caller can use
  // json.layout.desktop / json.layout.mobile directly, or null if
  // the file is empty / unreachable.
  async function init() {
    let json;
    try {
      const res = await fetch('./data.json?_cb=' + Date.now());
      if (!res.ok) return null;
      json = await res.json();
    } catch {
      return null; // missing, network error, or malformed JSON
    }

    // Seed meta fields into localStorage for the rest of the app
    seedMeta(json);

    // Return the raw JSON — the caller decides whether to use the
    // tile arrays or fall back to applyLayout().
    return json;
  }

  // ── Store.exportJson() ────────────────────────────────────────
  // Builds a complete, self-contained snapshot of the current
  // portfolio by calling window.resolveTiles() for both breakpoints.
  // The exported file can be committed to GitHub and the site will
  // load from it on every device.
  function exportJson() {
    if (typeof window.resolveTiles !== 'function') {
      console.error('[Store] window.resolveTiles not available yet');
      return;
    }

    function parse(key, fallback) {
      try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
      catch { return fallback; }
    }

    const snapshot = {
      version: 1,
      _note: "Portfolio saved state. In Edit Mode click 'Export', then commit this file to GitHub to sync across all devices.",
      lang:   localStorage.getItem(LS.lang)   || null,
      avatar: localStorage.getItem(LS.avatar) || null,
      overrides: {
        no: parse(LS.overridesNo, {}),
        en: parse(LS.overridesEn, {}),
      },
      // Full, ordered tile objects for each breakpoint.
      // Feed layout[breakpoint] directly into buildGrid() on load.
      layout: {
        desktop: window.resolveTiles('desktop'),
        mobile:  window.resolveTiles('mobile'),
      },
    };

    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement('a'), { href: url, download: 'data.json' });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (window.I18N?.showToast) {
      I18N.showToast('data.json downloaded — commit it to GitHub to sync everywhere');
    }
  }

  // ── Public API ────────────────────────────────────────────────
  window.Store = { init, exportJson };

})();
