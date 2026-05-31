// ============================================================
//  CONFIG — Edit this file to personalise your portfolio
// ============================================================
//
//  HOW LAYOUTS WORK
//  ─────────────────
//  1. Define all your tiles once in the `tiles` array below.
//     Give each one a unique `id`. The `size` here is the
//     fallback — it's only used if you don't set a size in
//     the layout.
//
//  2. In `layouts.desktop` and `layouts.mobile`, list the
//     tile IDs in the ORDER you want them to appear on each
//     format. You can also override the size per-layout.
//
//  3. Any tile NOT listed in a layout is hidden on that format.
//     So you can have desktop-only or mobile-only tiles.
//
//  SIZES:  "1x1"  "2x1" (wide)  "1x2" (tall)  "2x2" (big)
// ============================================================

const CONFIG = {

  // ── Profile ──────────────────────────────────────────────
  name:         "Alex Rivera",
  handle:       "@alexrivera",
  tagline:      "Designer & developer building thoughtful things.",
  avatar:       null,        // e.g. "public/avatar.jpg"  or leave null

  // ── Theme ────────────────────────────────────────────────
  accentColor:  "#f97316",   // any CSS colour
  defaultTheme: "light",     // "light" or "dark"

  // ── Tiles — define ALL tiles here ────────────────────────
  tiles: [

    { id: "profile",
      type: "profile" },

    { id: "twitter",
      type: "social",   label: "Twitter / X",
      handle: "@alexrivera",
      url: "https://x.com/alexrivera",
      platform: "twitter" },

    { id: "github",
      type: "social",   label: "GitHub",
      handle: "alexrivera",
      url: "https://github.com/alexrivera",
      platform: "github" },

    { id: "instagram",
      type: "social",   label: "Instagram",
      handle: "@alex.rivera",
      url: "https://instagram.com/alex.rivera",
      platform: "instagram" },

    { id: "linkedin",
      type: "social",   label: "LinkedIn",
      handle: "Alex Rivera",
      url: "https://linkedin.com/in/alexrivera",
      platform: "linkedin" },

    { id: "resume",
      type: "link",     label: "Resume / CV",
      description: "Download my latest CV",
      url: "#",         emoji: "📄" },

    { id: "quote",
      type: "text",
      content: "Building at the intersection of design and code since 2017.",
      style: "quote" },

    { id: "blog",
      type: "blog-preview", label: "Latest writing" },

    { id: "email",
      type: "link",     label: "Get in touch",
      description: "hello@alexrivera.com",
      url: "mailto:hello@alexrivera.com",
      emoji: "✉️" },

    // ── Video tiles (uncomment to use) ──
    // { id: "video-yt",
    //   type: "video",  label: "My showreel",
    //   src: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    //   url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },

    // { id: "video-local",
    //   type: "video",  label: "Reel 2025",
    //   src: "public/reel.mp4",
    //   poster: "public/reel-poster.jpg",
    //   url: "https://youtube.com/yourfullvideo" },

    // ── Extra socials (uncomment to use) ──
    // { id: "youtube",  type: "social", label: "YouTube",
    //   handle: "@alexrivera", url: "https://youtube.com/@alexrivera", platform: "youtube" },
    // { id: "tiktok",   type: "social", label: "TikTok",
    //   handle: "@alexrivera", url: "https://tiktok.com/@alexrivera", platform: "tiktok" },
    // { id: "dribbble", type: "social", label: "Dribbble",
    //   handle: "alexrivera", url: "https://dribbble.com/alexrivera", platform: "dribbble" },
    // { id: "substack", type: "social", label: "Substack",
    //   handle: "alexrivera", url: "https://alexrivera.substack.com", platform: "substack" },

  ],

  // ── Layouts ──────────────────────────────────────────────
  //
  //  List tile IDs in the order you want them shown.
  //  Optionally override the size with  size: "2x1"  etc.
  //  Tiles missing from a layout are hidden on that format.
  //
  layouts: {

    desktop: [
      // Row 1 — profile spans 2 cols, socials fill the rest
      { id: "profile",   size: "2x1" },
      { id: "twitter",   size: "1x1" },
      { id: "github",    size: "1x1" },
      // Row 2
      { id: "instagram", size: "1x1" },
      { id: "linkedin",  size: "1x1" },
      { id: "resume",    size: "2x1" },
      // Row 3
      { id: "quote",     size: "2x1" },
      { id: "blog",      size: "2x1" },
      // Row 4
      { id: "email",     size: "1x1" },
      // video-yt: { id: "video-yt", size: "2x2" },
    ],

    mobile: [
      // On mobile the profile is full-width (2 cols = full width on 2-col grid)
      { id: "profile",   size: "2x1" },
      // Show the quote right away — sets the tone
      { id: "quote",     size: "2x1" },
      // Social row
      { id: "instagram", size: "1x1" },
      { id: "twitter",   size: "1x1" },
      // Blog prominent on mobile
      { id: "blog",      size: "2x1" },
      // Remaining socials
      { id: "github",    size: "1x1" },
      { id: "linkedin",  size: "1x1" },
      // Contact last
      { id: "email",     size: "1x1" },
      { id: "resume",    size: "1x1" },
      // resume is hidden on desktop's bottom row but shown here as 1x1
    ],

  },

};
