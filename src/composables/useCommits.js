import { ref, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'

const PER_PAGE = 10
const CACHE_TTL = 60 * 60 * 1000 // 1 hour

function readCache(key) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const p = JSON.parse(raw)
    if (!Array.isArray(p?.items)) return null
    if (Date.now() - p.savedAt > CACHE_TTL) return null
    return p.items.slice(0, PER_PAGE)
  } catch {
    return null
  }
}

function writeCache(key, items) {
  try {
    localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), items }))
  } catch {
    // storage full
  }
}

function mapCommit(item, githubUser) {
  const repoFullName = item.repository?.full_name ?? ''
  const repoName = repoFullName.split('/').pop() || repoFullName
  return {
    sha: item.sha?.slice(0, 7) ?? '',
    fullSha: item.sha,
    message: (item.commit?.message ?? '').split('\n')[0].trim() || '(no message)',
    repo: repoName,
    owner: item.repository?.owner?.login ?? githubUser,
    date: item.commit?.committer?.date ?? item.commit?.author?.date,
    url: item.html_url,
  }
}

export function useCommits() {
  const store = useAppStore()
  const loading = ref(true)
  const error = ref(null)
  const commits = ref([])

  async function fetchCommits() {
    const githubUser = store.statsConfig.githubUser
    if (!githubUser) {
      commits.value = []
      loading.value = false
      return
    }

    // Remove legacy cache keys.
    try {
      localStorage.removeItem(`gh-events:${githubUser}`)
    } catch { /* noop */ }

    const cacheKey = `gh-commits:${githubUser}`
    const searchUrl = `https://api.github.com/search/commits?q=author:${githubUser}&sort=committer-date&order=desc&per_page=${PER_PAGE}`

    const cached = readCache(cacheKey)
    if (cached) {
      commits.value = cached
      loading.value = false
      return
    }

    loading.value = true
    error.value = null
    try {
      const res = await fetch(searchUrl, {
        headers: { Accept: 'application/vnd.github+json' },
      })
      if (!res.ok) throw new Error(`Search API: ${res.status}`)
      const data = await res.json()
      commits.value = (data.items ?? []).slice(0, PER_PAGE).map((item) => mapCommit(item, githubUser))
      if (commits.value.length > 0) writeCache(cacheKey, commits.value)
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
