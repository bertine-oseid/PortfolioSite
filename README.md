# 🍱 Bento Portfolio

A bento-style personal portfolio you fully own. No subscriptions, no lock-in. Deploy to Vercel free tier in under 5 minutes.

**Features**
- Bento grid of tiles: profile, social links, custom links, quotes
- Built-in blog with Markdown support
- Light/dark mode
- Fully static — no backend, no database, no costs

---

## 🚀 Deploy to Vercel (free)

### Option A — Deploy from GitHub (recommended)

1. Push this folder to a new GitHub repo
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repo
4. Click **Deploy** — that's it

Vercel auto-deploys on every push to `main`.

### Option B — Deploy via Vercel CLI

```bash
npm i -g vercel
cd bento-portfolio
vercel
```

---

## ✏️ Customise your site

### 1. Edit your profile & tiles
Open `src/data/config.js` and update:
- `name`, `handle`, `tagline`, `avatar`
- `accentColor` — any CSS colour value
- `tiles` array — add, remove, or reorder tiles

### 2. Write blog posts
Open `src/data/blog-posts.js` and add to the `BLOG_POSTS` array:

```js
{
  id: "my-post-slug",          // URL slug — no spaces
  title: "My Post Title",
  date: "2025-06-01",          // YYYY-MM-DD
  tags: ["design", "code"],
  excerpt: "One sentence summary shown in the list.",
  body: `
# My Post Title

Write in **Markdown** here. Headers, lists, links all work.
  `,
},
```

### 3. Add social platforms
In `config.js`, uncomment or add a tile:

```js
{
  id: "bluesky",
  type: "social",
  label: "Bluesky",
  handle: "@you.bsky.social",
  url: "https://bsky.app/profile/you.bsky.social",
  platform: "bluesky",   // controls icon colour
  size: "1x1",
},
```

Supported `platform` values with built-in icons:
`twitter` · `github` · `instagram` · `linkedin` · `youtube` · `tiktok` · `dribbble` · `substack`

For anything else, add a custom SVG icon to `PLATFORM_ICONS` in `src/components/grid.js`.

---

## 📐 Tile sizes

| size  | grid columns | grid rows |
|-------|-------------|-----------|
| `1x1` | 1           | 1         |
| `2x1` | 2           | 1 (wide)  |
| `1x2` | 1           | 2 (tall)  |
| `2x2` | 2           | 2 (large) |

---

## 🗂 Project structure

```
bento-portfolio/
├── index.html              ← entry point
├── vercel.json             ← Vercel config (do not edit)
├── public/                 ← static assets (put your avatar here)
└── src/
    ├── data/
    │   ├── config.js       ← ✏️ your profile & tiles
    │   └── blog-posts.js   ← ✏️ your blog posts
    ├── styles/
    │   └── main.css        ← styles (edit carefully)
    ├── components/
    │   ├── grid.js         ← renders bento tiles
    │   └── blog.js         ← renders blog list & posts
    └── app.js              ← routing & theme
```

---

## 💡 Tips

- **Custom domain**: Add it in Vercel Project Settings → Domains. Free on all plans.
- **Analytics**: Add Vercel Analytics (free tier) — one line in `index.html`.
- **Avatar**: Put a photo at `public/avatar.jpg` and set `avatar: "public/avatar.jpg"` in config.
- **OG image**: Add `<meta property="og:image" content="...">` in `index.html` for link previews.

---

MIT License — fork freely, no attribution required.
