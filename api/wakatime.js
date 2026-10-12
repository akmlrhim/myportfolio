import { checkBotId } from 'botid/server'

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

  // BotID check. Blocks automated bots while allowing real users.
  // Falls back gracefully — the frontend loads local/embedded data on error.
  try {
    const verification = await checkBotId()
    if (verification.isBot) {
      res.setHeader('Cache-Control', 'no-store')
      return res.status(403).json({ error: 'Access denied' })
    }
  } catch (err) {
    // Vercel local dev or missing OIDC token: skip check, do not block the site.
    if (process.env.VERCEL) {
      console.warn('BotID check failed (OIDC token missing?):', err?.message ?? err)
    }
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
  const qs = new URLSearchParams(forwarded).toString()

  try {
    const upstream = await fetch(`${UPSTREAM}${upstreamPath}${qs ? '?' + qs : ''}`, {
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
