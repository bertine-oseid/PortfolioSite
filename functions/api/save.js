// ============================================================
//  POST /api/save — write the portfolio to KV (owner only)
// ============================================================
//
//  Cloudflare Pages runs this file automatically for POST
//  requests to /api/save.
//
//  Cloudflare Access sits in front of this URL and adds a signed
//  token (a JWT) in the Cf-Access-Jwt-Assertion header. This
//  function does not trust that blindly: it checks the token's
//  signature, audience, issuer, expiry and email itself. If any
//  setting is missing or any check fails, nothing is saved.
//
//  SETTINGS (Pages → Settings → Variables and bindings):
//    PORTFOLIO           KV namespace binding
//    ADMIN_EMAIL         the only email allowed to save
//    ACCESS_TEAM_DOMAIN  e.g. "bertine.cloudflareaccess.com"
//    ACCESS_AUD          Access app's "Application Audience (AUD) Tag"
//
//  On success the previous content is kept under the key
//  "content_previous", so one bad save can be undone.
// ============================================================

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

function reply(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type':  'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

// ── base64url → bytes / text ──────────────────────────────────
function b64urlToBytes(str) {
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((str.length + 3) % 4);
  return Uint8Array.from(atob(b64), c => c.charCodeAt(0));
}

function b64urlToJson(str) {
  return JSON.parse(new TextDecoder().decode(b64urlToBytes(str)));
}

// ── Verify a Cloudflare Access JWT ─────────────────────────────
// Returns the token payload if valid, otherwise null.
async function verifyAccessJwt(token, teamDomain, aud) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [headerB64, payloadB64, sigB64] = parts;

    const header = b64urlToJson(headerB64);
    if (header.alg !== 'RS256' || !header.kid) return null;

    // Public keys Access signs with
    const res = await fetch(`https://${teamDomain}/cdn-cgi/access/certs`);
    if (!res.ok) return null;
    const { keys = [] } = await res.json();
    const jwk = keys.find(k => k.kid === header.kid);
    if (!jwk) return null;

    const key = await crypto.subtle.importKey(
      'jwk', jwk,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false, ['verify'],
    );
    const valid = await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5', key,
      b64urlToBytes(sigB64),
      new TextEncoder().encode(`${headerB64}.${payloadB64}`),
    );
    if (!valid) return null;

    const payload = b64urlToJson(payloadB64);
    const now = Math.floor(Date.now() / 1000);
    const auds = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
    if (!auds.includes(aud)) return null;
    if (payload.iss !== `https://${teamDomain}`) return null;
    if (typeof payload.exp !== 'number' || payload.exp < now) return null;
    if (typeof payload.nbf === 'number' && payload.nbf > now + 60) return null;

    return payload;
  } catch {
    return null; // malformed token or unreachable certs
  }
}

export async function onRequestPost({ request, env }) {
  // 1. Fail closed if anything is not set up
  const teamDomain = (env.ACCESS_TEAM_DOMAIN || '').replace(/^https?:\/\//, '').replace(/\/+$/, '');
  if (!env.PORTFOLIO || !env.ADMIN_EMAIL || !teamDomain || !env.ACCESS_AUD) {
    return reply(500, { error: 'Lagring er ikke satt opp ennå' });
  }

  // 2–3. Token from Cloudflare Access, verified
  const token = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!token) return reply(401, { error: 'Ikke logget inn' });

  const payload = await verifyAccessJwt(token, teamDomain, env.ACCESS_AUD);
  if (!payload) return reply(401, { error: 'Ugyldig innlogging' });

  // 4. Only the owner
  const email = String(payload.email || '').toLowerCase();
  if (email !== env.ADMIN_EMAIL.trim().toLowerCase()) {
    return reply(403, { error: 'Ingen tilgang' });
  }

  // 5. Validate body
  const text = await request.text();
  if (new TextEncoder().encode(text).length > MAX_BYTES) {
    return reply(400, { error: 'Innholdet er for stort' });
  }
  let data;
  try { data = JSON.parse(text); }
  catch { return reply(400, { error: 'Ugyldig JSON' }); }
  if (!data || typeof data !== 'object' ||
      !Array.isArray(data.layout?.desktop) || !Array.isArray(data.layout?.mobile)) {
    return reply(400, { error: 'Mangler layout.desktop / layout.mobile' });
  }

  // 6. Keep a backup, then save
  const previous = await env.PORTFOLIO.get('content');
  if (previous) await env.PORTFOLIO.put('content_previous', previous);
  await env.PORTFOLIO.put('content', JSON.stringify(data));

  return reply(200, { ok: true });
}
