// ============================================================
//  GRID — renders bento tiles from CONFIG.tiles
//  Text content is pulled through I18N.current() so the grid
//  reflects the active language automatically.
// ============================================================

const PLATFORM_ICONS = {
  twitter:   `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  github:    `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>`,
  instagram: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
  linkedin:  `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>`,
  youtube:   `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58a2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>`,
  tiktok:    `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.67a8.18 8.18 0 004.78 1.52V6.7a4.85 4.85 0 01-1.01-.01z"/></svg>`,
  dribbble:  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/></svg>`,
  substack:  `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/></svg>`,
  behance:   `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6.938 4.503c.702 0 1.34.06 1.92.188.577.13 1.07.33 1.485.598.415.27.737.622.967 1.053.23.428.34.962.34 1.6 0 .694-.154 1.267-.465 1.722-.31.454-.757.83-1.345 1.124.808.234 1.415.68 1.822 1.337.407.655.612 1.437.612 2.352 0 .754-.14 1.406-.422 1.97-.279.56-.67 1.024-1.172 1.383-.503.36-1.083.625-1.743.796-.66.172-1.356.258-2.097.258H0V4.503h6.938zm-.393 5.757c.594 0 1.08-.12 1.46-.36.376-.243.565-.645.565-1.212 0-.31-.055-.564-.167-.75-.11-.185-.26-.332-.45-.44-.19-.11-.407-.186-.643-.226-.235-.04-.478-.058-.724-.058H2.984V10.26h3.561zm.204 6.08c.274 0 .54-.028.79-.082.248-.055.47-.142.666-.267.196-.125.355-.297.475-.518.12-.22.182-.497.182-.826 0-.67-.19-1.155-.57-1.45-.38-.296-.887-.444-1.52-.444H2.984v3.587H6.75zM22 7h-7V5h7v2zm.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 1.202.83 1.883 2.218 1.883.944 0 1.489-.231 2.02-1.037l3.518.183zm-5.725-4.535h3.977c-.052-.867-.58-1.74-1.961-1.74-1.222 0-1.845.73-2.016 1.74z"/></svg>`,
};

function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
}

function formatDate(str) {
  const lang = I18N.activeLang();
  const locale = lang === 'no' ? 'nb-NO' : 'en-GB';
  const d = new Date(str + 'T00:00:00');
  return d.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
}

// Returns a tile merged with its per-language text overrides.
function localTile(tile) {
  return I18N.localizedTile(tile, I18N.current());
}

function renderProfile(tile) {
  const lang = I18N.current();
  const avatarHtml = CONFIG.avatar
    ? `<img src="${CONFIG.avatar}" alt="${lang.name}" />`
    : getInitials(lang.name);

  const nameEl    = `<div class="profile-name"    data-i18n-field="name">${lang.name}</div>`;
  const handleEl  = `<div class="profile-handle"  data-i18n-field="handle">${lang.handle}</div>`;
  const taglineEl = `<div class="profile-tagline" data-i18n-field="tagline">${lang.tagline}</div>`;

  return `
    <div class="tile tile-profile" data-size="${tile.size}" data-tile-id="${tile.id}">
      <div class="profile-avatar">${avatarHtml}</div>
      <div class="profile-info">
        ${nameEl}
        ${handleEl}
        ${taglineEl}
      </div>
    </div>`;
}

function renderSocial(tile) {
  const t    = localTile(tile);
  const icon = PLATFORM_ICONS[t.platform] || '🔗';
  return `
    <div class="tile tile-social clickable" data-size="${tile.size}" data-platform="${t.platform}" data-tile-id="${tile.id}"
         onclick="openUrl('${t.url}')">
      <div class="platform-icon">${icon}</div>
      <div class="platform-name" data-i18n-field="tiles.${t.id}.label">${t.label}</div>
      <div class="platform-handle">${t.handle}</div>
      <span class="arrow">↗</span>
    </div>`;
}

function renderLink(tile) {
  const t        = localTile(tile);
  const wide     = tile.size === '2x1';
  const hasThumb = !!t.thumbnail;
  const bgStyle  = hasThumb ? ` style="background-image:url('${t.thumbnail}');background-size:cover;background-position:center;"` : '';
  return `
    <div class="tile tile-link${wide ? ' wide' : ''}${hasThumb ? ' has-thumbnail' : ''} clickable"
         data-size="${tile.size}" data-tile-id="${tile.id}"${bgStyle}
         onclick="openUrl('${t.url}')">
      ${hasThumb ? '<div class="tile-thumb-overlay"></div>' : ''}
      <span class="link-emoji">${t.emoji || '🔗'}</span>
      <div class="link-text">
        <div class="link-label"  data-i18n-field="tiles.${t.id}.label">${t.label}</div>
        ${t.description ? `<div class="link-desc" data-i18n-field="tiles.${t.id}.description">${t.description}</div>` : ''}
      </div>
      <span class="arrow">↗</span>
    </div>`;
}

function renderText(tile) {
  const t       = localTile(tile);
  const isQuote = t.style === 'quote';
  const content = t.content || '';
  return `
    <div class="tile tile-text${isQuote ? ' quote-style' : ''}" data-size="${tile.size}" data-tile-id="${tile.id}">
      <p class="tile-text-content" data-i18n-field="tiles.${t.id}.content">${content}</p>
    </div>`;
}

function renderBlogPreview(tile) {
  const t     = localTile(tile);
  const posts = I18N.currentPosts().slice(0, 3);
  const label = t.label || '';
  const postsHtml = posts.map(p => `
    <div class="blog-tile-post" onclick="navigateToPost('${p.id}')">
      <div class="blog-tile-post-title">${p.title}</div>
      <div class="blog-tile-post-date">${formatDate(p.date)}</div>
    </div>`).join('');
  return `
    <div class="tile tile-blog-preview clickable" data-size="${tile.size}" data-tile-id="${tile.id}" onclick="navigateTo('blog')">
      <div class="blog-tile-label" data-i18n-field="tiles.blog.label">${label}</div>
      <div class="blog-tile-posts">${postsHtml}</div>
    </div>`;
}

// ── Inline editing for custom tile text fields ─────────────────
// Custom tiles don't go through i18n, so they get their own editable
// wiring. On blur the new text is persisted via updateCustomTile().
function makeCustomEditable(el) {
  const tileId = el.dataset.ceTileId;
  const field  = el.dataset.ceField;
  if (!tileId || !field) return;

  el.classList.add('i18n-editable');
  el.title = 'Click to edit';

  el.addEventListener('click', function handler(e) {
    if (el.isContentEditable) return; // already in edit mode
    e.stopPropagation();
    const original = el.textContent;

    el.contentEditable = 'true';
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);

    el.addEventListener('paste', function onPaste(ev) {
      ev.preventDefault();
      document.execCommand('insertText', false,
        ev.clipboardData.getData('text/plain'));
    });

    el.addEventListener('blur', function save() {
      el.removeEventListener('blur', save);
      el.contentEditable = 'false';
      const newVal = el.innerText.trim();
      if (newVal !== original.trim()) {
        if (typeof window.updateCustomTile === 'function') {
          window.updateCustomTile(tileId, { [field]: newVal });
        }
        I18N.showToast('Saved');
      }
    });

    el.addEventListener('keydown', function onKey(ev) {
      if (ev.key === 'Enter' && !ev.shiftKey) {
        ev.preventDefault();
        el.blur();
        el.removeEventListener('keydown', onKey);
      }
      if (ev.key === 'Escape') {
        el.innerText = original;
        el.blur();
        el.removeEventListener('keydown', onKey);
      }
    });
  });
}

function buildGrid(orderedTiles) {
  const grid = document.getElementById('bentoGrid');
  if (!grid) return;

  document.documentElement.style.setProperty('--accent', CONFIG.accentColor || '#f97316');

  const tiles = orderedTiles || CONFIG.tiles;
  const html = tiles.map(tile => {
    switch (tile.type) {
      case 'profile':      return renderProfile(tile);
      case 'social':       return renderSocial(tile);
      case 'link':         return renderLink(tile);
      case 'text':         return renderText(tile);
      case 'blog-preview': return renderBlogPreview(tile);
      case 'video':          return renderVideo(tile);
      case 'divider':        return renderDivider(tile);
      case 'location':       return renderLocation(tile);
      case 'profile-header': return renderProfileHeader(tile);
      case 'contact-card':   return renderContactCard(tile);
      default: return '';
    }
  }).join('');

  grid.innerHTML = html + '<div class="admin-layout-spacer" style="grid-column:1/-1;height:180px;clear:both;pointer-events:none;"></div>';

  // In admin mode: wire up text editing, admin controls, and drag-and-drop
  if (I18N.isAdminMode()) {
    grid.querySelectorAll('[data-i18n-field]').forEach(el => {
      I18N.makeEditable(el, el.dataset.i18nField);
    });
    // Wire inline editing for custom tile text fields
    grid.querySelectorAll('[data-ce-field]').forEach(el => {
      makeCustomEditable(el);
    });
    // Block accidental navigation clicks in admin mode, but let admin
    // buttons (.ac-btn) pass through so delete/edit always work.
    grid.querySelectorAll('.tile.clickable').forEach(tile => {
      tile.addEventListener('click', e => {
        if (!e.target.closest('.ac-btn') && !e.target.closest('.admin-controls')) {
          e.stopPropagation();
          e.preventDefault();
        }
      });
    });
    injectAdminControls(grid);
  }

  // Initialise (or re-initialise) SortableJS
  if (typeof window.initSortable === 'function') window.initSortable();
}

// ── Admin controls (bottom-left strip, appears on tile hover) ─
const SIZE_OPTIONS = [
  { key: '1x1', label: 'Small', hint: '1×1' },
  { key: '2x1', label: 'Wide',  hint: '2×1' },
  { key: '1x2', label: 'Tall',  hint: '1×2' },
  { key: '2x2', label: 'Big',   hint: '2×2' },
];

const IC_RESIZE = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`;
const IC_EDIT   = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`;
const IC_DELETE = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`;

// ── Size portal singleton (fixed position — bypasses tile overflow:hidden) ──
let _sizePortal    = null;
let _portalTileId  = null;

function ensureSizePortal() {
  if (_sizePortal) return _sizePortal;

  _sizePortal = document.createElement('div');
  _sizePortal.className = 'size-portal';
  _sizePortal.innerHTML = SIZE_OPTIONS.map(s =>
    `<button class="ac-size-opt" data-size-key="${s.key}">
       <span>${s.label}</span><span class="ac-size-hint">${s.hint}</span>
     </button>`
  ).join('');

  _sizePortal.querySelectorAll('.ac-size-opt').forEach(opt => {
    opt.addEventListener('click', e => {
      e.stopPropagation();
      if (_portalTileId) {
        const t = document.querySelector(`.tile[data-tile-id="${_portalTileId}"]`);
        if (t) {
          t.dataset.size = opt.dataset.sizeKey;
          if (typeof window.saveTileSize === 'function') window.saveTileSize(_portalTileId, opt.dataset.sizeKey);
          _sizePortal.querySelectorAll('.ac-size-opt').forEach(o => o.classList.remove('active'));
          opt.classList.add('active');
        }
      }
      closeSizePortal();
    });
  });

  document.body.appendChild(_sizePortal);
  document.addEventListener('click', closeSizePortal);
  return _sizePortal;
}

function openSizePortal(btn, tileId) {
  _portalTileId = tileId;
  const p   = ensureSizePortal();
  const cur = document.querySelector(`.tile[data-tile-id="${tileId}"]`)?.dataset.size;
  p.querySelectorAll('.ac-size-opt').forEach(o =>
    o.classList.toggle('active', o.dataset.sizeKey === cur)
  );
  // Temporarily show off-screen to measure height
  p.style.visibility = 'hidden';
  p.classList.add('open');
  requestAnimationFrame(() => {
    const r  = btn.getBoundingClientRect();
    const ph = p.offsetHeight;
    const pw = p.offsetWidth;
    let top  = r.top - ph - 8;
    let left = r.left;
    if (top < 8) top = r.bottom + 8;
    if (left + pw > window.innerWidth - 8) left = window.innerWidth - pw - 8;
    p.style.top        = top  + 'px';
    p.style.left       = left + 'px';
    p.style.visibility = 'visible';
  });
}

function closeSizePortal() {
  if (_sizePortal) _sizePortal.classList.remove('open');
  _portalTileId = null;
}

function injectAdminControls(grid) {
  grid.querySelectorAll('.tile[data-tile-id]').forEach(tile => {
    const tileId   = tile.dataset.tileId;
    const isCustom = tileId.startsWith('custom_');

    const strip = document.createElement('div');
    strip.className = 'admin-controls';

    // ── Resize button (opens portal) ──────────────────────────
    const resizeBtn = document.createElement('button');
    resizeBtn.className = 'ac-btn ac-resize-btn';
    resizeBtn.title = 'Resize';
    resizeBtn.innerHTML = IC_RESIZE;
    resizeBtn.addEventListener('click', e => {
      e.stopPropagation();
      openSizePortal(resizeBtn, tileId);
    });
    strip.appendChild(resizeBtn);

    // ── Edit button (all tiles) ───────────────────────────────
    const editBtn = document.createElement('button');
    editBtn.className = 'ac-btn ac-edit-btn';
    editBtn.title = 'Edit box';
    editBtn.innerHTML = IC_EDIT;
    editBtn.addEventListener('click', e => {
      e.stopPropagation();
      if (isCustom) {
        // Custom tiles: open pre-filled edit modal
        if (typeof window._openEditBoxModal === 'function') window._openEditBoxModal(tileId);
      } else {
        // Stock tiles: focus the first inline-editable field in the tile
        const firstEditable = tile.querySelector('[data-i18n-field]');
        if (firstEditable) {
          firstEditable.click();
        } else {
          I18N.showToast('Click any text on this tile to edit it');
        }
      }
    });
    strip.appendChild(editBtn);

    // ── Delete button (all tiles) ────────────────────────────
    const delBtn = document.createElement('button');
    delBtn.className = 'ac-btn ac-delete-btn';
    delBtn.title = isCustom ? 'Delete box' : 'Hide box';
    delBtn.innerHTML = IC_DELETE;
    delBtn.addEventListener('click', e => {
      e.stopPropagation();
      if (isCustom) {
        if (typeof window.removeCustomTile === 'function') window.removeCustomTile(tileId);
      } else {
        if (typeof window.hideStockTile === 'function') window.hideStockTile(tileId);
      }
    });
    strip.appendChild(delBtn);

    // Double-click to edit (custom tiles open modal; stock tiles focus first field)
    tile.addEventListener('dblclick', e => {
      e.stopPropagation();
      if (isCustom) {
        if (typeof window._openEditBoxModal === 'function') window._openEditBoxModal(tileId);
      } else {
        tile.querySelector('[data-i18n-field]')?.click();
      }
    });

    tile.appendChild(strip);
  });
}

function openUrl(url) {
  if (!url || url === '#') return;
  window.open(url, '_blank', 'noopener');
}

window.openUrl  = openUrl;
window.buildGrid = buildGrid;

// ── Video tile ────────────────────────────────────────────────
function getEmbedUrl(url) {
  if (!url) return null;
  let m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (m) return `https://www.youtube.com/embed/${m[1]}?autoplay=0&mute=1&loop=1&playlist=${m[1]}&controls=1&modestbranding=1&rel=0`;
  m = url.match(/vimeo\.com\/(\d+)/);
  if (m) return `https://player.vimeo.com/video/${m[1]}?autoplay=0&muted=1&loop=1&title=0&byline=0&portrait=0`;
  return null;
}

function renderVideo(tile) {
  const embedUrl = getEmbedUrl(tile.src || tile.url || '');
  const hasLink  = !!(tile.url && tile.url !== '#');
  const label    = tile.label || '';
  const linkBtn  = hasLink
    ? `<a class="video-watch-btn" href="${tile.url}" target="_blank" rel="noopener" onclick="event.stopPropagation()" aria-label="Watch full video"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>Watch full</a>`
    : '';

  const hasThumb  = !!tile.thumbnail;
  const thumbAttr = hasThumb && !embedUrl
    ? ` style="background-image:url('${tile.thumbnail}');background-size:cover;background-position:center;"`
    : '';

  const tileId = tile.id || '';

  if (embedUrl) {
    return `
      <div class="tile tile-video" data-size="${tile.size}" data-tile-id="${tileId}" data-embed="true">
        <div class="video-embed-wrap">
          <iframe src="${embedUrl}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy" title="${label || 'Video'}"></iframe>
        </div>
        <div class="video-overlay-bar"><span class="video-label" data-ce-tile-id="${tileId}" data-ce-field="label">${label}</span>${linkBtn}</div>
      </div>`;
  }

  const src  = tile.src || '';
  const ext  = src.split('.').pop() || 'mp4';
  const poster = (tile.poster || tile.thumbnail) ? `poster="${tile.poster || tile.thumbnail}"` : '';
  const id   = 'vid_' + Math.random().toString(36).slice(2, 8);
  return `
    <div class="tile tile-video${hasThumb ? ' has-thumbnail' : ''}" data-size="${tile.size}" data-tile-id="${tileId}" data-embed="false"${thumbAttr} onclick="toggleVideo('${id}')">
      <video id="${id}" class="video-el" ${poster} muted loop playsinline preload="metadata"><source src="${src}" type="video/${ext}"></video>
      <div class="video-play-overlay" id="ov_${id}">
        <div class="video-play-btn" aria-label="Play video"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21"/></svg></div>
      </div>
      <div class="video-overlay-bar"><span class="video-label" data-ce-tile-id="${tileId}" data-ce-field="label">${label}</span>${linkBtn}</div>
    </div>`;
}

function toggleVideo(id) {
  const vid = document.getElementById(id);
  const ov  = document.getElementById('ov_' + id);
  if (!vid) return;
  if (vid.paused) {
    vid.play();
    ov.style.opacity = '0';
    ov.style.pointerEvents = 'none';
  } else {
    vid.pause();
    ov.style.opacity = '1';
    ov.style.pointerEvents = 'auto';
  }
}
window.toggleVideo = toggleVideo;

// ── Divider tile ──────────────────────────────────────────────
function renderDivider(tile) {
  const blank  = tile.style === 'blank';
  const text   = tile.content || '';
  const tileId = tile.id || '';
  return `
    <div class="tile tile-divider${blank ? ' divider-blank' : ''}"
         data-size="${tile.size}" data-tile-id="${tileId}">
      ${blank ? '' : `
        <div class="divider-inner">
          ${text
            ? `<span class="divider-rule"></span>
               <span class="divider-text" data-ce-tile-id="${tileId}" data-ce-field="content">${text}</span>
               <span class="divider-rule"></span>`
            : `<span class="divider-rule full"></span>`
          }
        </div>`}
    </div>`;
}

// ── Location tile ─────────────────────────────────────────────
const MAP_SVG = `<svg class="location-map-svg" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <pattern id="mapGrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M20 0H0V20" fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.3"/>
    </pattern>
    <pattern id="mapRoad" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M0 30 H60 M30 0 V60" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.2"/>
    </pattern>
  </defs>
  <rect width="200" height="120" fill="url(#mapGrid)"/>
  <rect width="200" height="120" fill="url(#mapRoad)"/>
  <circle cx="100" cy="55" r="28" fill="currentColor" opacity="0.06"/>
  <circle cx="100" cy="55" r="14" fill="currentColor" opacity="0.09"/>
</svg>`;

const PIN_SVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;

function renderLocation(tile) {
  const city    = tile.city    || 'Your City';
  const country = tile.country || '';
  const desc    = tile.description || '';
  const id      = tile.id || '';
  return `
    <div class="tile tile-location" data-size="${tile.size}" data-tile-id="${id}">
      <div class="location-map">${MAP_SVG}</div>
      <div class="location-content">
        <div class="location-pin">${PIN_SVG}</div>
        <div class="location-city"    data-ce-tile-id="${id}" data-ce-field="city">${city}</div>
        ${country ? `<div class="location-country" data-ce-tile-id="${id}" data-ce-field="country">${country}</div>` : ''}
        ${desc    ? `<div class="location-desc"    data-ce-tile-id="${id}" data-ce-field="description">${desc}</div>` : ''}
      </div>
    </div>`;
}

// ── Profile Header tile (custom, template-spawned) ────────────
function renderProfileHeader(tile) {
  const name    = tile.name    || 'Your Name';
  const handle  = tile.handle  || '';
  const tagline = tile.tagline || '';
  const avatarHtml = tile.avatar
    ? `<img src="${tile.avatar}" alt="${name}" />`
    : getInitials(name);
  return `
    <div class="tile tile-profile" data-size="${tile.size}" data-tile-id="${tile.id}">
      <div class="profile-avatar">${avatarHtml}</div>
      <div class="profile-info">
        <div class="profile-name"    data-ce-tile-id="${tile.id}" data-ce-field="name">${name}</div>
        ${handle  ? `<div class="profile-handle"  data-ce-tile-id="${tile.id}" data-ce-field="handle">${handle}</div>`   : ''}
        ${tagline ? `<div class="profile-tagline" data-ce-tile-id="${tile.id}" data-ce-field="tagline">${tagline}</div>` : ''}
      </div>
    </div>`;
}

// ── Contact Card tile (custom, template-spawned) ──────────────
function renderContactCard(tile) {
  const label = tile.label || 'Contact';
  const email = tile.email || '';
  const url   = tile.url   || (email ? 'mailto:' + email : '#');
  return `
    <div class="tile tile-link clickable" data-size="${tile.size}" data-tile-id="${tile.id}"
         onclick="openUrl('${url}')">
      <span class="link-emoji">✉️</span>
      <div class="link-text">
        <div class="link-label" data-ce-tile-id="${tile.id}" data-ce-field="label">${label}</div>
        ${email ? `<div class="link-desc" data-ce-tile-id="${tile.id}" data-ce-field="email">${email}</div>` : ''}
      </div>
      <span class="arrow">↗</span>
    </div>`;
}
