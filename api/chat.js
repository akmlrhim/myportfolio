import { buildSystemPrompt } from './_profile-context.js'

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
// Models available on the current Groq account (llama models are Enterprise-gated).
// The first candidate comes from GROQ_MODEL; the rest are automatic fallbacks.
const FALLBACK_MODELS = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b']
const envModel = (process.env.GROQ_MODEL || '').trim()
const MODEL_CANDIDATES = [...new Set([envModel, ...FALLBACK_MODELS].filter(Boolean))]

// Re-asserted right before the latest user message so a long chat history
// cannot dilute the topic restriction.
const TOPIC_REMINDER = {
  id: 'Ingat: hanya jawab topik seputar Akmal dan portfolionya sesuai aturan sistem. Tolak topik lain dengan satu kalimat.',
  en: 'Remember: only answer topics about Akmal and his portfolio per the system rules. Decline other topics in one sentence.',
}

const MAX_MESSAGES = 12
const MAX_MESSAGE_CHARS = 800

// Rate limits per IP. Three windows so a single client cannot burn tokens all
// day even by trickling requests. Configurable through env for tuning without
// a redeploy of code.
const RATE_LIMITS = [
  { window: 60_000, max: numEnv('AI_RATE_PER_MINUTE', 6) },
  { window: 3_600_000, max: numEnv('AI_RATE_PER_HOUR', 20) },
  { window: 86_400_000, max: numEnv('AI_RATE_PER_DAY', 60) },
]

// Global daily budget across all visitors. The real defense against someone
// spreading requests over many IPs: once the daily pool is spent, the endpoint
// shuts up until the next UTC day. Configurable through env.
const DAILY_REQUEST_BUDGET = numEnv('AI_DAILY_REQUEST_BUDGET', 300)
const DAILY_TOKEN_BUDGET = numEnv('AI_DAILY_TOKEN_BUDGET', 250_000)

function numEnv(name, fallback) {
  const n = Number.parseInt(process.env[name] ?? '', 10)
  return Number.isFinite(n) && n > 0 ? n : fallback
}

// In-memory state. Per serverless instance, so not perfectly exact, but the
// limits are tight enough that combined they make meaningful abuse impractical
// on a portfolio scale without extra infrastructure.
const hits = new Map()

function allowRequest(ip) {
  const now = Date.now()
  let list = hits.get(ip)
  if (!list) {
    list = []
    hits.set(ip, list)
  }
  while (list.length && now - list[0] >= RATE_LIMITS[RATE_LIMITS.length - 1].window) list.shift()
  for (const { window, max } of RATE_LIMITS) {
    let inWindow = 0
    for (let i = list.length - 1; i >= 0; i--) {
      if (now - list[i] < window) inWindow++
    }
    if (inWindow >= max) return false
  }
  list.push(now)
  if (hits.size > 5000) {
    const cutoff = now - RATE_LIMITS[RATE_LIMITS.length - 1].window
    for (const [key, times] of hits) {
      if (!times.length || times[times.length - 1] < cutoff) hits.delete(key)
    }
  }
  return true
}

// Daily pool, resets on UTC date change.
const daily = { date: '', requests: 0, tokens: 0 }

function dailyStats() {
  const today = new Date().toISOString().slice(0, 10)
  if (daily.date !== today) {
    daily.date = today
    daily.requests = 0
    daily.tokens = 0
  }
  return daily
}

function budgetExceeded() {
  const d = dailyStats()
  return d.requests >= DAILY_REQUEST_BUDGET || d.tokens >= DAILY_TOKEN_BUDGET
}

function recordUsage(totalTokens) {
  const d = dailyStats()
  d.requests += 1
  d.tokens += totalTokens
}

// Rough estimate used only when Groq omits usage data: ~4 chars per token
// plus a margin for the reply itself.
function estimateTokens(systemPrompt, messages) {
  const chars = messages.reduce((n, m) => n + m.content.length, systemPrompt.length)
  return Math.round(chars / 4) + 300
}

async function readJsonBody(req) {
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')
  } catch {
    return {}
  }
}

// Keep only plain user/assistant turns. The client can never inject a system
// role, and each message is capped in size and count.
function sanitizeMessages(raw) {
  if (!Array.isArray(raw)) return null
  const msgs = raw
    .filter(
      (m) =>
        m &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.trim(),
    )
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.trim().slice(0, MAX_MESSAGE_CHARS) }))
  if (!msgs.length || msgs[msgs.length - 1].role !== 'user') return null
  return msgs
}

// Models can still leak Markdown despite the system prompt. The chat bubbles
// render plain text, so strip the common syntax server-side.
// Exported for tests; the API entry point stays the default export.
export function stripMarkdown(text) {
  return text
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '$1 ($2)') // [label](url) -> label (url)
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // **bold** / __bold__
    .replace(/\*([^*\n]+)\*/g, '$1') // *italic*
    .replace(/`([^`]*)`/g, '$1') // `code`
    .replace(/^#{1,6}\s+/gm, '') // headings
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'GROQ_API_KEY is not configured' })
  }

  const ip = String(req.headers['x-forwarded-for'] ?? '').split(',')[0].trim() || 'unknown'
  if (!allowRequest(ip)) {
    res.setHeader('Cache-Control', 'no-store')
    return res.status(429).json({ error: 'Too many requests, try again in a minute' })
  }

  if (budgetExceeded()) {
    res.setHeader('Cache-Control', 'no-store')
    return res.status(429).json({ error: 'AI daily quota has been reached, try again tomorrow' })
  }

  const body = await readJsonBody(req)
  const messages = sanitizeMessages(body.messages)
  if (!messages) {
    return res.status(400).json({ error: 'Invalid messages payload' })
  }
  const lang = body.lang === 'id' ? 'id' : 'en'
  const systemPrompt = buildSystemPrompt(lang)

  try {
    const reminder = { role: 'system', content: TOPIC_REMINDER[lang] }
    const withReminder = [...messages.slice(0, -1), reminder, messages[messages.length - 1]]

    const callGroq = (model) =>
      fetch(GROQ_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'system', content: systemPrompt }, ...withReminder],
          temperature: 0.6,
          max_tokens: 512,
        }),
      })

    let upstream
    for (const model of MODEL_CANDIDATES) {
      upstream = await callGroq(model)
      // 400/404 = model missing or inaccessible; try the next candidate.
      if (upstream.ok || ![400, 404].includes(upstream.status)) break
      console.warn('Groq model rejected, trying next:', model, upstream.status)
    }

    if (!upstream.ok) {
      const status = upstream.status
      console.error('Groq upstream error:', status, await upstream.text().catch(() => ''))
      if (status === 401 || status === 403) {
        return res.status(500).json({ error: 'AI service auth failed' })
      }
      if (status === 400 || status === 404) {
        return res.status(500).json({ error: 'AI model is not available' })
      }
      if (status === 429) {
        return res.status(429).json({ error: 'AI service is busy, try again shortly' })
      }
      return res.status(502).json({ error: 'AI service unavailable' })
    }

    const data = await upstream.json()
    const reply = data?.choices?.[0]?.message?.content?.trim()
    if (!reply) {
      return res.status(502).json({ error: 'Empty AI response' })
    }

    const used = data?.usage?.total_tokens
    recordUsage(typeof used === 'number' && used > 0 ? used : estimateTokens(systemPrompt, messages))

    res.setHeader('Cache-Control', 'no-store')
    return res.status(200).json({ reply: stripMarkdown(reply) })
  } catch (err) {
    console.error('Chat handler failed:', err)
    return res.status(502).json({ error: 'AI service unavailable' })
  }
}
