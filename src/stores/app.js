import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { translations } from '@/data/i18n'
import { skills as rawSkills } from '@/data/skills'
import { projects, projectCategories } from '@/data/projects'

const CATEGORY_ORDER = { frontend: 0, backend: 1, database: 2, tools: 3 }

export const useAppStore = defineStore('app', () => {
  // --- state ---
  const lang = ref(localStorage.getItem('portfolio-lang') || 'en')
  const dark = ref(localStorage.getItem('portfolio-dark') === 'true')
  const activeFilter = ref('all')

  // --- init dark class ---
  if (dark.value) {
    document.documentElement.classList.add('dark')
  }

  // --- init document language ---
  document.documentElement.lang = lang.value

  // --- computed ---
  const t = computed(() => translations[lang.value])

  const filteredSkills = computed(() => {
    if (activeFilter.value === 'all') {
      return [...rawSkills].sort((a, b) => {
        const ca = CATEGORY_ORDER[a.category] ?? 99
        const cb = CATEGORY_ORDER[b.category] ?? 99
        if (ca !== cb) return ca - cb
        if ((a.main ? 1 : 0) !== (b.main ? 1 : 0)) return (b.main ? 1 : 0) - (a.main ? 1 : 0)
        return a.name.localeCompare(b.name)
      })
    }
    if (activeFilter.value === 'main') return rawSkills.filter((s) => s.main)
    return rawSkills.filter((s) => s.category === activeFilter.value)
  })

  const filterCounts = computed(() => {
    const all = rawSkills.length
    const main = rawSkills.filter((s) => s.main).length
    const frontend = rawSkills.filter((s) => s.category === 'frontend').length
    const backend = rawSkills.filter((s) => s.category === 'backend').length
    const database = rawSkills.filter((s) => s.category === 'database').length
    const tools = rawSkills.filter((s) => s.category === 'tools').length
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

  const filteredProjects = computed(() => {
    if (activeProjectFilter.value === 'all') return projects
    return projects.filter((project) => project.category === activeProjectFilter.value)
  })

  const projectFilterCounts = computed(() => {
    const counts = { all: projects.length }
    for (const category of projectCategories) {
      if (category.id === 'all') continue
      counts[category.id] = projects.filter((project) => project.category === category.id).length
    }
    return counts
  })

  function setProjectFilter(filter) {
    activeProjectFilter.value = filter
  }

  return {
    lang,
    dark,
    activeFilter,
    t,
    filteredSkills,
    filterCounts,
    toggleLang,
    toggleDark,
    setFilter,
    activeProjectFilter,
    filteredProjects,
    projectFilterCounts,
    setProjectFilter,
  }
})
