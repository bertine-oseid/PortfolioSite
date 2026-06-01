// ============================================================
//  APP — routing, theme, language, layout switching,
//        admin auth, custom tiles
// ============================================================

// ── Theme ─────────────────────────────────────────────────────
(function () {
  const saved = localStorage.getItem('theme') || CONFIG.defaultTheme || 'light';
  document.documentElement.setAttribute('data-theme', saved);
})();

document.getElementById('themeToggle').addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// ── Language toggle ───────────────────────────────────────────
document.getElementById('langToggle').addEventListener('click', e => {
  const btn = e.target.closest('.lang-opt');
  if (!btn) return;
  const lang = btn.dataset.lang;
  if (lang && lang !== I18N.activeLang()) {
    I18N.setLang(lang);
    updateProfileSidebar();
  }
});

// ── Password protection ───────────────────────────────────────
const ADMIN_PASSWORD = 'TineMelk#';   // ← change this to your own password
const AUTH_SESSION_KEY = 'portfolio_auth';

// Clear any stale auth from a previous tab/session on every fresh page load
sessionStorage.removeItem(AUTH_SESSION_KEY);

function isAuthenticated() {
  return sessionStorage.getItem(AUTH_SESSION_KEY) === '1';
}

function authenticate() {
  sessionStorage.setItem(AUTH_SESSION_KEY, '1');
}

// ── Admin mode helpers ────────────────────────────────────────
function syncAdminUI() {
  const on = I18N.isAdminMode();
  // Bottom bar Done button
  const doneBtn = document.getElementById('adminToggleBtn');
  if (doneBtn) doneBtn.classList.toggle('is-admin', on);
  // Nav edit button
  const navBtn = document.getElementById('navEditToggle');
  if (navBtn) navBtn.classList.toggle('is-active', on);
  // Body class drives all admin-mode CSS
  document.body.classList.toggle('admin-mode', on);
}

function enterAdmin() {
  I18N.setAdminMode(true);
  syncAdminUI();
  applyLayout(true);
  updateProfileSidebar();
  triggerEditCursorBubble();
}

function exitAdmin() {
  I18N.setAdminMode(false);
  syncAdminUI();
  applyLayout(true);
  // Close avatar popover and remove edit class from sidebar
  document.getElementById('avatar-edit-popover')?.remove();
  const avatarEl = document.getElementById('sidebarAvatar');
  if (avatarEl) {
    avatarEl.classList.remove('sidebar-avatar-editable');
    delete avatarEl.dataset.editWired;
    avatarEl.removeEventListener('click', openAvatarEditor);
  }
}

// ── Password modal ────────────────────────────────────────────
(function () {
  const modal  = document.getElementById('passwordModal');
  const input  = document.getElementById('pwInput');
  const error  = document.getElementById('pwError');
  const submit = document.getElementById('pwSubmit');
  const cancel = document.getElementById('pwCancel');

  function open() {
    input.value = '';
    error.textContent = '';
    modal.classList.add('open');
    setTimeout(() => input.focus(), 80);
  }

  function close() { modal.classList.remove('open'); }

  function attempt() {
    if (input.value === ADMIN_PASSWORD) {
      authenticate();
      close();
      enterAdmin();
    } else {
      error.textContent = 'Incorrect password — try again.';
      input.select();
    }
  }

  submit.addEventListener('click', attempt);
  cancel.addEventListener('click', close);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter')  attempt();
    if (e.key === 'Escape') close();
  });
  modal.addEventListener('click', e => { if (e.target === modal) close(); });

  // Expose open function so the toggle button can call it
  window._openPasswordModal = open;
})();

// ── Shared toggle logic (used by both nav button and Done button) ─
function handleAdminToggle() {
  if (I18N.isAdminMode()) {
    exitAdmin();
  } else if (isAuthenticated()) {
    enterAdmin();
  } else {
    window._openPasswordModal();
  }
}

// ── Admin toggle button (in bottom control bar) ───────────────
(function () {
  const btn = document.getElementById('adminToggleBtn');
  if (!btn) return;
  syncAdminUI(); // set correct initial state on load
  btn.addEventListener('click', handleAdminToggle);
})();

// ── Nav edit toggle (persistent — always visible in header) ───
(function () {
  const btn = document.getElementById('navEditToggle');
  if (!btn) return;
  btn.addEventListener('click', handleAdminToggle);
})();

// ── Cursor bubble (desktop edit-mode hint, 5-second lifespan) ─
function triggerEditCursorBubble() {
  // Only on pointer devices (not touch)
  if (window.matchMedia('(pointer: coarse)').matches) return;

  // Remove any existing bubble first
  document.querySelector('.edit-cursor-bubble')?.remove();

  const bubble = document.createElement('div');
  bubble.className = 'edit-cursor-bubble';
  bubble.textContent = 'Edit Mode ✍️';
  document.body.appendChild(bubble);

  const updatePosition = e => {
    bubble.style.left = (e.clientX + 15) + 'px';
    bubble.style.top  = (e.clientY + 15) + 'px';
  };
  document.addEventListener('mousemove', updatePosition);

  // Self-destruct after 5 seconds with a smooth fade
  setTimeout(() => {
    bubble.style.transition = 'opacity 0.3s ease';
    bubble.style.opacity    = '0';
    setTimeout(() => {
      document.removeEventListener('mousemove', updatePosition);
      bubble.remove();
    }, 300);
  }, 5000);
}

// ── Hidden stock tiles (localStorage) ────────────────────────
const HIDDEN_TILES_KEY = 'portfolio_hidden_tiles';

function getHiddenTiles() {
  try { return new Set(JSON.parse(localStorage.getItem(HIDDEN_TILES_KEY) || '[]')); }
  catch (e) { return new Set(); }
}

function hideStockTile(id) {
  const hidden = getHiddenTiles();
  hidden.add(id);
  localStorage.setItem(HIDDEN_TILES_KEY, JSON.stringify([...hidden]));
  // Also scrub from saved layout order so position memory stays clean
  ['desktop', 'mobile'].forEach(layout => {
    const order = getLayoutOrder(layout);
    if (order) saveLayoutOrder(layout, order.filter(oid => oid !== id));
  });
  applyLayout(true);
}

window.hideStockTile = hideStockTile;

// ── Custom tiles (localStorage) ───────────────────────────────
const CUSTOM_TILES_KEY = 'portfolio_custom_tiles';

function getCustomTiles() {
  try { return JSON.parse(localStorage.getItem(CUSTOM_TILES_KEY) || '[]'); }
  catch (e) { return []; }
}

function saveCustomTiles(tiles) {
  localStorage.setItem(CUSTOM_TILES_KEY, JSON.stringify(tiles));
}

function addCustomTile(data) {
  const id   = 'custom_' + Date.now();
  const tile = Object.assign({ id, custom: true }, data);
  const tiles = getCustomTiles();
  tiles.push(tile);
  saveCustomTiles(tiles);
  return tile;
}

function updateCustomTile(id, data) {
  const tiles = getCustomTiles();
  const idx   = tiles.findIndex(t => t.id === id);
  if (idx === -1) return;
  tiles[idx] = Object.assign({}, tiles[idx], data);
  saveCustomTiles(tiles);
}

function removeCustomTile(id) {
  saveCustomTiles(getCustomTiles().filter(t => t.id !== id));
  // Scrub from layout order + size maps
  ['desktop', 'mobile'].forEach(layout => {
    const order = getLayoutOrder(layout);
    if (order) saveLayoutOrder(layout, order.filter(oid => oid !== id));
    const sizes = getTileSizes(layout);
    if (sizes[id]) {
      delete sizes[id];
      localStorage.setItem('portfolio_sizes_' + layout, JSON.stringify(sizes));
    }
  });
  applyLayout(true);
}

window.removeCustomTile = removeCustomTile;

// ── Add Box modal (create + edit) ────────────────────────────
(function () {
  const modal      = document.getElementById('addBoxModal');
  const closeBtn   = document.getElementById('addBoxClose');
  const cancelBtn  = document.getElementById('abCancel');
  const submitBtn  = document.getElementById('abSubmit');
  const typeSelect = document.getElementById('abType');
  const fields     = document.getElementById('abDynamicFields');
  const sizeGroup  = document.getElementById('abSizeGroup');
  const addBtn     = document.getElementById('addBoxBtn');
  const modalTitle = modal.querySelector('.modal-title');

  let editingTileId = null;  // null = creating, string = editing

  // ── Smart URL → platform detector ─────────────────────────
  const PLATFORM_PATTERNS = [
    { key: 'behance',   patterns: ['behance.net'],             name: 'Behance'    },
    { key: 'instagram', patterns: ['instagram.com'],           name: 'Instagram'  },
    { key: 'github',    patterns: ['github.com'],              name: 'GitHub'     },
    { key: 'twitter',   patterns: ['twitter.com', 'x.com'],   name: 'Twitter / X'},
    { key: 'linkedin',  patterns: ['linkedin.com'],            name: 'LinkedIn'   },
    { key: 'youtube',   patterns: ['youtube.com','youtu.be'],  name: 'YouTube'    },
    { key: 'tiktok',    patterns: ['tiktok.com'],              name: 'TikTok'     },
    { key: 'dribbble',  patterns: ['dribbble.com'],            name: 'Dribbble'   },
    { key: 'substack',  patterns: ['substack.com'],            name: 'Substack'   },
  ];

  function detectPlatform(url) {
    if (!url) return null;
    const u = url.toLowerCase();
    return PLATFORM_PATTERNS.find(p => p.patterns.some(pat => u.includes(pat))) || null;
  }

  function extractHandle(url) {
    try {
      const parts = new URL(url).pathname.split('/').filter(Boolean);
      return parts.length ? '@' + parts[0] : '';
    } catch { return ''; }
  }

  function wireSocialUrlDetection() {
    const urlInput     = document.getElementById('abSocialUrl');
    const labelInput   = document.getElementById('abLabel');
    const handleInput  = document.getElementById('abHandle');
    const preview      = document.getElementById('abPlatformPreview');
    if (!urlInput || !preview) return;
    urlInput.addEventListener('input', () => {
      const p = detectPlatform(urlInput.value);
      if (p) {
        preview.textContent = '✓ Detected: ' + p.name;
        preview.className   = 'platform-preview detected';
        if (labelInput  && !labelInput.value)  labelInput.value  = p.name;
        if (handleInput && !handleInput.value) handleInput.value = extractHandle(urlInput.value);
      } else {
        preview.textContent = urlInput.value ? 'Custom link' : '';
        preview.className   = 'platform-preview';
      }
    });
  }

  // Dynamic field templates — include thumbnail for link + video
  const FIELDS = {
    social: `
      <div class="form-group">
        <label class="form-label" for="abSocialUrl">Profile URL</label>
        <input type="url" class="form-input" id="abSocialUrl"
               placeholder="https://instagram.com/username" />
        <p id="abPlatformPreview" class="platform-preview"></p>
        <p class="form-hint">Platform (Instagram, Behance, GitHub…) auto-detected from URL.</p>
      </div>
      <div class="form-group">
        <label class="form-label" for="abLabel">Display Name <span class="form-optional">(auto-filled)</span></label>
        <input type="text" class="form-input" id="abLabel" placeholder="e.g. Instagram" />
      </div>
      <div class="form-group">
        <label class="form-label" for="abHandle">Handle <span class="form-optional">(auto-filled)</span></label>
        <input type="text" class="form-input" id="abHandle" placeholder="@username" />
      </div>`,

    link: `
      <div class="form-group">
        <label class="form-label" for="abLabel">Label</label>
        <input type="text" class="form-input" id="abLabel" placeholder="e.g. My Website" />
      </div>
      <div class="form-group">
        <label class="form-label" for="abUrl">URL</label>
        <input type="url" class="form-input" id="abUrl" placeholder="https://..." />
      </div>
      <div class="form-group">
        <label class="form-label" for="abDesc">Description <span class="form-optional">(optional)</span></label>
        <input type="text" class="form-input" id="abDesc" placeholder="Short description" />
      </div>
      <div class="form-group">
        <label class="form-label" for="abEmoji">Emoji <span class="form-optional">(optional)</span></label>
        <input type="text" class="form-input" id="abEmoji" placeholder="🔗" maxlength="2" />
      </div>
      <div class="form-group">
        <label class="form-label" for="abThumb">Thumbnail Image URL <span class="form-optional">(optional)</span></label>
        <input type="url" class="form-input" id="abThumb" placeholder="https://example.com/image.jpg" />
        <p class="form-hint">Image fills the box as a background with text layered on top.</p>
      </div>`,

    text: `
      <div class="form-group">
        <label class="form-label" for="abContent">Content</label>
        <textarea class="form-input form-textarea" id="abContent" rows="4"
                  placeholder="Your text here..."></textarea>
      </div>
      <div class="form-group">
        <label class="form-label" for="abStyle">Style</label>
        <select class="form-select" id="abStyle">
          <option value="">Normal</option>
          <option value="quote">Quote (orange background)</option>
        </select>
      </div>`,

    video: `
      <div class="form-group">
        <label class="form-label" for="abLabel">Label <span class="form-optional">(optional)</span></label>
        <input type="text" class="form-input" id="abLabel" placeholder="e.g. My Showreel" />
      </div>
      <div class="form-group">
        <label class="form-label" for="abSrc">Video URL or File Path</label>
        <input type="text" class="form-input" id="abSrc"
               placeholder="https://youtube.com/watch?v=... or /videos/reel.mp4" />
        <p class="form-hint">Supports YouTube, Vimeo, and direct .mp4 / .webm files.</p>
      </div>
      <div class="form-group">
        <label class="form-label" for="abThumb">Thumbnail / Poster Image URL <span class="form-optional">(optional)</span></label>
        <input type="url" class="form-input" id="abThumb" placeholder="https://example.com/poster.jpg" />
        <p class="form-hint">Shown before the video loads or as a box background image.</p>
      </div>`,

    divider: `
      <div class="form-group">
        <label class="form-label" for="abDivStyle">Style</label>
        <select class="form-select" id="abDivStyle">
          <option value="line">Horizontal line</option>
          <option value="blank">Blank spacer (invisible)</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="abContent">Center Text <span class="form-optional">(optional — line style only)</span></label>
        <input type="text" class="form-input" id="abContent" placeholder="e.g. Projects" />
      </div>`,

    location: `
      <div class="form-group">
        <label class="form-label" for="abCity">City</label>
        <input type="text" class="form-input" id="abCity" placeholder="e.g. Oslo" />
      </div>
      <div class="form-group">
        <label class="form-label" for="abCountry">Country <span class="form-optional">(optional)</span></label>
        <input type="text" class="form-input" id="abCountry" placeholder="e.g. Norway" />
      </div>
      <div class="form-group">
        <label class="form-label" for="abDesc">Tagline <span class="form-optional">(optional)</span></label>
        <input type="text" class="form-input" id="abDesc" placeholder="e.g. Based in the North" />
      </div>`,

    'profile-header': `
      <div class="form-group">
        <label class="form-label" for="abName">Name</label>
        <input type="text" class="form-input" id="abName" placeholder="e.g. Bertine Oseid" />
      </div>
      <div class="form-group">
        <label class="form-label" for="abHandle">Handle / Title</label>
        <input type="text" class="form-input" id="abHandle" placeholder="@bertine or Job Title" />
      </div>
      <div class="form-group">
        <label class="form-label" for="abTagline">Tagline / Description</label>
        <textarea class="form-input form-textarea" id="abTagline" rows="3"
                  placeholder="Junior Innholdsprodusent&#10;Grafisk Designer og Illustratør"></textarea>
      </div>
      <div class="form-group">
        <label class="form-label" for="abAvatar">Avatar Image URL <span class="form-optional">(optional)</span></label>
        <input type="url" class="form-input" id="abAvatar" placeholder="https://example.com/photo.jpg" />
        <p class="form-hint">Leave blank to use initials.</p>
      </div>`,

    'contact-card': `
      <div class="form-group">
        <label class="form-label" for="abLabel">Label</label>
        <input type="text" class="form-input" id="abLabel" placeholder="e.g. Ta kontakt" />
      </div>
      <div class="form-group">
        <label class="form-label" for="abEmail">Email Address</label>
        <input type="email" class="form-input" id="abEmail" placeholder="hello@example.com" />
      </div>
      <div class="form-group">
        <label class="form-label" for="abUrl">Custom URL <span class="form-optional">(optional — overrides mailto)</span></label>
        <input type="url" class="form-input" id="abUrl" placeholder="https://..." />
      </div>`,
  };

  function renderFields(type) {
    fields.innerHTML = FIELDS[type] || '';
    if (type === 'social') wireSocialUrlDetection();
  }

  function getSelectedSize() {
    return sizeGroup.querySelector('.size-btn.active')?.dataset.size || '1x1';
  }

  function setSize(size) {
    sizeGroup.querySelectorAll('.size-btn').forEach(b =>
      b.classList.toggle('active', b.dataset.size === size)
    );
  }

  // Fill all form fields from a tile object
  function prefillFields(tile) {
    if (tile.type === 'social') {
      document.getElementById('abSocialUrl').value = tile.url    || '';
      document.getElementById('abLabel').value     = tile.label  || '';
      document.getElementById('abHandle').value    = tile.handle || '';
    } else if (tile.type === 'link') {
      document.getElementById('abLabel').value  = tile.label       || '';
      document.getElementById('abUrl').value    = tile.url         || '';
      document.getElementById('abDesc').value   = tile.description || '';
      document.getElementById('abEmoji').value  = tile.emoji       || '';
      document.getElementById('abThumb').value  = tile.thumbnail   || '';
    } else if (tile.type === 'text') {
      document.getElementById('abContent').value = tile.content || '';
      document.getElementById('abStyle').value   = tile.style   || '';
    } else if (tile.type === 'video') {
      document.getElementById('abLabel').value  = tile.label     || '';
      document.getElementById('abSrc').value    = tile.src       || '';
      document.getElementById('abThumb').value  = tile.thumbnail || '';
    } else if (tile.type === 'divider') {
      document.getElementById('abDivStyle').value = tile.style   || 'line';
      document.getElementById('abContent').value  = tile.content || '';
    } else if (tile.type === 'location') {
      document.getElementById('abCity').value    = tile.city        || '';
      document.getElementById('abCountry').value = tile.country     || '';
      document.getElementById('abDesc').value    = tile.description || '';
    } else if (tile.type === 'profile-header') {
      document.getElementById('abName').value    = tile.name    || '';
      document.getElementById('abHandle').value  = tile.handle  || '';
      document.getElementById('abTagline').value = tile.tagline || '';
      document.getElementById('abAvatar').value  = tile.avatar  || '';
    } else if (tile.type === 'contact-card') {
      document.getElementById('abLabel').value = tile.label || '';
      document.getElementById('abEmail').value = tile.email || '';
      document.getElementById('abUrl').value   = (tile.url && !tile.url.startsWith('mailto:')) ? tile.url : '';
    }
  }

  // Open for creating a new tile
  function open() { openWith(null); }

  // Open pre-filled for editing an existing custom tile
  function openWith(tile) {
    editingTileId = tile ? tile.id : null;

    const type = tile?.type || 'link';
    typeSelect.value = type;
    renderFields(type);
    setSize(tile?.size || '1x1');

    if (tile) {
      prefillFields(tile);
      modalTitle.textContent    = 'Edit Box';
      submitBtn.textContent     = 'Save Changes';
    } else {
      modalTitle.textContent    = 'Add New Box';
      submitBtn.textContent     = 'Add Box';
    }

    modal.classList.add('open');
    setTimeout(() => fields.querySelector('input, textarea')?.focus(), 80);
  }

  function close() {
    modal.classList.remove('open');
    editingTileId = null;
    // Reset labels after transition
    setTimeout(() => {
      modalTitle.textContent = 'Add New Box';
      submitBtn.textContent  = 'Add Box';
    }, 200);
  }

  function submit() {
    const type = typeSelect.value;
    const size = getSelectedSize();
    let data   = { type, size };
    let valid  = true;

    if (type === 'social') {
      const url    = document.getElementById('abSocialUrl')?.value.trim();
      const label  = document.getElementById('abLabel')?.value.trim();
      const handle = document.getElementById('abHandle')?.value.trim();
      if (!url) { valid = false; }
      const platform = detectPlatform(url)?.key || 'link';
      data = Object.assign(data, {
        url, label: label || platform, handle: handle || extractHandle(url), platform,
      });
    } else if (type === 'link') {
      const label = document.getElementById('abLabel')?.value.trim();
      const url   = document.getElementById('abUrl')?.value.trim();
      if (!label || !url) { valid = false; }
      data = Object.assign(data, {
        label,
        url,
        description: document.getElementById('abDesc')?.value.trim()  || '',
        emoji:       document.getElementById('abEmoji')?.value.trim() || '🔗',
        thumbnail:   document.getElementById('abThumb')?.value.trim() || '',
      });
    } else if (type === 'divider') {
      data = Object.assign(data, {
        style:   document.getElementById('abDivStyle')?.value || 'line',
        content: document.getElementById('abContent')?.value.trim() || '',
      });
    } else if (type === 'location') {
      const city = document.getElementById('abCity')?.value.trim();
      if (!city) { valid = false; }
      data = Object.assign(data, {
        city,
        country:     document.getElementById('abCountry')?.value.trim() || '',
        description: document.getElementById('abDesc')?.value.trim()    || '',
      });
    } else if (type === 'profile-header') {
      const name = document.getElementById('abName')?.value.trim();
      if (!name) { valid = false; }
      data = Object.assign(data, {
        name,
        handle:  document.getElementById('abHandle')?.value.trim()  || '',
        tagline: document.getElementById('abTagline')?.value.trim() || '',
        avatar:  document.getElementById('abAvatar')?.value.trim()  || '',
      });
    } else if (type === 'contact-card') {
      const label = document.getElementById('abLabel')?.value.trim();
      const email = document.getElementById('abEmail')?.value.trim();
      if (!label) { valid = false; }
      const url = document.getElementById('abUrl')?.value.trim() ||
                  (email ? 'mailto:' + email : '#');
      data = Object.assign(data, { label, email, url, description: email });
    } else if (type === 'text') {
      const content = document.getElementById('abContent')?.value.trim();
      if (!content) { valid = false; }
      data = Object.assign(data, {
        content,
        style: document.getElementById('abStyle')?.value || '',
      });
    } else if (type === 'video') {
      const src = document.getElementById('abSrc')?.value.trim();
      if (!src) { valid = false; }
      data = Object.assign(data, {
        src,
        url:       src,
        label:     document.getElementById('abLabel')?.value.trim() || '',
        thumbnail: document.getElementById('abThumb')?.value.trim() || '',
      });
    }

    if (!valid) { I18N.showToast('Please fill in the required fields.'); return; }

    const isEditing = !!editingTileId;
    if (isEditing) {
      updateCustomTile(editingTileId, data);
    } else {
      addCustomTile(data);
    }

    close();
    applyLayout(true);
    I18N.showToast(isEditing ? 'Box updated!' : 'New box added!');
  }

  typeSelect.addEventListener('change', () => {
    const wasEditing = editingTileId;
    renderFields(typeSelect.value);
    // If editing, re-prefill after type switch so nothing is lost
    if (wasEditing) {
      const tile = getCustomTiles().find(t => t.id === wasEditing);
      if (tile && tile.type === typeSelect.value) prefillFields(tile);
    }
  });

  sizeGroup.addEventListener('click', e => {
    const btn = e.target.closest('.size-btn');
    if (!btn) return;
    sizeGroup.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });

  addBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  cancelBtn.addEventListener('click', close);
  submitBtn.addEventListener('click', submit);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });

  // Expose so grid.js can call edit on a custom tile
  window._openEditBoxModal = function (tileId) {
    const tile = getCustomTiles().find(t => t.id === tileId);
    if (tile) openWith(tile);
  };

  // Expose so the creation dock can open the modal with a pre-selected type
  window._openNewBoxModal = function (type) {
    openWith({ type: type || 'link' });
  };

  // ── Creation dock quick-add buttons ────────────────────────
  document.querySelectorAll('.dock-btn[data-type]').forEach(btn => {
    btn.addEventListener('click', () => window._openNewBoxModal(btn.dataset.type));
  });
})();

// ── Layout order (persisted per breakpoint) ───────────────────
function saveLayoutOrder(layoutName, ids) {
  localStorage.setItem('portfolio_layout_' + layoutName, JSON.stringify(ids));
}

function getLayoutOrder(layoutName) {
  try { return JSON.parse(localStorage.getItem('portfolio_layout_' + layoutName)); }
  catch (e) { return null; }
}

// ── Tile sizes (persisted per breakpoint) ─────────────────────
function getTileSizes(layoutName) {
  try { return JSON.parse(localStorage.getItem('portfolio_sizes_' + layoutName) || '{}'); }
  catch (e) { return {}; }
}

function saveTileSize(tileId, size) {
  const layoutName = getLayoutName();
  const sizes = getTileSizes(layoutName);
  sizes[tileId] = size;
  localStorage.setItem('portfolio_sizes_' + layoutName, JSON.stringify(sizes));
}

window.saveTileSize = saveTileSize;

// ── SortableJS ────────────────────────────────────────────────
let _sortable = null;

function initSortable() {
  const grid = document.getElementById('bentoGrid');
  if (_sortable) { _sortable.destroy(); _sortable = null; }
  if (!I18N.isAdminMode() || typeof Sortable === 'undefined' || !grid) return;

  _sortable = Sortable.create(grid, {
    animation:   180,
    easing:      'cubic-bezier(0.25, 1, 0.5, 1)',
    ghostClass:  'tile-ghost',
    chosenClass: 'tile-chosen',
    dragClass:   'tile-dragging',
    onEnd() {
      const ids = [...grid.querySelectorAll('.tile[data-tile-id]')]
        .map(el => el.dataset.tileId);
      saveLayoutOrder(getLayoutName(), ids);
    },
  });
}

window.initSortable = initSortable;

// ── Layout switching (desktop / mobile) ──────────────────────
let activeLayout = null;

function getLayoutName() {
  const w = window.__previewWidth || window.innerWidth;
  return w <= 768 ? 'mobile' : 'desktop';
}

function applyLayout(force) {
  const name = getLayoutName();
  if (name === activeLayout && !force) return;
  activeLayout = name;

  const layout = (CONFIG.layouts && CONFIG.layouts[name]) || null;

  // Build tile map: CONFIG tiles + custom tiles, minus any the user has hidden
  const hiddenIds = getHiddenTiles();
  const tileMap = {};
  CONFIG.tiles.forEach(t => { if (!hiddenIds.has(t.id)) tileMap[t.id] = t; });
  getCustomTiles().forEach(ct => { if (!hiddenIds.has(ct.id)) tileMap[ct.id] = ct; });

  let orderedTiles;
  if (layout) {
    orderedTiles = layout
      .map(entry => {
        const tile = tileMap[entry.id];
        if (!tile) return null;
        return Object.assign({}, tile, { size: entry.size || tile.size || '1x1' });
      })
      .filter(Boolean);
  } else {
    orderedTiles = Object.values(tileMap).map(t =>
      Object.assign({}, t, { size: t.size || '1x1' })
    );
  }

  // Append custom tiles not already covered by the layout definition
  const layoutIds = new Set(orderedTiles.map(t => t.id));
  getCustomTiles().forEach(ct => {
    if (!layoutIds.has(ct.id)) {
      orderedTiles.push(Object.assign({}, ct, { size: ct.size || '1x1' }));
    }
  });

  // Apply saved custom order
  const savedOrder = getLayoutOrder(name);
  if (savedOrder && savedOrder.length) {
    const tileById = {};
    orderedTiles.forEach(t => { tileById[t.id] = t; });
    const reordered = savedOrder.map(id => tileById[id]).filter(Boolean);
    orderedTiles.forEach(t => { if (!savedOrder.includes(t.id)) reordered.push(t); });
    orderedTiles = reordered;
  }

  // Apply saved size overrides (per breakpoint)
  const savedSizes = getTileSizes(name);
  if (Object.keys(savedSizes).length) {
    orderedTiles = orderedTiles.map(t =>
      savedSizes[t.id] ? Object.assign({}, t, { size: savedSizes[t.id] }) : t
    );
  }

  buildGrid(orderedTiles);
}

// Re-render instantly on breakpoint crossing, debounce for mid-range resizes
let resizeTimer;
let lastLayoutName = getLayoutName();

window.addEventListener('resize', () => {
  const current = getLayoutName();
  if (current !== lastLayoutName) {
    lastLayoutName = current;
    clearTimeout(resizeTimer);
    applyLayout(true);
  } else {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(applyLayout, 120);
  }
});

// ── Router ────────────────────────────────────────────────────
let currentPage   = 'grid';
let currentPostId = null;

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('page-' + id);
  if (page) page.classList.add('active');
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle(
      'active',
      l.dataset.page === id || (id === 'post' && l.dataset.page === 'blog')
    );
  });
  window.scrollTo(0, 0);
  currentPage = id;
}

function navigateTo(page) {
  if (page === 'blog') buildBlogList();
  showPage(page);
  history.pushState({ page }, '', '#' + page);
}

function navigateToPost(id) {
  currentPostId = id;
  buildPost(id);
  showPage('post');
  history.pushState({ page: 'post', postId: id }, '', '#post/' + id);
}

document.getElementById('backBtn').addEventListener('click', () => navigateTo('blog'));

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    navigateTo(link.dataset.page);
  });
});

window.addEventListener('popstate', e => {
  if (!e.state)                { navigateTo('grid'); return; }
  if (e.state.page === 'post') navigateToPost(e.state.postId);
  else                         navigateTo(e.state.page || 'grid');
});

function handleInitialHash() {
  const hash = location.hash;
  if (hash.startsWith('#post/'))  navigateToPost(hash.slice(6));
  else if (hash === '#blog')      navigateTo('blog');
  else                            showPage('grid');
}

// ── Expose globals ────────────────────────────────────────────
window.navigateTo     = navigateTo;
window.navigateToPost = navigateToPost;
window.applyLayout    = applyLayout;

// ── Profile sidebar ───────────────────────────────────────────
const AVATAR_KEY = 'portfolio_avatar';

function getAvatarUrl() {
  return localStorage.getItem(AVATAR_KEY) || CONFIG.avatar || null;
}

function updateProfileSidebar() {
  const lang      = I18N.current();
  const nameEl    = document.getElementById('sidebarName');
  const taglineEl = document.getElementById('sidebarTagline');
  const avatarEl  = document.getElementById('sidebarAvatar');

  if (nameEl)    nameEl.textContent    = lang.name    || '';
  if (taglineEl) taglineEl.textContent = lang.tagline || '';

  if (avatarEl) {
    const url = getAvatarUrl();
    if (url) {
      avatarEl.innerHTML = `<img src="${url}" alt="${lang.name}" />`;
    } else {
      avatarEl.textContent = (lang.name || '')
        .split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    }
    // Reset wire flag so wireSidebarEditing() can re-attach
    delete avatarEl.dataset.editWired;
    avatarEl.removeEventListener('click', openAvatarEditor);
  }

  if (I18N.isAdminMode()) wireSidebarEditing();
}

// Make name + tagline inline-editable; add click-to-edit on avatar
function wireSidebarEditing() {
  const nameEl    = document.getElementById('sidebarName');
  const taglineEl = document.getElementById('sidebarTagline');
  const avatarEl  = document.getElementById('sidebarAvatar');

  if (nameEl)    I18N.makeEditable(nameEl,    'name');
  if (taglineEl) I18N.makeEditable(taglineEl, 'tagline');

  if (avatarEl && !avatarEl.dataset.editWired) {
    avatarEl.dataset.editWired = '1';
    avatarEl.classList.add('sidebar-avatar-editable');
    avatarEl.addEventListener('click', openAvatarEditor);
  }
}

// Click handler: opens a small URL-input popover anchored below the avatar
function openAvatarEditor(e) {
  if (!I18N.isAdminMode()) return;
  e.stopPropagation();

  document.getElementById('avatar-edit-popover')?.remove();

  const current = getAvatarUrl() || '';
  const avatarEl = document.getElementById('sidebarAvatar');
  const rect     = avatarEl.getBoundingClientRect();

  const pop = document.createElement('div');
  pop.id        = 'avatar-edit-popover';
  pop.className = 'avatar-edit-popover';
  pop.innerHTML = `
    <p class="aep-label">Avatar image URL</p>
    <input class="aep-input" type="url" value="${current}"
           placeholder="https://example.com/photo.jpg" />
    <p class="aep-hint">Leave blank to show initials instead.</p>
    <div class="aep-actions">
      <button class="aep-btn aep-save">Save</button>
      <button class="aep-btn aep-cancel">Cancel</button>
    </div>`;

  pop.style.top  = (rect.bottom + window.scrollY + 10) + 'px';
  pop.style.left = rect.left + 'px';
  document.body.appendChild(pop);

  const input = pop.querySelector('.aep-input');
  input.focus(); input.select();

  function save() {
    const url = input.value.trim();
    if (url) localStorage.setItem(AVATAR_KEY, url);
    else     localStorage.removeItem(AVATAR_KEY);
    pop.remove();
    updateProfileSidebar();
    I18N.showToast('Avatar updated!');
  }

  pop.querySelector('.aep-save').addEventListener('click', save);
  pop.querySelector('.aep-cancel').addEventListener('click', () => pop.remove());
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter')  save();
    if (e.key === 'Escape') pop.remove();
  });

  // Dismiss on outside click
  setTimeout(() => {
    document.addEventListener('click', function dismiss(ev) {
      if (!pop.contains(ev.target)) {
        pop.remove();
        document.removeEventListener('click', dismiss);
      }
    });
  }, 0);
}

// ── Init ──────────────────────────────────────────────────────
updateProfileSidebar();
applyLayout();
handleInitialHash();
