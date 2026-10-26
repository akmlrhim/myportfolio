import { ref, onMounted } from 'vue'
import { statsConfig } from '@/data/stats'
import localData from '@/data/wakatime.json'

// All requests hit the same relative path: Vite's dev server proxies it in
// dev (see vite.config.js), and the Vercel function at api/wakatime/ serves
// it in production. The WakaTime API key never reaches the browser bundle.
const API_BASE = '/api/wakatime'
const SHARE_URL = statsConfig.wakatimeShareUrl

const SUMMARIES_API = `${API_BASE}/summaries?range=last_7_days`
const ALL_TIME_API = `${API_BASE}/all-time`
const FETCH_TIMEOUT_MS = 8000
const RETRY_DELAY_MS = 800

const LANG_COLORS = {
  TypeScript: '#3178C6',
  PHP: '#777BB4',
  Markdown: '#083FA1',
  'Blade Template': '#FF2D20',
  Vue: '#42B883',
  Bash: '#4EAA25',
  JavaScript: '#F7DF1E',
  YAML: '#CB171E',
  CSS: '#563D7C',
  Other: '#7C8794',
  Python: '#3572A5',
  'Git Config': '#F05032',
  JSON: '#292929',
  HTML: '#E34F26',
  INI: '#D1DBDB',
  Kotlin: '#7F52FF',
}

// Aggregate raw WakaTime day entries into
// { totalSeconds, daily, languages, editors }
function aggregateDays(days) {
  let totalSeconds = 0
  const langAgg = {}
  const editorAgg = {}
  const daily = []

  for (const d of days) {
    // Sum raw floats and round once at the end; rounding per day would
    // accumulate up to half a minute of drift over a week.
    totalSeconds += d.grand_total?.total_seconds || 0
    const secs = Math.round(d.grand_total?.total_seconds || 0)
    daily.push({ date: d.range?.date ?? d.date, seconds: secs })

    for (const l of d.languages || []) {
      if (!langAgg[l.name]) {
        langAgg[l.name] = { name: l.name, seconds: 0, color: LANG_COLORS[l.name] || l.color || '#2563eb' }
      }
      langAgg[l.name].seconds += l.total_seconds || 0
    }
    for (const e of d.editors || []) {
      if (!editorAgg[e.name]) editorAgg[e.name] = { name: e.name, seconds: 0 }
      editorAgg[e.name].seconds += e.total_seconds || 0
    }
  }

  const pick = (agg) =>
    Object.values(agg)
      .filter((x) => x.seconds > 0)
      .sort((a, b) => b.seconds - a.seconds)
      .map((x) => ({ ...x, seconds: Math.round(x.seconds) }))

  return {
    totalSeconds,
    daily: daily.filter((d) => d.date),
    languages: pick(langAgg),
    editors: pick(editorAgg),
  }
}

// Accepts { data: [...] } (live summaries), { data: { days: [...] } } /
// plain dashboard JSON (share embeds / local export).
// NOTE: cumulative_total here belongs to the requested range (7 days),
// never use it as "all time".
function normalize(raw) {
  const body = raw?.data ?? raw
  const days = Array.isArray(body) ? body : body?.days
  if (!Array.isArray(days) || !days.length) return null
  return {
    ...aggregateDays(days),
    allTimeSeconds: null,
    dailyAverageSeconds: null,
  }
}

async function fetchJson(url) {
  // Timeout so a hanging mobile connection falls back instead of spinning
  // the skeleton forever.
  const res = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) })
  if (!res.ok) throw new Error(`WakaTime API: ${res.status}`)
  return res.json()
}

async function loadFromApiOnce() {
  const [summary, allTime] = await Promise.all([
    fetchJson(SUMMARIES_API),
    fetchJson(ALL_TIME_API).catch(() => null),
  ])

  const normalized = normalize(summary)
  if (!normalized) throw new Error('WakaTime API: empty response')

  const secs = allTime?.data?.total_seconds
  if (typeof secs === 'number') normalized.allTimeSeconds = Math.round(secs)
  // WakaTime's own daily average, same number the dashboard shows
  const avg = allTime?.data?.daily_average
  if (typeof avg === 'number' && avg > 0) normalized.dailyAverageSeconds = Math.round(avg)
  return normalized
}

async function loadFromApi() {
  // One retry: a flaky mobile connection or a momentary WakaTime error should
  // not silently drop the visitor onto week-old backup data.
  for (let attempt = 1; ; attempt++) {
    try {
      return await loadFromApiOnce()
    } catch (err) {
      if (attempt >= 2) throw err
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS))
    }
  }
}

async function loadFromShare() {
  const res = await fetch(SHARE_URL, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) })
  if (!res.ok) throw new Error(`WakaTime share: ${res.status}`)
  return normalize(await res.json())
}

export function useWakatime() {
  const loading = ref(true)
  const error = ref(null)
  const data = ref(null)
  // True when live fetch failed and the numbers come from a fallback source.
  const stale = ref(false)

  onMounted(async () => {
    try {
      data.value = await loadFromApi()
    } catch (e) {
      error.value = e.message
      if (SHARE_URL) {
        try {
          data.value = await loadFromShare()
        } catch (e2) {
          error.value = e2.message
        }
      }
      if (!data.value) data.value = localData
      stale.value = true
    }
    loading.value = false
  })

  return { loading, error, data, stale }
}
