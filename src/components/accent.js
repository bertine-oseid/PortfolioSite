// ============================================================
//  ACCENT — the site's accent colour
// ============================================================
//
//  One colour for both light and dark mode. Which one applies:
//    Edit Mode : the colour being edited (localStorage) → saved → default
//    Visitors  : the saved colour (KV / data.json) → default
//
//  Also picks a readable text colour for accent backgrounds
//  (--on-accent) and checks WCAG contrast against the page
//  backgrounds, so the picker can warn about hard-to-read text.
// ============================================================

(function () {

  const DEFAULT = '#f97316';
  const LS_KEY  = 'portfolio_accent';

  // Page and card backgrounds — mirror :root and [data-theme="dark"]
  // in main.css. Text in the accent colour sits on both.
  const BACKGROUNDS = {
    light: ['#f5f6f8', '#ffffff'],
    dark:  ['#111110', '#1c1c1b'],
  };
  const MIN_CONTRAST = 4.5; // WCAG AA, normal text

  // "#abc", "abc", "#aabbcc" or "aabbcc" → "#aabbcc"; anything else → null
  function normalize(value) {
    const m = String(value || '').trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (!m) return null;
    let hex = m[1].toLowerCase();
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    return '#' + hex;
  }

  // WCAG relative luminance
  function luminance(hex) {
    const n = parseInt(hex.slice(1), 16);
    const lin = c => {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * lin(n >> 16) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
  }

  function contrast(a, b) {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  }

  // White or near-black, whichever is easier to read on the accent
  function textOn(hex) {
    return contrast(hex, '#ffffff') >= contrast(hex, '#1a1a1a') ? '#ffffff' : '#1a1a1a';
  }

  // Lowest contrast per mode, and whether it passes
  function check(hex) {
    const result = {};
    for (const mode of ['light', 'dark']) {
      const ratio = Math.min(...BACKGROUNDS[mode].map(bg => contrast(hex, bg)));
      result[mode] = { ratio, ok: ratio >= MIN_CONTRAST };
    }
    return result;
  }

  function defaultColor() {
    return normalize(window.CONFIG?.accentColor) || DEFAULT;
  }

  function saved() {
    return normalize(window.Store?.savedAccent?.());
  }

  function current() {
    if (window.I18N?.isAdminMode?.()) {
      let edited = null;
      try { edited = normalize(localStorage.getItem(LS_KEY)); } catch {}
      if (edited) return edited;
    }
    return saved() || defaultColor();
  }

  function apply(hex) {
    const color = normalize(hex) || defaultColor();
    const text  = textOn(color);
    const root  = document.documentElement.style;
    root.setProperty('--accent', color);
    root.setProperty('--on-accent', text);
    // Hover shade moves away from the text colour, so it stays readable
    root.setProperty('--accent-dark',
      `color-mix(in srgb, ${color} 78%, ${text === '#ffffff' ? '#000' : '#fff'})`);
    return color;
  }

  function applyCurrent() { return apply(current()); }

  // Edit Mode: remember the picked colour (saved to KV with Lagre)
  function setEdited(hex) {
    const color = normalize(hex);
    if (!color) return null;
    try { localStorage.setItem(LS_KEY, color); } catch {}
    return apply(color);
  }

  window.Accent = {
    DEFAULT, LS_KEY, MIN_CONTRAST,
    normalize, contrast, textOn, check,
    defaultColor, current, apply, applyCurrent, setEdited,
  };

})();
