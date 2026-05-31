// ============================================================
//  BLOG — renders post list and individual post pages
// ============================================================

function formatDate(str) {
  const d = new Date(str + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function buildBlogList() {
  const list = document.getElementById('blogList');
  if (!list) return;

  const html = BLOG_POSTS.map(post => `
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
  const post = BLOG_POSTS.find(p => p.id === id);
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
window.buildPost = buildPost;
