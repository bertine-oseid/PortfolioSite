// ============================================================
//  I18N — language state, localStorage overrides, admin editing
// ============================================================
//
//  Public API (window.I18N):
//    I18N.activeLang()          — "no" or "en"
//    I18N.otherLang()           — the non-active language
//    I18N.setLang(lang)         — switch language + re-render
//    I18N.current()             — merged config for active lang
//    I18N.postsForLang(lang)    — blog posts for a language
//    I18N.currentPosts()        — blog posts for active lang
//    I18N.saveEdit(field, val)  — save admin edit, trigger sync dialog
//    I18N.isAdminMode()         — true when ?admin=1
// ============================================================

(function () {

  // ── Constants ─────────────────────────────────────────────
  const LANG_KEY      = 'portfolio_lang';
  const OVERRIDE_KEY  = lang => 'portfolio_overrides_' + lang;

  // ── State ─────────────────────────────────────────────────
  let _lang = localStorage.getItem(LANG_KEY) || CONFIG.defaultLang || 'no';

  // ── Override helpers ──────────────────────────────────────
  function getOverrides(lang) {
    try { return JSON.parse(localStorage.getItem(OVERRIDE_KEY(lang)) || '{}'); }
    catch (e) { return {}; }
  }

  function setOverride(lang, field, value) {
    const ov = getOverrides(lang);
    ov[field] = value;
    localStorage.setItem(OVERRIDE_KEY(lang), JSON.stringify(ov));
  }

  // ── Deep-merge a flat overrides object into the lang data ─
  // Field keys use dot-notation, e.g. "tiles.quote.content"
  function applyOverrides(data, overrides) {
    const result = JSON.parse(JSON.stringify(data)); // deep clone
    Object.entries(overrides).forEach(([key, value]) => {
      const parts = key.split('.');
      let obj = result;
      for (let i = 0; i < parts.length - 1; i++) {
        if (obj[parts[i]] === undefined) obj[parts[i]] = {};
        obj = obj[parts[i]];
      }
      obj[parts[parts.length - 1]] = value;
    });
    return result;
  }

  // ── Build merged config for a given language ──────────────
  function buildConfig(lang) {
    const base = CONFIG.languages[lang] || CONFIG.languages[CONFIG.defaultLang || 'no'];
    const overrides = getOverrides(lang);
    return applyOverrides(base, overrides);
  }

  // ── Get localized tile data ───────────────────────────────
  // Returns a tile with language-specific label/content merged in.
  function localizedTile(tile, langData) {
    const tileOverride = (langData.tiles && langData.tiles[tile.id]) || {};
    return Object.assign({}, tile, tileOverride);
  }

  // ── Public: merged config for active language ─────────────
  function current() {
    return buildConfig(_lang);
  }

  // ── Public: posts for a language ──────────────────────────
  function postsForLang(lang) {
    return BLOG_POSTS.map(post => {
      const t = post[lang] || post[CONFIG.defaultLang || 'no'] || {};
      return {
        id:      post.id,
        date:    post.date,
        tags:    post.tags,
        title:   t.title   || '',
        excerpt: t.excerpt  || '',
        body:    t.body     || '',
      };
    });
  }

  function currentPosts() {
    return postsForLang(_lang);
  }

  // ── Admin mode ────────────────────────────────────────────
  function isAdminMode() {
    return localStorage.getItem('portfolio_admin') === '1' ||
           new URLSearchParams(location.search).get('admin') === '1';
  }

  function setAdminMode(enabled) {
    localStorage.setItem('portfolio_admin', enabled ? '1' : '0');
    document.body.classList.toggle('admin-mode', enabled);
    // Cursor bubble handles the edit-mode hint — no static toast needed
  }

  // ── Save an admin edit and optionally sync to other lang ──
  // field: dot-notation key, e.g. "tagline" or "tiles.quote.content"
  function saveEdit(field, value) {
    setOverride(_lang, field, value);
    const other = otherLang();
    showSyncDialog(field, value, other);
  }

  function otherLang() {
    return _lang === 'no' ? 'en' : 'no';
  }

  // ── Language switch ───────────────────────────────────────
  function setLang(lang) {
    if (lang === _lang) return;
    _lang = lang;
    localStorage.setItem(LANG_KEY, lang);
    rerenderAll();
    updateLangToggle();
  }

  // ── Re-render everything ──────────────────────────────────
  function rerenderAll() {
    if (typeof applyLayout === 'function')  applyLayout(true);
    if (typeof buildBlogList === 'function' && document.getElementById('page-blog').classList.contains('active')) {
      buildBlogList();
    }
    // Update static strings in the DOM
    updateStaticStrings();
  }

  function updateStaticStrings() {
    const c = current();
    // Nav links
    const navHome = document.querySelector('.nav-link[data-page="grid"]');
    const navBlog = document.querySelector('.nav-link[data-page="blog"]');
    if (navHome) navHome.textContent = c.nav.home;
    if (navBlog) navBlog.textContent = c.nav.blog;
    // Back button
    const back = document.getElementById('backBtn');
    if (back) back.textContent = c.backBtn;
    // Blog page header
    const blogTitle = document.querySelector('.blog-title');
    const blogSub   = document.querySelector('.blog-subtitle');
    if (blogTitle) blogTitle.textContent = c.blogTitle;
    if (blogSub)   blogSub.textContent   = c.blogSubtitle;
    // html lang attribute
    document.documentElement.lang = _lang;
  }

  function updateLangToggle() {
    const btn = document.getElementById('langToggle');
    if (!btn) return;
    btn.querySelectorAll('.lang-opt').forEach(el => {
      el.classList.toggle('active', el.dataset.lang === _lang);
    });
  }

  // ── Sync confirmation dialog ──────────────────────────────
  function showSyncDialog(field, value, targetLang) {
    // Remove any existing dialog
    const existing = document.getElementById('i18n-sync-dialog');
    if (existing) existing.remove();

    const langLabel = targetLang === 'no' ? 'Norsk' : 'English';
    const currentLabel = _lang === 'no' ? 'Norsk' : 'English';
    const fieldLabel = field.replace(/\./g, ' › ');

    const dialog = document.createElement('div');
    dialog.id = 'i18n-sync-dialog';
    dialog.className = 'i18n-sync-dialog';
    dialog.innerHTML = `
      <div class="i18n-sync-inner">
        <div class="i18n-sync-icon">🌐</div>
        <div class="i18n-sync-body">
          <p class="i18n-sync-title">Apply change to ${langLabel}?</p>
          <p class="i18n-sync-sub">
            You updated <strong>${fieldLabel}</strong> in ${currentLabel}.
            Apply the same value to ${langLabel} too?
          </p>
        </div>
        <div class="i18n-sync-actions">
          <button class="i18n-btn i18n-btn-yes">Yes, sync</button>
          <button class="i18n-btn i18n-btn-no">Keep separate</button>
        </div>
      </div>
    `;

    dialog.querySelector('.i18n-btn-yes').addEventListener('click', () => {
      setOverride(targetLang, field, value);
      dialog.remove();
      showToast(`Synced to ${langLabel}`);
    });

    dialog.querySelector('.i18n-btn-no').addEventListener('click', () => {
      dialog.remove();
    });

    document.body.appendChild(dialog);

    // Auto-dismiss after 12s
    setTimeout(() => { if (dialog.parentNode) dialog.remove(); }, 12000);
  }

  // ── Toast notification ────────────────────────────────────
  function showToast(msg) {
    const t = document.createElement('div');
    t.className = 'i18n-toast';
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 2500);
  }

  // ── Admin: make a DOM element editable ───────────────────
  // Call with the element and the dot-notation field key.
  function makeEditable(el, field) {
    if (!isAdminMode()) return;
    el.classList.add('i18n-editable');
    el.title = 'Click to edit (' + (_lang === 'no' ? 'NO' : 'EN') + ')';
    el.addEventListener('click', function (e) {
      if (el.isContentEditable) return; // already editing
      e.stopPropagation();
      const original = el.textContent;
      el.contentEditable = 'true';
      el.focus();
      // Select all text
      const range = document.createRange();
      range.selectNodeContents(el);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);

      el.addEventListener('paste', function onPaste(e) {
        e.preventDefault();
        const plain = e.clipboardData.getData('text/plain');
        document.execCommand('insertText', false, plain);
      });

      el.addEventListener('blur', function save() {
        el.removeEventListener('blur', save);
        el.contentEditable = 'false';
        const newVal = el.innerText.trim();
        if (newVal !== original.trim()) {
          saveEdit(field, newVal);
          showToast('Saved (' + (_lang === 'no' ? 'NO' : 'EN') + ')');
        }
      });

      el.addEventListener('keydown', function onKey(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          el.blur();
          el.removeEventListener('keydown', onKey);
        }
        if (e.key === 'Escape') {
          el.innerText = original;
          el.blur();
          el.removeEventListener('keydown', onKey);
        }
      });
    });
  }

  // ── Init ──────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    updateLangToggle();
    updateStaticStrings();

    if (isAdminMode()) {
      document.body.classList.add('admin-mode');
    }
  });

  // ── Expose ────────────────────────────────────────────────
  window.I18N = {
    activeLang:    () => _lang,
    otherLang,
    setLang,
    current,
    currentPosts,
    postsForLang,
    localizedTile,
    isAdminMode,
    setAdminMode,
    makeEditable,
    saveEdit,
    showToast,
  };

})();
