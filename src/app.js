// ============================================================
//  APP — routing, theme, layout switching, initialisation
// ============================================================

// ── Theme ────────────────────────────────────────────────────
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

// ── Layout switching (desktop / mobile) ──────────────────────
//   Uses the layouts defined in CONFIG.layouts.
//   Switches at 700 px — the same breakpoint as the CSS grid.

let activeLayout = null;

function getLayoutName() {
  // __previewWidth is set by preview.html when toggling layouts
  const w = window.__previewWidth || window.innerWidth;
  return w <= 700 ? 'mobile' : 'desktop';
}

function applyLayout(force) {
  const name = getLayoutName();
  if (name === activeLayout && !force) return;   // nothing changed
  activeLayout = name;

  const layout  = (CONFIG.layouts && CONFIG.layouts[name]) || null;
  const tileMap = {};
  CONFIG.tiles.forEach(t => { tileMap[t.id] = t; });

  // Build the ordered list of tiles for this layout
  let orderedTiles;
  if (layout) {
    orderedTiles = layout
      .map(entry => {
        const tile = tileMap[entry.id];
        if (!tile) return null;
        // Merge layout-level size override onto a copy of the tile
        return Object.assign({}, tile, { size: entry.size || tile.size || '1x1' });
      })
      .filter(Boolean);
  } else {
    // No layouts defined — fall back to tiles array as-is
    orderedTiles = CONFIG.tiles.map(t =>
      Object.assign({}, t, { size: t.size || '1x1' })
    );
  }

  buildGrid(orderedTiles);
}

// Re-evaluate on resize (debounced so it doesn't fire 100x)
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(applyLayout, 120);
});

// ── Router ───────────────────────────────────────────────────
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
  if (!e.state)                         { navigateTo('grid'); return; }
  if (e.state.page === 'post')          navigateToPost(e.state.postId);
  else                                  navigateTo(e.state.page || 'grid');
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

// ── Init ──────────────────────────────────────────────────────
applyLayout();          // renders the correct layout for current screen size
handleInitialHash();
