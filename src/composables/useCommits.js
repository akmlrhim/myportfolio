import { ref, onMounted } from 'vue'
import { statsConfig } from '@/data/portfolio'

const GITHUB_USER = statsConfig.githubUser
const PER_PAGE = 10

const searchUrl = () =>
  `https://api.github.com/search/commits?q=author:${GITHUB_USER}&sort=committer-date&order=desc&per_page=${PER_PAGE}`

// --- commit cache (localStorage) ---
const CACHE_KEY = `gh-commits:v2:${GITHUB_USER}`
const CACHE_TTL = 60 * 60 * 1000 // 1 hour

// Remove legacy cache keys from older implementations.
for (const legacy of [`gh-commits:${GITHUB_USER}`, `gh-events:${GITHUB_USER}`]) {
  try {
    localStorage.removeItem(legacy)
  } catch {
    // ignore
  }
}

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const p = JSON.parse(raw)
    if (!Array.isArray(p?.items)) return null
    if (Date.now() - p.savedAt > CACHE_TTL) return null
    return p.items.slice(0, PER_PAGE)
  } catch {
    return null
  }
}

function writeCache(items) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), items }))
  } catch {
    // storage full
  }
}

function mapCommit(item) {
  const repoFullName = item.repository?.full_name ?? ''
  const repoName = repoFullName.split('/').pop() || repoFullName
  return {
    sha: item.sha?.slice(0, 7) ?? '',
    fullSha: item.sha,
    message: (item.commit?.message ?? '').split('\n')[0].trim() || '(no message)',
    repo: repoName,
    owner: item.repository?.owner?.login ?? GITHUB_USER,
    date: item.commit?.committer?.date ?? item.commit?.author?.date,
    url: item.html_url,
  }
}

export function useCommits() {
  const loading = ref(true)
  const error = ref(null)
  const commits = ref([])

  async function fetchCommits() {
    const cached = readCache()
    if (cached) {
      commits.value = cached
      loading.value = false
      return
    }

    loading.value = true
    error.value = null
    try {
      const res = await fetch(searchUrl(), {
        headers: { Accept: 'application/vnd.github+json' },
      })
      if (!res.ok) throw new Error(`Search API: ${res.status}`)
      const data = await res.json()
      commits.value = (data.items ?? []).slice(0, PER_PAGE).map(mapCommit)
      if (commits.value.length > 0) writeCache(commits.value)
    } catch (e) {
      error.value = e.message
      commits.value = []
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchCommits)

  return { loading, error, commits, fetchCommits }
}
