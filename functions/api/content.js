// ============================================================
//  GET /api/content — public read of the saved portfolio
// ============================================================
//
//  Cloudflare Pages runs this file automatically for requests to
//  /api/content (the folder path becomes the URL).
//
//  Reads the key "content" from the KV namespace bound as
//  PORTFOLIO. If the binding is missing or the key is empty, it
//  answers 404 and the site falls back to data.json.
// ============================================================

export async function onRequestGet({ env }) {
  const headers = {
    'Content-Type':  'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  };

  if (!env.PORTFOLIO) {
    return new Response(JSON.stringify({ error: 'KV not bound' }), { status: 404, headers });
  }

  const content = await env.PORTFOLIO.get('content');
  if (!content) {
    return new Response(JSON.stringify({ error: 'empty' }), { status: 404, headers });
  }

  return new Response(content, { status: 200, headers });
}
