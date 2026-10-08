/**
 * Vercel Routing Middleware — Rate Limiter
 *
 * Protects against per-IP request floods (scraping, hammering, spam).
 * Note: Vercel already absorbs volumetric DDoS at the network level;
 * this middleware adds application-layer rate limiting on top.
 *
 * Limit: 100 requests / IP / 60s sliding-ish window.
 * Storage is in-memory per edge instance — approximate, zero-dependency.
 *
 * IMPORTANT: Must return `next()` from @vercel/functions to continue
 * to the static site. Returning `fetch(request)` re-enters middleware
 * and causes Vercel's INFINITE_LOOP_DETECTED (508) error.
 */

import { next } from '@vercel/functions'

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 100; // max requests per IP per window
const MAX_TRACKED_IPS = 5_000; // memory guard

/** @type {Map<string, { start: number, count: number }>} */
const hits = new Map();

function getClientIp(request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    request.headers.get('x-vercel-forwarded-for') ||
    'unknown'
  );
}

function cleanup(now) {
  for (const [ip, entry] of hits) {
    if (now - entry.start > WINDOW_MS) hits.delete(ip);
  }
}

function isRateLimited(ip, now) {
  const entry = hits.get(ip);

  if (!entry || now - entry.start > WINDOW_MS) {
    // Evict old entries only when the table gets large
    if (hits.size >= MAX_TRACKED_IPS) cleanup(now);
    hits.set(ip, { start: now, count: 1 });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_REQUESTS;
}

export default function middleware(request) {
  const ip = getClientIp(request);
  const now = Date.now();

  if (isRateLimited(ip, now)) {
    return new Response('Too Many Requests', {
      status: 429,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Retry-After': '60',
        'X-RateLimit-Limit': String(MAX_REQUESTS),
        'X-RateLimit-Remaining': '0',
      },
    });
  }

  // Continue to the static site — do NOT use fetch(request) (causes 508 loop)
  return next();
}

export const config = {
  // Only run on page navigations (paths without file extension).
  // Excludes: assets, icons, fonts, images, favicon, manifest, etc.
  matcher: ['/((?!.*\\..*).*)'],
};
