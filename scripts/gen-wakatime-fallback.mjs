import { readFileSync, writeFileSync } from 'node:fs'

const env = readFileSync('.env', 'utf8')
const key = env.match(/^WAKATIME_API=(.+)$/m)?.[1]?.trim()
if (!key) {
  console.error('WAKATIME_API missing in .env')
  process.exit(1)
}

const auth = { Authorization: `Basic ${Buffer.from(key).toString('base64')}` }
const BASE = 'https://api.wakatime.com/api/v1'

const [summaries, allTime] = await Promise.all([
  fetch(`${BASE}/users/current/summaries?range=last_7_days`, { headers: auth }).then((r) =>
    r.json(),
  ),
  fetch(`${BASE}/users/current/all_time_since_today`, { headers: auth }).then((r) => r.json()),
])

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
}

const agg = {}
const editorAgg = {}
let totalSeconds = 0
const daily = []

for (const d of summaries.data) {
  const secs = Math.round(d.grand_total?.total_seconds || 0)
  totalSeconds += secs
  daily.push({ date: d.range.date, seconds: secs })
  for (const l of d.languages || []) {
    agg[l.name] ??= { name: l.name, seconds: 0, color: LANG_COLORS[l.name] || l.color || '#2563eb' }
    agg[l.name].seconds += l.total_seconds || 0
  }
  for (const e of d.editors || []) {
    editorAgg[e.name] ??= { name: e.name, seconds: 0, color: e.color ?? '#2563eb' }
    editorAgg[e.name].seconds += e.total_seconds || 0
  }
}

const pick = (a) =>
  Object.values(a)
    .filter((x) => x.seconds > 0)
    .sort((x, y) => y.seconds - x.seconds)
    .map((x) => ({ ...x, seconds: Math.round(x.seconds) }))

const out = {
  allTimeSeconds: Math.round(allTime.data.total_seconds),
  totalSeconds,
  daily,
  languages: pick(agg),
  editors: pick(editorAgg),
}

writeFileSync('src/data/wakatime.json', JSON.stringify(out, null, 2) + '\n')
console.log(`fallback updated: ${totalSeconds}s / 7d, allTime ${out.allTimeSeconds}s`)
