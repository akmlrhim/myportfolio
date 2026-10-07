import { ref, onMounted } from 'vue'
import { statsConfig } from '@/data/portfolio'
import localData from '@/data/wakatime.json'

// API key comes from the build environment (Vite config maps WAKATIME_API →
// import.meta.env.WAKATIME_API). Empty key falls back to the bundled dataset.
const API_KEY = import.meta.env.WAKATIME_API || import.meta.env.VITE_WAKATIME_API || ''
const SHARE_URL = statsConfig.wakatimeShareUrl

const API_BASE = import.meta.env.DEV
  ? '/api/wakatime'
  : 'https://api.wakatime.com/api/v1'
const SUMMARIES_API = `${API_BASE}/users/current/summaries?range=last_7_days`
const ALL_TIME_API = `${API_BASE}/users/current/all_time_since_today`

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

const authHeaders = () => ({ Authorization: `Basic ${btoa(API_KEY)}` })

// Aggregate raw WakaTime day entries into
// { totalSeconds, daily, languages, editors }
function aggregateDays(days) {
  let totalSeconds = 0
  const langAgg = {}
  const editorAgg = {}
  const daily = []

  for (const d of days) {
    const secs = Math.round(d.grand_total?.total_seconds || 0)
    totalSeconds += secs
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

// Accepts `{ data: [...] }` (live summaries), `{ data: { days: [...] } }` /
// plain dashboard JSON (share embeds / local export).
function normalize(raw) {
  const body = raw?.data ?? raw
  const days = Array.isArray(body) ? body : body?.days
  if (!Array.isArray(days) || !days.length) return null
  return {
    ...aggregateDays(days),
    allTimeSeconds: raw?.cumulative_total?.seconds ?? body?.cumulative_total?.seconds ?? null,
  }
}

async function loadFromApi() {
  const [summaryRes, allTimeRes] = await Promise.all([
    fetch(SUMMARIES_API, { headers: authHeaders() }),
    fetch(ALL_TIME_API, { headers: authHeaders() }).catch(() => null),
  ])
  if (!summaryRes.ok) throw new Error(`WakaTime API: ${summaryRes.status}`)

  const normalized = normalize(await summaryRes.json())
  if (!normalized) return null

  if (allTimeRes?.ok) {
    const allTime = await allTimeRes.json()
    normalized.allTimeSeconds = allTime?.data?.total_seconds ?? normalized.allTimeSeconds
  }
  return normalized
}

async function loadFromShare() {
  const res = await fetch(SHARE_URL)
  if (!res.ok) throw new Error(`WakaTime share: ${res.status}`)
  return normalize(await res.json())
}

export function useWakatime() {
  const loading = ref(true)
  const error = ref(null)
  const data = ref(null)

  onMounted(async () => {
    if (API_KEY) {
      try {
        data.value = await loadFromApi()
      } catch (e) {
        error.value = e.message
      }
    } else if (SHARE_URL) {
      try {
        data.value = await loadFromShare()
      } catch (e) {
        error.value = e.message
      }
    }
    if (!data.value) data.value = localData
    loading.value = false
  })

  return { loading, error, data }
}