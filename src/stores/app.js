import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { translations } from '@/data/i18n'
import { profile as staticProfile } from '@/data/profile'
import { skills as staticSkills, skillCategories as staticSkillCategories } from '@/data/skills'
import { projects as staticProjects, projectCategories as staticProjectCategories } from '@/data/projects'
import { education as staticEducation, experience as staticExperience } from '@/data/about'
import { contactChannels as staticContactChannels } from '@/data/social'
import { statsConfig as staticStatsConfig } from '@/data/stats'
import { fetchPortfolio } from '@/utils/api'

const CATEGORY_ORDER = { frontend: 0, backend: 1, database: 2, tools: 3 }

function clone(value) {
  return typeof structuredClone === 'function' ? structuredClone(value) : JSON.parse(JSON.stringify(value))
}

export const useAppStore = defineStore('app', () => {
  // --- state ---
  const lang = ref(localStorage.getItem('portfolio-lang') || 'en')
  const dark = ref(localStorage.getItem('portfolio-dark') === 'true')
  const activeFilter = ref('all')

  // --- content data (static seed, replaced by DB payload when available) ---
  const profile = ref(clone(staticProfile))
  const skills = ref(clone(staticSkills))
  const skillCategories = ref(clone(staticSkillCategories))
  const projects = ref(clone(staticProjects))
  const projectCategories = ref(clone(staticProjectCategories))
  const education = ref(clone(staticEducation))
  const experience = ref(clone(staticExperience))
  const contactChannels = ref(clone(staticContactChannels))
  const statsConfig = ref(clone(staticStatsConfig))
  const contentOverride = ref(null)
  const dataLoading = ref(false)
  const dataLoaded = ref(false)
  const dataError = ref(null)

  // --- init dark class ---
  if (dark.value) {
    document.documentElement.classList.add('dark')
  }

  // --- init document language ---
  document.documentElement.lang = lang.value

  // --- DB content merged over static i18n (hero, bio, contact card copy) ---
  const t = computed(() => {
    const base = translations[lang.value]
    const override = contentOverride.value?.[lang.value]
    if (!override) return base
    const merged = { ...base }
    if (override.hero) merged.hero = { ...base.hero, ...override.hero }
    if (override.about) {
      const aboutClone = { ...base.about }
      if (Array.isArray(override.about.bio) && override.about.bio.length) aboutClone.bio = override.about.bio
      merged.about = aboutClone
    }
    if (override.contactCards) {
      merged.contactCards = { ...base.contactCards }
      for (const [id, card] of Object.entries(override.contactCards)) {
        if (base.contactCards?.[id]) merged.contactCards[id] = { ...base.contactCards[id], ...card }
      }
    }
    return merged
  })

  const skillById = computed(() => Object.fromEntries(skills.value.map((skill) => [skill.id, skill])))

  const filteredSkills = computed(() => {
    const list = skills.value
    if (activeFilter.value === 'all') {
      return [...list].sort((a, b) => {
        const ca = CATEGORY_ORDER[a.category] ?? 99
        const cb = CATEGORY_ORDER[b.category] ?? 99
        if (ca !== cb) return ca - cb
        if ((a.main ? 1 : 0) !== (b.main ? 1 : 0)) return (b.main ? 1 : 0) - (a.main ? 1 : 0)
        return a.name.localeCompare(b.name)
      })
    }
    if (activeFilter.value === 'main') return list.filter((s) => s.main)
    return list.filter((s) => s.category === activeFilter.value)
  })

  const filterCounts = computed(() => {
    const list = skills.value
    const all = list.length
    const main = list.filter((s) => s.main).length
    const frontend = list.filter((s) => s.category === 'frontend').length
    const backend = list.filter((s) => s.category === 'backend').length
    const database = list.filter((s) => s.category === 'database').length
    const tools = list.filter((s) => s.category === 'tools').length
    return { all, main, frontend, backend, database, tools }
  })

  // --- actions ---
  function toggleLang() {
    lang.value = lang.value === 'en' ? 'id' : 'en'
    document.documentElement.lang = lang.value
    localStorage.setItem('portfolio-lang', lang.value)
  }

  function toggleDark() {
    dark.value = !dark.value
    document.documentElement.classList.toggle('dark', dark.value)
    localStorage.setItem('portfolio-dark', dark.value)
  }

  function setFilter(filter) {
    activeFilter.value = filter
  }

  // --- project filters ---
  const activeProjectFilter = ref('all')
  const currentPage = ref(1)
  const PROJECT_PAGE_SIZE = 8

  const filteredProjects = computed(() => {
    if (activeProjectFilter.value === 'all') return projects.value
    return projects.value.filter((project) => project.category === activeProjectFilter.value)
  })

  const projectTotalPages = computed(() =>
    Math.max(1, Math.ceil(filteredProjects.value.length / PROJECT_PAGE_SIZE)),
  )

  const paginatedProjects = computed(() => {
    const start = (currentPage.value - 1) * PROJECT_PAGE_SIZE
    return filteredProjects.value.slice(start, start + PROJECT_PAGE_SIZE)
  })

  const projectFilterCounts = computed(() => {
    const counts = { all: projects.value.length }
    for (const category of projectCategories.value) {
      if (category.id === 'all') continue
      counts[category.id] = projects.value.filter((project) => project.category === category.id).length
    }
    return counts
  })

  function setProjectFilter(filter) {
    activeProjectFilter.value = filter
    currentPage.value = 1
  }

  function setProjectPage(page) {
    const target = Math.min(Math.max(1, page), projectTotalPages.value)
    currentPage.value = target
  }

  function nextProjectPage() {
    setProjectPage(currentPage.value + 1)
  }

  function prevProjectPage() {
    setProjectPage(currentPage.value - 1)
  }

  // --- portfolio data loading (DB with static fallback) ---
  async function loadPortfolio() {
    if (dataLoading.value || dataLoaded.value) return
    dataLoading.value = true
    dataError.value = null
    try {
      const data = await fetchPortfolio()
      profile.value = data.profile || profile.value
      skills.value = data.skills || skills.value
      skillCategories.value = data.skillCategories || skillCategories.value
      projects.value = data.projects || projects.value
      projectCategories.value = data.projectCategories || projectCategories.value
      education.value = data.education || education.value
      experience.value = data.experience || experience.value
      contactChannels.value = data.contactChannels || contactChannels.value
      statsConfig.value = data.statsConfig || statsConfig.value
      contentOverride.value = data.content || null
      dataLoaded.value = true
    } catch (err) {
      dataError.value = err?.message ?? 'Failed to load content'
      console.warn('Portfolio API unavailable, using static data:', dataError.value)
    } finally {
      dataLoading.value = false
    }
  }

  return {
    lang,
    dark,
    activeFilter,
    t,
    profile,
    skills,
    skillCategories,
    skillById,
    education,
    experience,
    contactChannels,
    statsConfig,
    dataLoading,
    dataLoaded,
    dataError,
    loadPortfolio,
    filteredSkills,
    filterCounts,
    toggleLang,
    toggleDark,
    setFilter,
    activeProjectFilter,
    filteredProjects,
    projectFilterCounts,
    setProjectFilter,
    currentPage,
    PROJECT_PAGE_SIZE,
    projectTotalPages,
    paginatedProjects,
    setProjectPage,
    nextProjectPage,
    prevProjectPage,
  }
})
