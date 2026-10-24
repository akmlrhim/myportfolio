<script setup>
import { computed } from 'vue'
import { motion } from 'motion-v'
import { useAppStore } from '@/stores/app'
import { useGitHub } from '@/composables/useGitHub'
import { useWakatime } from '@/composables/useWakatime'
import PageHeader from '@/components/organisms/PageHeader.vue'
import GitHubSkeleton from '@/components/organisms/GitHubSkeleton.vue'
import WakaTimeSkeleton from '@/components/organisms/WakaTimeSkeleton.vue'
import ContributionSkyline from '@/components/organisms/ContributionSkyline.vue'
import StaggerGroup from '@/components/motion/StaggerGroup.vue'
import StaggerItem from '@/components/motion/StaggerItem.vue'
import Skeleton from '@/components/atoms/BaseSkeleton.vue'
import AnimatedNumber from '@/components/atoms/AnimatedNumber.vue'

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
  if (!dateStr) return '--'
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

const avgDailySeconds = computed(() => {
  const days = (wtData.value?.daily ?? []).filter((d) => d.seconds > 0)
  if (!days.length) return null
  return Math.round(totalSeconds.value / days.length)
})

const allTimeSeconds = computed(() => {
  const s = wtData.value?.allTimeSeconds
  return typeof s === 'number' && s > 0 ? s : null
})

// Count-up friendly formatter: "24h 16m"
const fmtSecondsLocale = (seconds) => {
  const h = Math.floor(seconds / 3600)
  const m = Math.round((seconds % 3600) / 60)
  return h > 0 ? `${h.toLocaleString(locale.value)}h ${m}m` : `${m}m`
}

const bestDay = computed(() => {
  const days = wtData.value?.daily ?? []
  if (!days.length) return null
  return days.reduce((a, b) => (b.seconds > a.seconds ? b : a), days[0])
})

const bestDayLabel = computed(() => {
  const b = bestDay.value
  return b ? `${fmtDate(b.date)} (${fmtHm(b.seconds)})` : '--'
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

const wtLanguages = computed(() => {
  const total = totalSeconds.value || 1
  return (wtData.value?.languages ?? []).slice(0, 8).map((l) => ({
    ...l,
    percent: Math.round((l.seconds / total) * 100),
  }))
})

// --- GitHub ---
const ghContribItems = computed(() => gh.contributions.value ?? [])

// --- GitHub contributions skyline (2D heat map that folds into a 3D skyline) ---
const skylineLabels = computed(() => store.t.skyline)

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
</script>

<template>
  <PageHeader :title="store.t.page.stats" :description="store.t.page.statsDesc">
    <!-- ================= GitHub ================= -->
    <section class="mt-10">
      <h2 class="text-lg font-semibold text-black dark:text-white">
        {{ store.t.stats.github }}
      </h2>

      <GitHubSkeleton v-if="gh.loading.value" class="mt-4" />

      <div v-else-if="gh.error.value" class="mt-4 rounded-2xl border border-dashed border-neutral-300 p-8 text-center text-sm text-black dark:border-neutral-700 dark:text-white">
        {{ store.t.stats.failedToLoad }}
      </div>

      <template v-else>
        <!-- Contribution skyline -->
        <div v-if="gh.contributionsLoading.value" class="mt-4 rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800">
          <h3 class="text-sm font-semibold uppercase tracking-wide text-black dark:text-white">
            {{ store.t.stats.contributionGraph }}
          </h3>
          <!-- 18 weeks fit a 320px phone; the full 40 weeks appear from sm up -->
          <div class="mt-4 flex gap-[3px] overflow-hidden">
            <div
              v-for="week in 40"
              :key="week"
              class="flex-col gap-[3px]"
              :class="week <= 22 ? 'hidden sm:flex' : 'flex'"
            >
              <Skeleton
                v-for="day in 7"
                :key="day"
                w="w-[10px]"
                h="h-[10px]"
                rounded="rounded-[2px]"
              />
            </div>
          </div>
        </div>

        <ContributionSkyline
          v-else-if="ghContribItems.length"
          class="mt-4"
          :data="ghContribItems"
          :locale="locale"
          :labels="skylineLabels"
        />

        <div
          v-else
          class="mt-4 rounded-2xl border border-dashed border-neutral-300 p-8 text-center text-sm text-black dark:border-neutral-700 dark:text-white"
        >
          {{ store.t.stats.contributionsUnavailable }}
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
                <p class="truncate text-sm font-semibold text-black dark:text-white">{{ r.name }}</p>
                <span class="flex shrink-0 items-center gap-1 text-xs text-black dark:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.26L21.5 9.3l-4.75 4.53 1.15 6.67L12 17.77l-5.9 3.23 1.15-6.67L2.5 9.3l6.6-1.04z"/></svg>
                  <AnimatedNumber :value="r.stargazers_count" :duration="0.9" />
                </span>
              </div>
              <p class="mt-2 line-clamp-2 text-sm text-black dark:text-white">
                {{ r.description || store.t.stats.noDescription }}
              </p>
              <div class="mt-3 flex items-center gap-3">
                <span v-if="r.language" class="flex items-center gap-1.5 text-xs text-black dark:text-white">
                  <span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: ghLangColor(r.language) }" />
                  {{ r.language }}
                </span>
                <span class="text-xs text-black dark:text-white">★ <AnimatedNumber :value="r.stargazers_count" :duration="0.9" /> · ⑂ <AnimatedNumber :value="r.forks_count" :duration="0.9" /></span>
              </div>
            </a>
          </StaggerItem>
        </StaggerGroup>
      </template>
    </section>

    <!-- ================= WakaTime ================= -->
    <section class="mt-12">
      <h2 class="text-lg font-semibold text-black dark:text-white">
        {{ store.t.stats.wakatime }}
      </h2>

      <WakaTimeSkeleton v-if="wt.loading.value" class="mt-4" />

      <template v-else-if="wtData">
        <!-- Summary cards -->
        <StaggerGroup class="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-3">
          <StaggerItem class="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
            <p class="text-xs text-black dark:text-white">{{ store.t.stats.startDate }}</p>
            <p class="mt-1.5 text-base font-bold text-black dark:text-white">{{ fmtDate(startDate) }}</p>
          </StaggerItem>
          <StaggerItem class="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
            <p class="text-xs text-black dark:text-white">{{ store.t.stats.endDate }}</p>
            <p class="mt-1.5 text-base font-bold text-black dark:text-white">{{ fmtDate(endDate) }}</p>
          </StaggerItem>
          <StaggerItem class="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
            <p class="text-xs text-black dark:text-white">{{ store.t.stats.avgDailyTime }}</p>
            <p class="mt-1.5 text-base font-bold text-black dark:text-white">
              <AnimatedNumber v-if="avgDailySeconds !== null" :value="avgDailySeconds" :format="fmtSecondsLocale" />
              <template v-else>--</template>
            </p>
          </StaggerItem>
          <StaggerItem class="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
            <p class="text-xs text-black dark:text-white">{{ store.t.stats.totalThisWeek }}</p>
            <p class="mt-1.5 text-base font-bold text-black dark:text-white">
              <AnimatedNumber :value="totalSeconds" :format="fmtHm" />
            </p>
          </StaggerItem>
          <StaggerItem class="col-span-2 rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800 lg:col-span-1">
            <p class="text-xs text-black dark:text-white">{{ store.t.stats.bestDay }}</p>
            <p class="mt-1.5 text-base font-bold text-black dark:text-white">{{ bestDayLabel }}</p>
          </StaggerItem>
          <StaggerItem class="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
            <p class="text-xs text-black dark:text-white">{{ store.t.stats.allTimeCoding }}</p>
            <p class="mt-1.5 text-base font-bold text-black dark:text-white">
              <AnimatedNumber v-if="allTimeSeconds !== null" :value="allTimeSeconds" :format="fmtSecondsLocale" />
              <template v-else>--</template>
            </p>
          </StaggerItem>
        </StaggerGroup>

        <!-- Daily breakdown -->
        <div class="mt-6 rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-semibold uppercase tracking-wide text-black dark:text-white">
              {{ store.t.stats.dailyBreakdown }}
            </h3>
            <span class="text-xs text-black dark:text-white">{{ store.t.stats.last7Days }}</span>
          </div>
          <div class="mt-6 flex h-40 items-end gap-2">
            <div v-for="(d, i) in dailyBars" :key="d.date" class="group flex h-full flex-1 flex-col items-center justify-end gap-2">
              <span class="hidden text-[10px] text-black group-hover:block dark:text-white">
                {{ fmtHm(d.seconds) }}
              </span>
              <motion.div
                class="w-full rounded-t-md bg-neutral-200 transition-colors group-hover:bg-accent dark:bg-neutral-800"
                :initial="{ height: '2%' }"
                :whileInView="{ height: `${d.height}%` }"
                :viewport="{ once: true }"
                :transition="{ duration: 0.7, delay: i * 0.06, ease: [0.21, 0.47, 0.32, 0.98] }"
              />
              <span class="text-xs text-black dark:text-white">{{ d.label }}</span>
            </div>
          </div>
        </div>

        <!-- Languages -->
        <div class="mt-6 rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800">
          <h3 class="text-sm font-semibold uppercase tracking-wide text-black dark:text-white">
            {{ store.t.stats.topLanguages }}
          </h3>
          <div class="mt-4 space-y-3">
            <div v-for="l in wtLanguages" :key="l.name" class="flex items-center gap-3">
              <span class="w-28 shrink-0 truncate text-sm text-black dark:text-white">{{ l.name }}</span>
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
              <span class="w-10 shrink-0 text-right text-xs text-black dark:text-white"><AnimatedNumber :value="l.percent" :decimals="0" suffix="%" :duration="0.8" /></span>
            </div>
          </div>
        </div>
      </template>
    </section>
  </PageHeader>
</template>
