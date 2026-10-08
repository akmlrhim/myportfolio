<script setup>
import { computed } from 'vue'
import { motion } from 'motion-v'
import { useAppStore } from '@/stores/app'
import { useGitHub } from '@/composables/useGitHub'
import { useWakatime } from '@/composables/useWakatime'
import PageHeader from '@/components/organisms/PageHeader.vue'
import GitHubSkeleton from '@/components/organisms/GitHubSkeleton.vue'
import WakaTimeSkeleton from '@/components/organisms/WakaTimeSkeleton.vue'
import StaggerGroup from '@/components/motion/StaggerGroup.vue'
import StaggerItem from '@/components/motion/StaggerItem.vue'
import Skeleton from '@/components/atoms/BaseSkeleton.vue'

const store = useAppStore()
const gh = useGitHub()
const wt = useWakatime()

const locale = computed(() => (store.lang === 'id' ? 'id-ID' : 'en-US'))

// --- shared helpers ---
function fmtHm(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.round((seconds % 3600) / 60)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

function fmtDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString(locale.value, {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  })
}

function fmtDayLabel(dateStr) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString(locale.value, { weekday: 'short' })
}

// --- WakaTime ---
const wtData = computed(() => wt.data.value)
const totalSeconds = computed(() => wtData.value?.totalSeconds ?? 0)

const startDate = computed(() => wtData.value?.daily?.[0]?.date ?? null)
const endDate = computed(() => {
  const days = wtData.value?.daily ?? []
  return days.length ? days[days.length - 1].date : null
})

const avgDaily = computed(() => {
  const days = (wtData.value?.daily ?? []).filter((d) => d.seconds > 0)
  if (!days.length) return '—'
  return fmtHm(Math.round(totalSeconds.value / days.length))
})

const bestDay = computed(() => {
  const days = wtData.value?.daily ?? []
  if (!days.length) return null
  return days.reduce((a, b) => (b.seconds > a.seconds ? b : a), days[0])
})

const bestDayLabel = computed(() => {
  const b = bestDay.value
  return b ? `${fmtDate(b.date)} (${fmtHm(b.seconds)})` : '—'
})

const allTimeLabel = computed(() => {
  const s = wtData.value?.allTimeSeconds
  if (!s) return '—'
  const h = Math.floor(s / 3600)
  const m = Math.round((s % 3600) / 60)
  return `${h.toLocaleString(locale.value)}h ${m}m`
})

const dailyBars = computed(() => {
  const days = wtData.value?.daily ?? []
  const max = Math.max(...days.map((d) => d.seconds), 1)
  return days.map((d) => ({
    ...d,
    label: fmtDayLabel(d.date),
    height: Math.max((d.seconds / max) * 100, d.seconds > 0 ? 6 : 2),
  }))
})

const maxWtLangSeconds = computed(() =>
  Math.max(...(wtData.value?.languages ?? []).map((l) => l.seconds), 1),
)
const maxWtEditorSeconds = computed(() =>
  Math.max(...(wtData.value?.editors ?? []).map((e) => e.seconds), 1),
)

const wtLanguages = computed(() => {
  const total = totalSeconds.value || 1
  return (wtData.value?.languages ?? []).slice(0, 8).map((l) => ({
    ...l,
    percent: Math.round((l.seconds / total) * 100),
  }))
})

const wtEditors = computed(() => {
  const total = totalSeconds.value || 1
  return (wtData.value?.editors ?? []).map((e) => ({
    ...e,
    percent: Math.round((e.seconds / total) * 100),
  }))
})

// --- GitHub ---
const ghContribItems = computed(() => gh.contributions.value ?? [])

const contribThisWeek = computed(() => {
  const items = ghContribItems.value
  if (!items.length) return 0
  const last = new Date(`${items[items.length - 1].date}T00:00:00`)
  const start = new Date(last)
  start.setDate(start.getDate() - 6)
  return items
    .filter((c) => new Date(`${c.date}T00:00:00`) >= start)
    .reduce((s, c) => s + (c.count || 0), 0)
})

const contribBestDay = computed(() => {
  const items = ghContribItems.value
  if (!items.length) return null
  return items.reduce((a, c) => (c.count > a.count ? c : a), items[0])
})

const contribDailyAvg = computed(() => {
  const items = ghContribItems.value
  if (!items.length) return '—'
  const activeDays = items.filter((c) => c.count > 0).length || 1
  return (gh.contributionsTotal.value / activeDays).toFixed(1)
})

const ghStats = computed(() => {
  const loading = gh.contributionsLoading.value
  return [
    { label: store.t.stats.followers, value: gh.user.value?.followers ?? 0 },
    { label: store.t.stats.following, value: gh.user.value?.following ?? 0 },
    { label: store.t.stats.repos, value: gh.user.value?.public_repos ?? 0 },
    { label: store.t.stats.contributions, value: loading ? '—' : gh.contributionsTotal.value.toLocaleString(locale.value) },
    { label: store.t.stats.thisWeek, value: loading ? '—' : contribThisWeek.value },
    { label: store.t.stats.bestDay, value: loading ? '—' : (contribBestDay.value?.count ?? 0) },
    { label: store.t.stats.dailyAvg, value: loading ? '—' : `${contribDailyAvg.value} ${store.t.stats.perDay}` },
  ]
})

function ghLangColor(name) {
  const colors = {
    JavaScript: '#F7DF1E',
    TypeScript: '#3178C6',
    Vue: '#42B883',
    HTML: '#E34F26',
    CSS: '#1572B6',
    PHP: '#777BB4',
    Go: '#00ADD8',
    Kotlin: '#7F52FF',
    Python: '#3776AB',
    Dart: '#0175C2',
    Java: '#EA2D2E',
    'C#': '#68217A',
    Shell: '#89E051',
    SCSS: '#C6538C',
    TailwindCSS: '#06B6D4',
  }
  return colors[name] || '#2563eb'
}

// --- GitHub contributions heatmap ---
const contribWeeks = computed(() => {
  const items = gh.contributions.value
  if (!items.length) return []
  const weeks = []
  let week = Array.from({ length: 7 }, () => null)
  let started = false
  for (const c of items) {
    const dow = new Date(`${c.date}T00:00:00`).getDay()
    if (dow === 0 && started) {
      weeks.push(week)
      week = Array.from({ length: 7 }, () => null)
    }
    week[dow] = c
    started = true
  }
  if (week.some(Boolean)) weeks.push(week)
  return weeks
})

const contribMonths = computed(() => {
  const months = []
  let lastMonth = -1
  contribWeeks.value.forEach((week, wi) => {
    const first = week.find(Boolean)
    if (!first) return
    const d = new Date(`${first.date}T00:00:00`)
    if (d.getMonth() !== lastMonth) {
      months.push({ label: d.toLocaleDateString(locale.value, { month: 'short' }), weekIndex: wi })
      lastMonth = d.getMonth()
    }
  })
  return months
})

const contribColors = computed(() =>
  store.dark
    ? ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353']
    : ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
)
</script>

<template>
  <PageHeader :title="store.t.page.stats" :description="store.t.page.statsDesc">
    <!-- ================= GitHub ================= -->
    <section class="mt-10">
      <h2 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        {{ store.t.stats.github }}
      </h2>

      <GitHubSkeleton v-if="gh.loading.value" class="mt-4" />

      <div v-else-if="gh.error.value" class="mt-4 rounded-2xl border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
        {{ store.t.stats.failedToLoad }}
      </div>

      <template v-else>
        <StaggerGroup class="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StaggerItem
            v-for="s in ghStats"
            :key="s.label"
            class="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800"
          >
            <p class="text-xl font-bold text-neutral-900 dark:text-neutral-100">
              {{ s.value }}
            </p>
            <p class="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{{ s.label }}</p>
          </StaggerItem>
        </StaggerGroup>

        <!-- Contribution graph -->
        <div class="mt-6 rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <h3 class="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              {{ store.t.stats.contributionGraph }}
            </h3>
            <span
              v-if="!gh.contributionsLoading.value && gh.contributionsTotal.value"
              class="text-xs text-neutral-500 dark:text-neutral-400"
            >
              {{ store.t.stats.contributionsLastYear.replace('{n}', gh.contributionsTotal.value) }}
            </span>
          </div>

          <div v-if="gh.contributionsLoading.value" class="mt-4 flex gap-[3px]">
            <div v-for="week in 40" :key="week" class="flex flex-col gap-[3px]">
              <Skeleton
                v-for="day in 7"
                :key="day"
                w="w-[10px]"
                h="h-[10px]"
                rounded="rounded-[2px]"
              />
            </div>
          </div>

          <div v-else-if="contribWeeks.length" class="mt-4 overflow-x-auto pb-1">
            <div class="inline-block">
              <div class="relative mb-1 h-3 text-[10px] leading-none text-neutral-500 select-none dark:text-neutral-400">
                <span
                  v-for="m in contribMonths"
                  :key="m.weekIndex"
                  class="absolute top-0 whitespace-nowrap"
                  :style="{ left: `${m.weekIndex * 13}px` }"
                >{{ m.label }}</span>
              </div>
              <div class="flex gap-[3px]">
                <div v-for="(week, wi) in contribWeeks" :key="wi" class="flex flex-col gap-[3px]">
                  <template v-for="(cell, di) in week" :key="di">
                    <span
                      v-if="cell"
                      class="h-[10px] w-[10px] rounded-[2px]"
                      :style="{ backgroundColor: contribColors[cell.level] ?? contribColors[0] }"
                      :title="`${cell.count} · ${cell.date}`"
                    />
                    <span v-else class="h-[10px] w-[10px]" />
                  </template>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="mt-4 rounded-xl border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
            {{ store.t.stats.contributionsUnavailable }}
          </div>
        </div>

        <!-- GitHub top languages -->
        <div class="mt-6 rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800">
          <h3 class="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            {{ store.t.stats.topLanguages }}
          </h3>
          <div class="mt-4 space-y-3">
            <div v-for="l in gh.topLanguages.value" :key="l.name" class="flex items-center gap-3">
              <span class="w-28 shrink-0 truncate text-sm text-neutral-700 dark:text-neutral-300">{{ l.name }}</span>
              <div class="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                <motion.div
                  class="h-full rounded-full"
                  :initial="{ width: 0 }"
                  :whileInView="{ width: `${l.percent}%` }"
                  :viewport="{ once: true }"
                  :transition="{ duration: 0.8, ease: 'easeOut' }"
                  :style="{ backgroundColor: ghLangColor(l.name) }"
                />
              </div>
              <span class="w-10 shrink-0 text-right text-xs text-neutral-500 dark:text-neutral-400">{{ l.percent }}%</span>
            </div>
          </div>
        </div>

        <!-- GitHub top repos -->
        <StaggerGroup v-if="gh.topRepos.value.length" class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StaggerItem v-for="r in gh.topRepos.value" :key="r.id">
            <a
              :href="r.html_url"
              target="_blank"
              rel="noopener noreferrer"
              class="group block rounded-2xl border border-neutral-200 p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:border-neutral-800"
            >
              <div class="flex items-start justify-between gap-3">
                <p class="truncate text-sm font-semibold text-neutral-900 dark:text-neutral-100">{{ r.name }}</p>
                <span class="flex shrink-0 items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.26L21.5 9.3l-4.75 4.53 1.15 6.67L12 17.77l-5.9 3.23 1.15-6.67L2.5 9.3l6.6-1.04z"/></svg>
                  {{ r.stargazers_count }}
                </span>
              </div>
              <p class="mt-2 line-clamp-2 text-sm text-neutral-500 dark:text-neutral-400">
                {{ r.description || store.t.stats.noDescription }}
              </p>
              <div class="mt-3 flex items-center gap-3">
                <span v-if="r.language" class="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                  <span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: ghLangColor(r.language) }" />
                  {{ r.language }}
                </span>
                <span class="text-xs text-neutral-500 dark:text-neutral-400">★ {{ r.stargazers_count }} · ⑂ {{ r.forks_count }}</span>
              </div>
            </a>
          </StaggerItem>
        </StaggerGroup>
      </template>
    </section>

    <!-- ================= WakaTime ================= -->
    <section class="mt-12">
      <h2 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        {{ store.t.stats.wakatime }}
      </h2>

      <WakaTimeSkeleton v-if="wt.loading.value" class="mt-4" />

      <template v-else-if="wtData">
        <!-- Summary cards -->
        <StaggerGroup class="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-3">
          <StaggerItem class="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
            <p class="text-xs text-neutral-500 dark:text-neutral-400">{{ store.t.stats.startDate }}</p>
            <p class="mt-1.5 text-base font-bold text-neutral-900 dark:text-neutral-100">{{ fmtDate(startDate) }}</p>
          </StaggerItem>
          <StaggerItem class="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
            <p class="text-xs text-neutral-500 dark:text-neutral-400">{{ store.t.stats.endDate }}</p>
            <p class="mt-1.5 text-base font-bold text-neutral-900 dark:text-neutral-100">{{ fmtDate(endDate) }}</p>
          </StaggerItem>
          <StaggerItem class="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
            <p class="text-xs text-neutral-500 dark:text-neutral-400">{{ store.t.stats.avgDailyTime }}</p>
            <p class="mt-1.5 text-base font-bold text-neutral-900 dark:text-neutral-100">{{ avgDaily }}</p>
          </StaggerItem>
          <StaggerItem class="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
            <p class="text-xs text-neutral-500 dark:text-neutral-400">{{ store.t.stats.totalThisWeek }}</p>
            <p class="mt-1.5 text-base font-bold text-neutral-900 dark:text-neutral-100">{{ fmtHm(totalSeconds) }}</p>
          </StaggerItem>
          <StaggerItem class="col-span-2 rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800 lg:col-span-1">
            <p class="text-xs text-neutral-500 dark:text-neutral-400">{{ store.t.stats.bestDay }}</p>
            <p class="mt-1.5 text-base font-bold text-neutral-900 dark:text-neutral-100">{{ bestDayLabel }}</p>
          </StaggerItem>
          <StaggerItem class="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
            <p class="text-xs text-neutral-500 dark:text-neutral-400">{{ store.t.stats.allTimeCoding }}</p>
            <p class="mt-1.5 text-base font-bold text-neutral-900 dark:text-neutral-100">{{ allTimeLabel }}</p>
          </StaggerItem>
        </StaggerGroup>

        <!-- Daily breakdown -->
        <div class="mt-6 rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              {{ store.t.stats.dailyBreakdown }}
            </h3>
            <span class="text-xs text-neutral-500 dark:text-neutral-400">{{ store.t.stats.last7Days }}</span>
          </div>
          <div class="mt-6 flex h-40 items-end gap-2">
            <div v-for="(d, i) in dailyBars" :key="d.date" class="group flex h-full flex-1 flex-col items-center justify-end gap-2">
              <span class="hidden text-[10px] text-neutral-500 group-hover:block dark:text-neutral-400">
                {{ fmtHm(d.seconds) }}
              </span>
              <motion.div
                class="w-full rounded-t-md bg-neutral-200 transition-colors group-hover:bg-accent dark:bg-neutral-800"
                :initial="{ height: '2%' }"
                :whileInView="{ height: `${d.height}%` }"
                :viewport="{ once: true }"
                :transition="{ duration: 0.7, delay: i * 0.06, ease: [0.21, 0.47, 0.32, 0.98] }"
              />
              <span class="text-xs text-neutral-500 dark:text-neutral-400">{{ d.label }}</span>
            </div>
          </div>
        </div>

        <!-- Languages / Editors -->
        <div class="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div class="rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800">
            <h3 class="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              {{ store.t.stats.topLanguages }}
            </h3>
            <div class="mt-4 space-y-3">
              <div v-for="l in wtLanguages" :key="l.name" class="flex items-center gap-3">
                <span class="w-28 shrink-0 truncate text-sm text-neutral-700 dark:text-neutral-300">{{ l.name }}</span>
                <div class="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                  <motion.div
                    class="h-full rounded-full"
                    :initial="{ width: 0 }"
                    :whileInView="{ width: `${(l.seconds / maxWtLangSeconds) * 100}%` }"
                    :viewport="{ once: true }"
                    :transition="{ duration: 0.8, ease: 'easeOut' }"
                    :style="{ backgroundColor: l.color }"
                  />
                </div>
                <span class="w-10 shrink-0 text-right text-xs text-neutral-500 dark:text-neutral-400">{{ l.percent }}%</span>
              </div>
            </div>
          </div>

          <div class="rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800">
            <h3 class="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              {{ store.t.stats.editors }}
            </h3>
            <div class="mt-4 space-y-3">
              <div v-for="e in wtEditors" :key="e.name" class="flex items-center gap-3">
                <span class="w-28 shrink-0 truncate text-sm text-neutral-700 dark:text-neutral-300">{{ e.name }}</span>
                <div class="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                  <motion.div
                    class="h-full rounded-full bg-accent"
                    :initial="{ width: 0 }"
                    :whileInView="{ width: `${(e.seconds / maxWtEditorSeconds) * 100}%` }"
                    :viewport="{ once: true }"
                    :transition="{ duration: 0.8, ease: 'easeOut' }"
                  />
                </div>
                <span class="w-10 shrink-0 text-right text-xs text-neutral-500 dark:text-neutral-400">{{ e.percent }}%</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </section>
  </PageHeader>
</template>