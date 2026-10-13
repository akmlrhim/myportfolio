import { ref, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'

const CACHE_TTL = 6 * 60 * 60 * 1000 // 6 hours

function readCache(key) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const p = JSON.parse(raw)
    if (!Array.isArray(p?.items)) return null
    if (Date.now() - p.savedAt > CACHE_TTL) return null
    return p.items
  } catch {
    return null
  }
}

function writeCache(key, items) {
  try {
    localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), items }))
  } catch {
    // storage full, ignore, live fetch is primary
  }
}

export function useGitHub() {
  const store = useAppStore()
  const loading = ref(true)
  const error = ref(null)

  const user = ref(null)
  const topLanguages = ref([])
  const topRepos = ref([])

  const contributions = ref([])
  const contributionsLoading = ref(true)
  const contributionsTotal = ref(0)

  async function fetchContributions() {
    const githubUser = store.statsConfig.githubUser
    if (!githubUser) {
      contributionsLoading.value = false
      return
    }
    const cacheKey = `gh-contribs:${githubUser}`
    const contribApi = `https://github-contributions-api.jogruber.de/v4/${githubUser}?y=last`

    // show cached data immediately if available
    const cached = readCache(cacheKey)
    if (cached) {
      contributions.value = cached
      contributionsTotal.value = cached.reduce((sum, c) => sum + (c.count || 0), 0)
      contributionsLoading.value = false
    }

    try {
      const res = await fetch(contribApi)
      if (!res.ok) throw new Error(`Contributions API: ${res.status}`)
      const d = await res.json()
      const items = d.contributions ?? []
      contributions.value = items
      contributionsTotal.value = items.reduce((sum, c) => sum + (c.count || 0), 0)
      writeCache(cacheKey, items)
    } catch {
      // cached data already set above, keep showing it
      if (!cached) contributions.value = []
    } finally {
      contributionsLoading.value = false
    }
  }

  onMounted(async () => {
    const githubUser = store.statsConfig.githubUser
    fetchContributions()

    if (!githubUser) {
      loading.value = false
      return
    }

    const userApi = `https://api.github.com/users/${githubUser}`
    const reposApi = `https://api.github.com/users/${githubUser}/repos?per_page=100&sort=updated`

    try {
      const [userRes, reposRes] = await Promise.all([fetch(userApi), fetch(reposApi)])

      if (!userRes.ok) throw new Error(`GitHub user API: ${userRes.status}`)
      if (!reposRes.ok) throw new Error(`GitHub repos API: ${reposRes.status}`)

      const userData = await userRes.json()
      const reposData = await reposRes.json()

      user.value = userData

      // Top languages by repo count
      const langMap = {}
      reposData.forEach((r) => {
        if (r.language) {
          langMap[r.language] = (langMap[r.language] || 0) + 1
        }
      })
      const total = Object.values(langMap).reduce((a, b) => a + b, 0)
      topLanguages.value = Object.entries(langMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([name, count]) => ({
          name,
          count,
          percent: total > 0 ? Math.round((count / total) * 100) : 0,
        }))

      // Top repos by stars
      topRepos.value = reposData
        .filter((r) => !r.fork)
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 6)
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  })

  return {
    loading,
    error,
    user,
    topLanguages,
    topRepos,
    contributions,
    contributionsLoading,
    contributionsTotal,
  }
}
