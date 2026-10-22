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
    accent:        'portfolio_accent',
  };

  // ── What init() loaded, and from where ('kv' | 'file') ───────
  let loaded = null;
  let source = null;
  let synced = false;

  // Copy of the last loaded content, so returning visitors see the
  // page at once while the fresh version loads in the background
  const CACHE_KEY = 'portfolio_content_cache';

  // ── Seed a localStorage key only when it is currently absent ─
  function seedIfEmpty(key, value) {
    if (localStorage.getItem(key) === null && value !== null && value !== undefined) {
      localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    }
  }

  // ── Apply meta fields from the content into localStorage ─────
  // Visitors always get the saved texts and photo from KV. On /admin,
  // or while KV is still empty (content from data.json), existing
  // local edits are kept and keys are only seeded when absent.
  // The language stays the visitor's own choice.
  function seedMeta(json, from) {
    if (json.lang) seedIfEmpty(LS.lang, json.lang);

    const ov = json.overrides || {};
    if (from === 'kv' && !window.I18N?.isAdminPage?.()) {
      if (json.avatar) localStorage.setItem(LS.avatar, json.avatar);
      else             localStorage.removeItem(LS.avatar);
      localStorage.setItem(LS.overridesNo, JSON.stringify(ov.no || {}));
      localStorage.setItem(LS.overridesEn, JSON.stringify(ov.en || {}));
      return;
    }

    if (json.avatar) seedIfEmpty(LS.avatar, json.avatar);
    if (ov.no && Object.keys(ov.no).length) seedIfEmpty(LS.overridesNo, ov.no);
    if (ov.en && Object.keys(ov.en).length) seedIfEmpty(LS.overridesEn, ov.en);
  }

  // ── Store.useCached() ─────────────────────────────────────────
  // Loads the copy saved on the last visit (if any) as the current
  // content and returns it, or null. Store.init() replaces it.
  function useCached() {
    let copy = null;
    try { copy = JSON.parse(localStorage.getItem(CACHE_KEY)); } catch {}
    if (!copy || !copy.json || !copy.source) return null;
    loaded = copy.json;
    source = copy.source;
    seedMeta(loaded, source);
    return loaded;
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
  // Seeds localStorage meta from the result and keeps a copy for
  // the next visit (see useCached).
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
    if (!json) return null; // keep any cached copy already in use
    loaded = json;

    // Seed meta fields into localStorage for the rest of the app
    seedMeta(json, source);

    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ source, json })); }
    catch {} // full storage: just no copy for next time

    // Return the raw JSON — the caller decides whether to use the
    // tile arrays or fall back to applyLayout().
    return json;
  }

  // ── Store.savedLayout(name) ───────────────────────────────────
  // The saved tile array for a breakpoint ('desktop' | 'mobile'),
  // from KV or data.json, or null if there is none.
  function savedLayout(name) {
    const tiles = loaded?.layout?.[name];
    return Array.isArray(tiles) && tiles.length ? tiles : null;
  }

  // ── Store.savedAccent() ───────────────────────────────────────
  // The saved accent colour (KV or data.json), or null.
  function savedAccent() {
    return loaded?.accent || null;
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
    if (loaded.accent) localStorage.setItem(LS.accent, loaded.accent);
    else               localStorage.removeItem(LS.accent);
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
      accent: window.Accent?.normalize(localStorage.getItem(LS.accent)) || null,
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
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ source, json: snapshot })); } catch {}
    toast('Lagret! Alle besøkende ser endringene nå.');
    return true;
  }

  // ── Public API ────────────────────────────────────────────────
  window.Store = { init, useCached, savedLayout, savedAccent, syncLocalFromServer, save };

})();
