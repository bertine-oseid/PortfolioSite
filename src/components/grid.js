// ============================================================
//  GRID — renders bento tiles from CONFIG.tiles
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
};

function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
}

function formatDate(str) {
  const d = new Date(str + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function renderProfile(tile) {
  const avatarHtml = CONFIG.avatar
    ? `<img src="${CONFIG.avatar}" alt="${CONFIG.name}" />`
    : getInitials(CONFIG.name);

  return `
    <div class="tile tile-profile" data-size="${tile.size}">
      <div class="profile-avatar">${avatarHtml}</div>
      <div class="profile-info">
        <div class="profile-name">${CONFIG.name}</div>
        <div class="profile-handle">${CONFIG.handle}</div>
        <div class="profile-tagline">${CONFIG.tagline}</div>
      </div>
    </div>`;
}

function renderSocial(tile) {
  const icon = PLATFORM_ICONS[tile.platform] || '🔗';
  return `
    <div class="tile tile-social clickable" data-size="${tile.size}" data-platform="${tile.platform}"
         onclick="openUrl('${tile.url}')">
      <div class="platform-icon">${icon}</div>
      <div class="platform-name">${tile.label}</div>
      <div class="platform-handle">${tile.handle}</div>
      <span class="arrow">↗</span>
    </div>`;
}

function renderLink(tile) {
  const wide = tile.size === '2x1';
  return `
    <div class="tile tile-link${wide ? ' wide' : ''} clickable" data-size="${tile.size}"
         onclick="openUrl('${tile.url}')">
      <span class="link-emoji">${tile.emoji || '🔗'}</span>
      <div class="link-text">
        <div class="link-label">${tile.label}</div>
        ${tile.description ? `<div class="link-desc">${tile.description}</div>` : ''}
      </div>
      <span class="arrow">↗</span>
    </div>`;
}

function renderText(tile) {
  const isQuote = tile.style === 'quote';
  return `
    <div class="tile tile-text${isQuote ? ' quote-style' : ''}" data-size="${tile.size}">
      <p class="tile-text-content">${tile.content}</p>
    </div>`;
}

function renderBlogPreview(tile) {
  const posts = BLOG_POSTS.slice(0,3);
  const postsHtml = posts.map(p => `
    <div class="blog-tile-post" onclick="navigateToPost('${p.id}')">
      <div class="blog-tile-post-title">${p.title}</div>
      <div class="blog-tile-post-date">${formatDate(p.date)}</div>
    </div>`).join('');
  return `
    <div class="tile tile-blog-preview clickable" data-size="${tile.size}" onclick="navigateTo('blog')">
      <div class="blog-tile-label">Latest writing</div>
      <div class="blog-tile-posts">${postsHtml}</div>
    </div>`;
}

function buildGrid(orderedTiles) {
  const grid = document.getElementById('bentoGrid');
  if (!grid) return;

  // Apply accent color from config
  document.documentElement.style.setProperty('--accent', CONFIG.accentColor || '#f97316');

  const tiles = orderedTiles || CONFIG.tiles;
  const html = tiles.map(tile => {
    switch(tile.type) {
      case 'profile':      return renderProfile(tile);
      case 'social':       return renderSocial(tile);
      case 'link':         return renderLink(tile);
      case 'text':         return renderText(tile);
      case 'blog-preview': return renderBlogPreview(tile);
      case 'video':        return renderVideo(tile);
      default: return '';
    }
  }).join('');

  grid.innerHTML = html;
}

function openUrl(url) {
  if (!url || url === '#') return;
  window.open(url, '_blank', 'noopener');
}

window.openUrl = openUrl;
window.buildGrid = buildGrid;

// ---- VIDEO TILE ----
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

  if (embedUrl) {
    return `
      <div class="tile tile-video" data-size="${tile.size}" data-embed="true">
        <div class="video-embed-wrap">
          <iframe src="${embedUrl}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy" title="${label || 'Video'}"></iframe>
        </div>
        <div class="video-overlay-bar"><span class="video-label">${label}</span>${linkBtn}</div>
      </div>`;
  }

  const src = tile.src || '';
  const ext = src.split('.').pop() || 'mp4';
  const poster = tile.poster ? `poster="${tile.poster}"` : '';
  const id = 'vid_' + Math.random().toString(36).slice(2,8);
  return `
    <div class="tile tile-video" data-size="${tile.size}" data-embed="false" onclick="toggleVideo('${id}')">
      <video id="${id}" class="video-el" ${poster} muted loop playsinline preload="metadata"><source src="${src}" type="video/${ext}"></video>
      <div class="video-play-overlay" id="ov_${id}">
        <div class="video-play-btn" aria-label="Play video"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21"/></svg></div>
      </div>
      <div class="video-overlay-bar"><span class="video-label">${label}</span>${linkBtn}</div>
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
