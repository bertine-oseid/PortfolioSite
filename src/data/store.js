// ============================================================
//  STORE — Cloudflare KV / data.json ↔ localStorage bridge
// ============================================================
//
//  THREE JOBS:
//
//  1. LOAD  — Store.init()
//     Fetches /api/content (Cloudflare KV) on every page load, and
//     falls back to data.json if KV is empty. If the result contains
//     a non-empty tile array for the current breakpoint, the app
//     renders from it directly (the "JSON-first" path). Meta fields
//     (lang, avatar, text overrides) are also seeded into
//     localStorage so the rest of the app can read them normally.
//
//  2. SYNC  — Store.syncLocalFromServer()
//     Edit Mode works on localStorage. Before editing, this copies
//     the content saved in KV into localStorage (once per page
//     load), so an old or empty browser never overwrites newer
//     content when you click Save. Does nothing while KV is still
//     empty, so the very first save uses this browser's edits.
//
//  3. SAVE  — Store.save()
//     Builds a complete snapshot of the current portfolio state by
//     calling window.resolveTiles() for both breakpoints and reading
//     all meta from localStorage, then sends it to /api/save, which
//     stores it in KV. Every visitor sees it on their next load.
//
//  FALLBACK:
//     If both KV and data.json are missing, unreachable, empty, or
//     malformed, init() returns null and the app renders from
//     localStorage + CONFIG exactly as it always has.
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

  // ── What init() loaded, and from where ('kv' | 'file') ───────
  let loaded = null;
  let source = null;
  let synced = false;

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

  // ── Fetch a JSON url, or null on any failure ─────────────────
  async function fetchJson(url) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null; // missing, network error, or malformed JSON
    }
  }

  // ── Store.init() ──────────────────────────────────────────────
  // Fetches the saved content from KV (/api/content). If KV is
  // empty or unreachable, falls back to data.json.
  // Seeds localStorage meta from the result.
  // Returns the parsed JSON object so the caller can use
  // json.layout.desktop / json.layout.mobile directly, or null if
  // neither source has anything.
  async function init() {
    let json = await fetchJson('/api/content');
    source = json ? 'kv' : null;
    if (!json) {
      json = await fetchJson('./data.json?_cb=' + Date.now());
      source = json ? 'file' : null;
    }
    if (!json) return null;
    loaded = json;

    // Seed meta fields into localStorage for the rest of the app
    seedMeta(json);

    // Return the raw JSON — the caller decides whether to use the
    // tile arrays or fall back to applyLayout().
    return json;
  }

  // ── Store.syncLocalFromServer() ───────────────────────────────
  // Overwrites this browser's editing state with the content saved
  // in KV. Runs at most once per page load; unsaved edits from an
  // earlier visit in this browser are replaced by the saved version.
  function syncLocalFromServer() {
    if (synced || source !== 'kv' || !loaded) return;
    synced = true;

    const set = (key, value) => localStorage.setItem(key, JSON.stringify(value));
    const desktop = loaded.layout?.desktop || [];
    const mobile  = loaded.layout?.mobile  || [];

    // Tiles not defined in CONFIG are custom tiles; CONFIG tiles
    // missing from both layouts have been hidden.
    const stockIds = new Set(CONFIG.tiles.map(t => t.id));
    const custom   = {};
    const present  = new Set();
    [...desktop, ...mobile].forEach(t => {
      present.add(t.id);
      if (!stockIds.has(t.id) && !custom[t.id]) custom[t.id] = t;
    });
    set(LS.customTiles, Object.values(custom));
    set(LS.hiddenTiles, [...stockIds].filter(id => !present.has(id)));

    set(LS.layoutDesktop, desktop.map(t => t.id));
    set(LS.layoutMobile,  mobile.map(t => t.id));
    set(LS.sizesDesktop,  Object.fromEntries(desktop.map(t => [t.id, t.size])));
    set(LS.sizesMobile,   Object.fromEntries(mobile.map(t => [t.id, t.size])));

    set(LS.overridesNo, loaded.overrides?.no || {});
    set(LS.overridesEn, loaded.overrides?.en || {});
    if (loaded.avatar) localStorage.setItem(LS.avatar, loaded.avatar);
    else               localStorage.removeItem(LS.avatar);
    if (loaded.lang)   localStorage.setItem(LS.lang, loaded.lang);
  }

  // ── Build the snapshot that gets saved ────────────────────────
  function buildSnapshot() {
    function parse(key, fallback) {
      try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
      catch { return fallback; }
    }

    return {
      version: 1,
      _note: "Portfolio saved state. Saved from Edit Mode to Cloudflare KV; data.json is only the fallback.",
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
  }

  // ── Store.save() ──────────────────────────────────────────────
  // Sends the snapshot to /api/save (protected by Cloudflare
  // Access). Returns true on success. Shows a toast either way.
  async function save() {
    const toast = msg => window.I18N?.showToast && I18N.showToast(msg);

    if (typeof window.resolveTiles !== 'function') {
      console.error('[Store] window.resolveTiles not available yet');
      return false;
    }

    const snapshot = buildSnapshot();
    let res, body = {};
    try {
      res = await fetch('/api/save', {
        method:      'POST',
        headers:     { 'Content-Type': 'application/json' },
        body:        JSON.stringify(snapshot),
        credentials: 'same-origin',
      });
      body = await res.json().catch(() => ({}));
    } catch {
      toast('Kunne ikke lagre — er du logget inn? Prøv å laste siden på nytt.');
      return false;
    }

    if (!res.ok) {
      toast('Kunne ikke lagre: ' + (body.error || 'feil ' + res.status));
      return false;
    }

    // KV now holds exactly what this browser has
    loaded = snapshot;
    source = 'kv';
    synced = true;
    toast('Lagret! Alle besøkende ser endringene nå.');
    return true;
  }

  // ── Public API ────────────────────────────────────────────────
  window.Store = { init, syncLocalFromServer, save };

})();
