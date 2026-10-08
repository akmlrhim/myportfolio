/**
 * WakaTime API proxy. Keeps the secret API key server-side so it never
 * reaches the browser bundle.
 *
 * Vercel rewrites in vercel.json map:
 *   /api/wakatime/summaries  -> /api/wakatime?__endpoint=summaries
 *   /api/wakatime/all-time   -> /api/wakatime?__endpoint=all-time
 *
 * The original query string (?range=last_7_days, etc.) is preserved and
 * forwarded to the upstream.
 *
 * The dev proxy in vite.config.js serves the same two paths locally.
 */

const UPSTREAM = 'https://api.wakatime.com/api/v1'

const UPSTREAM_PATHS = {
  summaries: '/users/current/summaries',
  'all-time': '/users/current/all_time_since_today',
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.WAKATIME_API
  if (!apiKey) {
    return res.status(500).json({ error: 'WAKATIME_API is not configured' })
  }

  const endpoint = req.query.__endpoint
  const upstreamPath = UPSTREAM_PATHS[endpoint]
  if (!upstreamPath) {
    return res.status(404).json({ error: 'Unknown WakaTime endpoint' })
  }

  // Forward the original query string minus our internal __endpoint param.
  const { __endpoint, ...forwarded } = req.query
  const qs = new URLSearchParams(forwarded).toString()

  try {
    const upstream = await fetch(`${UPSTREAM}${upstreamPath}${qs ? '?' + qs : ''}`, {
      headers: {
        Authorization: `Basic ${Buffer.from(apiKey).toString('base64')}`,
      },
    })

    res.setHeader(
      'Cache-Control',
      'public, s-maxage=300, stale-while-revalidate=600',
    )
    res.setHeader(
      'Content-Type',
      upstream.headers.get('content-type') ?? 'application/json',
    )
    return res.status(upstream.status).send(await upstream.text())
  } catch (err) {
    console.error('WakaTime proxy failed:', err)
    return res.status(502).json({ error: 'Failed to reach WakaTime API' })
  }
}
