// ============================================================
//  ACCENT — the site's accent colour
// ============================================================
//
//  One colour for both light and dark mode. Which one applies:
//    Edit Mode : the colour being edited (localStorage) → saved → default
//    Visitors  : the saved colour (KV / data.json) → default
//
//  Also picks a readable text colour for accent backgrounds
//  (--on-accent), makes a small-text variant of the accent per
//  mode (--accent-text-light / --accent-text-dark) that reaches
//  4.5:1, and checks the accent itself against 3:1 (buttons,
//  large areas) so the picker can warn when it's hard to see.
// ============================================================

(function () {

  const DEFAULT = '#f97316';
  const LS_KEY  = 'portfolio_accent';

  // Page and card backgrounds — mirror :root and [data-theme="dark"]
  // in main.css. The accent sits on both.
  const BACKGROUNDS = {
    light: ['#f5f6f8', '#ffffff'],
    dark:  ['#111110', '#1c1c1b'],
  };
  // --accent-light tint per mode (mirrors main.css): small accent
  // text such as blog tags sits on it
  const TINT = { light: ['#ffffff', 0.08], dark: ['#111110', 0.12] };

  const MIN_CONTRAST  = 3;   // WCAG AA, large text and UI components
  const TEXT_CONTRAST = 4.5; // WCAG AA, normal text

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

  const toRgb = hex => { const n = parseInt(hex.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
  const toHex = rgb => '#' + rgb.map(c => Math.round(c).toString(16).padStart(2, '0')).join('');

  // Same as CSS color-mix(in srgb, a (1-t), b t)
  function mix(a, b, t) {
    const x = toRgb(a), y = toRgb(b);
    return toHex(x.map((c, i) => c + (y[i] - c) * t));
  }

  function contrast(a, b) {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  }

  // White or near-black, whichever is easier to read on the accent
  function textOn(hex) {
    return contrast(hex, '#ffffff') >= contrast(hex, '#1a1a1a') ? '#ffffff' : '#1a1a1a';
  }

  // The accent, darkened (light mode) or lightened (dark mode) just
  // enough to reach 4.5:1 as small text on that mode's backgrounds.
  // Unchanged when it already passes.
  function textVariant(hex, mode) {
    const [tintBase, amount] = TINT[mode];
    const bgs = [...BACKGROUNDS[mode], mix(tintBase, hex, amount)];
    const toward = mode === 'light' ? '#000000' : '#ffffff';
    for (let t = 0; t <= 1; t += 0.02) {
      const candidate = mix(hex, toward, t);
      if (Math.min(...bgs.map(bg => contrast(candidate, bg))) >= TEXT_CONTRAST) return candidate;
    }
    return toward;
  }

  // Lowest contrast per mode, and whether it passes 3:1
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
    root.setProperty('--accent-text-light', textVariant(color, 'light'));
    root.setProperty('--accent-text-dark',  textVariant(color, 'dark'));
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
    DEFAULT, LS_KEY, MIN_CONTRAST, TEXT_CONTRAST,
    normalize, contrast, textOn, textVariant, check,
    defaultColor, current, apply, applyCurrent, setEdited,
  };

})();
