// ============================================================
//  CONFIG — Edit this file to personalise your portfolio
// ============================================================
//
//  BILINGUAL SUPPORT (NO / EN)
//  ────────────────────────────
//  All translatable text lives inside CONFIG.languages.no and
//  CONFIG.languages.en. Shared settings (URLs, theme, layouts)
//  stay at the top level and are language-independent.
//
//  To edit content per language, update the relevant block in
//  CONFIG.languages. You can also override text at runtime via
//  the admin edit mode (?admin=1) — changes are stored in
//  localStorage and will prompt you to sync to the other language.
//
//  HOW LAYOUTS WORK
//  ─────────────────
//  1. Define all your tiles once in the `tiles` array below.
//  2. In `layouts.desktop` and `layouts.mobile`, list tile IDs
//     in the ORDER you want them shown. You can override size
//     per-layout.
//  3. Any tile NOT listed in a layout is hidden on that format.
//
//  SIZES:  "1x1"  "2x1" (wide)  "1x2" (tall)  "2x2" (big)
// ============================================================

const CONFIG = {

  // ── Shared settings (language-independent) ────────────────
  avatar:       null,          // e.g. "public/avatar.jpg" or null
  accentColor:  "#f97316",     // any CSS colour
  defaultTheme: "light",       // "light" or "dark"
  defaultLang:  "no",          // "no" or "en"

  // ── Per-language content ──────────────────────────────────
  languages: {

    no: {
      // Profile
      name:    "Alex Rivera",
      handle:  "@alexrivera",
      tagline: "Designer og utvikler som bygger gjennomtenkte ting.",

      // Nav + UI strings
      nav: {
        home: "Hjem",
        blog: "Blogg",
      },
      backBtn:       "← Tilbake til skriving",
      blogTitle:     "Skriving",
      blogSubtitle:  "Tanker, essays og notater",

      // Per-tile text overrides (keyed by tile id)
      tiles: {
        quote:    { content: "Bygger i krysningspunktet mellom design og kode siden 2017." },
        blog:     { label: "Siste innlegg" },
        email:    { label: "Ta kontakt",  description: "hello@alexrivera.com" },
        resume:   { label: "CV",          description: "Last ned min siste CV" },
        twitter:  { label: "Twitter / X" },
        github:   { label: "GitHub" },
        instagram:{ label: "Instagram" },
        linkedin: { label: "LinkedIn" },
      },
    },

    en: {
      // Profile
      name:    "Alex Rivera",
      handle:  "@alexrivera",
      tagline: "Designer & developer building thoughtful things.",

      // Nav + UI strings
      nav: {
        home: "Home",
        blog: "Blog",
      },
      backBtn:       "← Back to writing",
      blogTitle:     "Writing",
      blogSubtitle:  "Thoughts, essays, and notes",

      // Per-tile text overrides (keyed by tile id)
      tiles: {
        quote:    { content: "Building at the intersection of design and code since 2017." },
        blog:     { label: "Latest writing" },
        email:    { label: "Get in touch",   description: "hello@alexrivera.com" },
        resume:   { label: "Resume / CV",    description: "Download my latest CV" },
        twitter:  { label: "Twitter / X" },
        github:   { label: "GitHub" },
        instagram:{ label: "Instagram" },
        linkedin: { label: "LinkedIn" },
      },
    },

  },

  // ── Tiles — shared (non-translatable) data ────────────────
  tiles: [

    { id: "profile",
      type: "profile" },

    { id: "twitter",
      type: "social",
      handle: "@alexrivera",
      url: "https://x.com/alexrivera",
      platform: "twitter" },

    { id: "github",
      type: "social",
      handle: "alexrivera",
      url: "https://github.com/alexrivera",
      platform: "github" },

    { id: "instagram",
      type: "social",
      handle: "@alex.rivera",
      url: "https://instagram.com/alex.rivera",
      platform: "instagram" },

    { id: "linkedin",
      type: "social",
      handle: "Alex Rivera",
      url: "https://linkedin.com/in/alexrivera",
      platform: "linkedin" },

    { id: "resume",
      type: "link",
      url: "#",
      emoji: "📄" },

    { id: "quote",
      type: "text",
      style: "quote" },

    { id: "blog",
      type: "blog-preview" },

    { id: "email",
      type: "link",
      url: "mailto:hello@alexrivera.com",
      emoji: "✉️" },

    // ── Video tiles (uncomment to use) ──
    // { id: "video-yt",
    //   type: "video",  label: "My showreel",
    //   src: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    //   url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },

    // ── Extra socials (uncomment to use) ──
    // { id: "youtube",   type: "social", handle: "@alexrivera", url: "https://youtube.com/@alexrivera",    platform: "youtube" },
    // { id: "tiktok",    type: "social", handle: "@alexrivera", url: "https://tiktok.com/@alexrivera",     platform: "tiktok" },
    // { id: "dribbble",  type: "social", handle: "alexrivera",  url: "https://dribbble.com/alexrivera",    platform: "dribbble" },
    // { id: "substack",  type: "social", handle: "alexrivera",  url: "https://alexrivera.substack.com",    platform: "substack" },

  ],

  // ── Layouts ───────────────────────────────────────────────
  layouts: {

    desktop: [
      { id: "profile",   size: "2x1" },
      { id: "twitter",   size: "1x1" },
      { id: "github",    size: "1x1" },
      { id: "instagram", size: "1x1" },
      { id: "linkedin",  size: "1x1" },
      { id: "resume",    size: "2x1" },
      { id: "quote",     size: "2x1" },
      { id: "blog",      size: "2x1" },
      { id: "email",     size: "1x1" },
    ],

    mobile: [
      { id: "profile",   size: "2x1" },
      { id: "quote",     size: "2x1" },
      { id: "instagram", size: "1x1" },
      { id: "twitter",   size: "1x1" },
      { id: "blog",      size: "2x1" },
      { id: "github",    size: "1x1" },
      { id: "linkedin",  size: "1x1" },
      { id: "email",     size: "1x1" },
      { id: "resume",    size: "1x1" },
    ],

  },

};
