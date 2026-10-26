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

  const { __endpoint, ...forwarded } = req.query
  // Never forward auth-looking params upstream: WakaTime accepts an
  // `api_key` query override, and we only ever authenticate via header.
  for (const k of Object.keys(forwarded)) {
    if (/^api_?key$|token|authorization|secret/i.test(k)) delete forwarded[k]
  }
  const qs = new URLSearchParams(forwarded)
  // WakaTime's summaries endpoint requires a period. Default to the range the
  // site uses so a bare /summaries request works instead of leaking
  // WakaTime's "Missing start date." error.
  if (endpoint === 'summaries' && !qs.has('range') && !qs.has('start') && !qs.has('end')) {
    qs.set('range', 'last_7_days')
  }
  const queryString = qs.toString()

  try {
    const upstream = await fetch(`${UPSTREAM}${upstreamPath}${queryString ? '?' + queryString : ''}`, {
      headers: {
        Authorization: `Basic ${Buffer.from(apiKey).toString('base64')}`,
      },
    })

    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    res.setHeader('Content-Type', upstream.headers.get('content-type') ?? 'application/json')
    return res.status(upstream.status).send(await upstream.text())
  } catch (err) {
    console.error('WakaTime proxy failed:', err)
    return res.status(502).json({ error: 'Failed to reach WakaTime API' })
  }
}
