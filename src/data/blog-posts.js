// ============================================================
//  BLOG POSTS — Add or edit posts here
//  Each post uses Markdown in the `body` field
// ============================================================

const BLOG_POSTS = [
  {
    id: "hello-world",
    title: "Hello, world — why I built this site",
    date: "2025-05-01",
    tags: ["personal", "design"],
    excerpt: "Every personal site is an act of deciding who you are on the internet. Here's mine.",
    body: `
# Hello, world

Every personal site is a small act of deciding who you are on the internet.

I've had a few incarnations — a Squarespace page, a sparse GitHub profile, a Notion doc someone once called "charming but hard to navigate." This one feels right.

## Why bento?

The grid layout reflects how I actually think: in parallel, with lots of context switching. A social link lives next to a blog post lives next to a quote. That's the honest version of a professional identity.

## What you'll find here

- **Links** to the places I'm active online
- **Writing** — occasional essays and notes (this is one)
- **Work** — eventually a proper projects section

Thanks for stopping by. If you want to say hello, the email tile is right there on the home page.
    `,
  },
  {
    id: "design-in-public",
    title: "On designing in public",
    date: "2025-04-18",
    tags: ["design", "process"],
    excerpt: "Sharing unfinished work is uncomfortable. It's also the fastest way to get better.",
    body: `
# On designing in public

Sharing unfinished work is uncomfortable. Your wireframe is a mess. Your type pairing is wrong. The spacing is off. You *know* it's not ready.

But here's the thing: waiting for ready is how good work disappears forever.

## The discomfort is the point

When you design privately, you're the only judge. You apply your own standards — which are almost always either too harsh or too lenient, depending on the day. You never get the recalibration that comes from an outside perspective.

Public work is judged by strangers. That's uncomfortable. It's also *precise* feedback that your internal critic can never give you.

## A practice, not a performance

The shift I had to make: stop thinking of public design as performance (look what I made) and start thinking of it as practice (here's what I'm working through).

A quick Figma screenshot with "figuring out the navigation for a client project — not sold on the hierarchy yet" invites collaboration. A polished Dribbble shot invites likes.

Both have their place. But if you want to actually get better, practice beats performance.
    `,
  },
  {
    id: "tools-2025",
    title: "The tools I'm using in 2025",
    date: "2025-03-30",
    tags: ["tools", "productivity"],
    excerpt: "A snapshot of my current stack — design, writing, development, and the stuff in between.",
    body: `
# The tools I'm using in 2025

A snapshot of the stack that currently runs my work life.

## Design
- **Figma** — still the standard for UI/UX. The Dev Mode improvements finally made handoff bearable.
- **Framer** — for interactive prototypes and this site's original inspiration.

## Development
- **VS Code** — nothing has unseated it for me despite trying Cursor for a month.
- **Vercel** — deploying here is genuinely magical. Push to main, it's live.
- **GitHub** — obviously.

## Writing
- **Obsidian** — the linked notes graph actually does what it promises once you stop fighting it.
- **iA Writer** — for longer drafts where I need to disappear from distraction.

## Productivity
- **Linear** — even for solo projects. The keyboard shortcuts alone justify it.
- **Raycast** — replaced Spotlight so completely I forget macOS has its own search.

---

Nothing here is particularly surprising. The tools that work are the ones you actually use.
    `,
  },
];
