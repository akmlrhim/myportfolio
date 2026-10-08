import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { translations } from '@/data/i18n'
import { skills } from '@/data/skills'

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
    if (activeFilter.value === 'all') return skills
    if (activeFilter.value === 'main') return skills.filter((s) => s.main)
    return skills.filter((s) => s.category === activeFilter.value)
  })

  const filterCounts = computed(() => {
    const all = skills.length
    const main = skills.filter((s) => s.main).length
    const frontend = skills.filter((s) => s.category === 'frontend').length
    const backend = skills.filter((s) => s.category === 'backend').length
    const database = skills.filter((s) => s.category === 'database').length
    const tools = skills.filter((s) => s.category === 'tools').length
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
  }
})
