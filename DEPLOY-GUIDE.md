# How to get your portfolio live — beginner guide

This guide takes you from a zip file to a live website at a real URL,
completely free. No experience needed.

---

## What you'll be using

| Tool | What it is | Cost |
|------|-----------|------|
| **VS Code** | A free app for editing your files | Free |
| **GitHub** | A website that stores your code online | Free |
| **Vercel** | A website that turns your GitHub code into a live site | Free |

Think of it like this: VS Code is where you write, GitHub is where you save,
and Vercel is where you publish.

---

## Step 1 — Install VS Code

VS Code is just a text editor — like Notepad, but smarter. You'll use it
to edit your name, links, and blog posts.

1. Go to **https://code.visualstudio.com**
2. Click the big **Download** button (it detects your computer automatically)
3. Open the downloaded file and install it like any normal app
4. Open VS Code — you'll see a welcome screen, ignore it for now

---

## Step 2 — Unzip and open your portfolio folder

1. Find the **bento-portfolio.zip** file you downloaded
2. Double-click it to unzip it — you'll get a folder called `bento-portfolio`
3. Move that folder somewhere easy to find, like your Desktop
4. In VS Code, click **File → Open Folder**
5. Select the `bento-portfolio` folder and click Open

You'll see a list of files on the left side of VS Code. That's your site.

---

## Step 3 — Personalise your site

You only need to edit **two files**. Everything else can stay as-is.

### File 1 — `src/data/config.js`

This controls your name, social links, accent colour, and tile layout.

Click on `src` → `data` → `config.js` in the left panel.

**Change your name and handle:**
```
name:   "Alex Rivera",      ← replace with your name
handle: "@alexrivera",      ← replace with your @handle
tagline: "Designer & developer building thoughtful things.",  ← your one-liner
```

**Change your social links:**
Find the tile for each platform and replace the URL and handle:
```
url: "https://x.com/alexrivera",     ← replace with your actual URL
handle: "@alexrivera",               ← replace with your handle
```

**Change your accent colour:**
```
accentColor: "#f97316",   ← this is orange. Try "#3b82f6" for blue,
                             "#10b981" for green, "#8b5cf6" for purple
```

**Rearrange tiles for desktop vs mobile:**
Scroll down to the `layouts` section. You'll see two lists: `desktop` and
`mobile`. Each list controls the order tiles appear on that format.

To move a tile, cut its line and paste it somewhere else in the list.
To hide a tile on mobile but show it on desktop, simply remove it from
the `mobile` list (leave it in `desktop`).

### File 2 — `src/data/blog-posts.js`

This is where your blog posts live. Each post looks like this:

```
{
  id: "my-first-post",           ← no spaces, use dashes
  title: "My first post",
  date: "2025-06-01",            ← year-month-day format
  tags: ["personal"],
  excerpt: "One sentence shown in the list.",
  body: `
# My first post

Write your post here in normal text.
Use a # at the start of a line for a heading.
  `,
},
```

To add a new post, copy one of the existing ones, paste it at the top of
the list (before the first `{`), and fill in your content.

**Save your changes:** Press `Ctrl+S` (Windows) or `Cmd+S` (Mac) after editing.

---

## Step 4 — Create a GitHub account

GitHub is where your code lives online. Vercel reads from GitHub to build
your site.

1. Go to **https://github.com** and click **Sign up**
2. Enter your email, create a password, and choose a username
   (this username appears in your site URL, so pick something sensible)
3. Verify your email when GitHub sends you a confirmation

---

## Step 5 — Install GitHub Desktop

GitHub Desktop is a simple app that uploads your files to GitHub without
needing to type any commands.

1. Go to **https://desktop.github.com**
2. Download and install it
3. Open GitHub Desktop and sign in with your GitHub account

---

## Step 6 — Upload your folder to GitHub

1. In GitHub Desktop, click **File → Add Local Repository**
2. Click **Choose...** and select your `bento-portfolio` folder
3. It will say "This directory does not appear to be a Git repository" —
   click **create a repository** instead
4. Name it `bento-portfolio` (or anything you like)
5. Leave everything else as default and click **Create Repository**
6. Click **Publish repository** (top right)
7. Make sure **Keep this code private** is unchecked (Vercel needs to read it)
8. Click **Publish Repository**

Your files are now on GitHub. You can visit `github.com/yourusername/bento-portfolio`
to see them.

---

## Step 7 — Create a Vercel account

1. Go to **https://vercel.com**
2. Click **Sign Up**
3. Choose **Continue with GitHub** — this links your accounts automatically

---

## Step 8 — Deploy your site on Vercel

1. Once logged into Vercel, click **Add New → Project**
2. You'll see your GitHub repositories listed — click **Import** next to
   `bento-portfolio`
3. On the next screen, don't change anything — just click **Deploy**
4. Vercel will build your site (takes about 30 seconds)
5. When it says **Congratulations!** your site is live

Vercel gives you a free URL like `bento-portfolio-yourusername.vercel.app`.
Click **Visit** to see your live site.

---

## Step 9 — Making changes after launch

Every time you want to update your site (change a link, add a blog post,
rearrange tiles), the process is:

1. Edit the file in VS Code
2. Save with `Ctrl+S` / `Cmd+S`
3. Open GitHub Desktop
4. You'll see your changed files listed — type a short note in the
   **Summary** box at the bottom (e.g. "updated Instagram link")
5. Click **Commit to main**
6. Click **Push origin** (top right)

Vercel detects the change automatically and rebuilds your site in about
30 seconds. No further action needed.

---

## Step 10 — Optional: Add a custom domain

If you want `yourname.com` instead of a Vercel URL:

1. Buy a domain from any registrar (Namecheap, Squarespace Domains,
   Google Domains — usually £10–15/year)
2. In Vercel, go to your project → **Settings → Domains**
3. Type your domain and click **Add**
4. Vercel shows you two DNS records to copy
5. Log into your domain registrar, find **DNS settings**, and paste them in
6. Wait up to 24 hours — usually works within an hour

The Vercel hosting itself remains free even with a custom domain.

---

## Quick reference — which file controls what

| What you want to change | File to edit |
|------------------------|-------------|
| Your name, handle, tagline | `src/data/config.js` |
| Social media links | `src/data/config.js` |
| Accent colour | `src/data/config.js` |
| Tile order on desktop | `src/data/config.js` → `layouts.desktop` |
| Tile order on mobile | `src/data/config.js` → `layouts.mobile` |
| Blog posts | `src/data/blog-posts.js` |
| Fonts, spacing (advanced) | `src/styles/main.css` |

---

## If something looks wrong

- **Site not updating?** Wait 60 seconds, then hard-refresh:
  `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- **Tiles in wrong order?** Check `config.js` — make sure each tile `id`
  in the `layouts` section exactly matches an `id` in the `tiles` array
- **Blog post not showing?** Make sure there's a comma after the closing `}`
  of every post except the last one
- **Vercel build failed?** Go to Vercel → your project → **Deployments**,
  click the failed deployment, and read the error — it usually says exactly
  which file has a problem

---

You're done. Your portfolio is live.
