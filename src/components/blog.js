// ============================================================
//  BLOG — renders post list and individual post pages
//  Uses I18N.currentPosts() so content reflects active language.
// ============================================================

function formatDate(str) {
  const lang   = I18N.activeLang();
  const locale = lang === 'no' ? 'nb-NO' : 'en-GB';
  const d = new Date(str + 'T00:00:00');
  return d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
}

function buildBlogList() {
  const list = document.getElementById('blogList');
  if (!list) return;

  const posts = I18N.currentPosts();

  const html = posts.map(post => `
    <article class="blog-card" onclick="navigateToPost('${post.id}')">
      <div class="blog-card-meta">
        <span class="blog-card-date">${formatDate(post.date)}</span>
        <div class="blog-card-tags">
          ${(post.tags || []).map(t => `<span class="blog-card-tag">${t}</span>`).join('')}
        </div>
      </div>
      <h2 class="blog-card-title">${post.title}</h2>
      <p class="blog-card-excerpt">${post.excerpt}</p>
    </article>
  `).join('');

  list.innerHTML = html;
}

function buildPost(id) {
  const posts = I18N.currentPosts();
  const post  = posts.find(p => p.id === id);
  if (!post) return;

  const content = document.getElementById('postContent');
  if (!content) return;

  const tagsHtml = (post.tags || []).map(t =>
    `<span class="blog-card-tag">${t}</span>`
  ).join('');

  const body = typeof marked !== 'undefined'
    ? marked.parse(post.body.trim())
    : post.body.replace(/\n/g, '<br>');

  content.innerHTML = `
    <div class="post-meta">
      <span>${formatDate(post.date)}</span>
      <div class="blog-card-tags">${tagsHtml}</div>
    </div>
    ${body}
  `;
}

window.buildBlogList = buildBlogList;
window.buildPost     = buildPost;
