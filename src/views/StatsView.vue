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
// Round total minutes first, then split. Rounding hours and minutes independently
// could produce an inconsistent pair like "40h 60m".
function splitHm(seconds) {
  const totalMin = Math.round(seconds / 60)
  return { h: Math.floor(totalMin / 60), m: totalMin % 60 }
}

function fmtHm(seconds) {
  const { h, m } = splitHm(seconds)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

function fmtDayLabel(dateStr) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString(locale.value, { weekday: 'short' })
}

// --- WakaTime ---
const wtData = computed(() => wt.data.value)
const totalSeconds = computed(() => wtData.value?.totalSeconds ?? 0)

const avgDailySeconds = computed(() => {
  // Prefer WakaTime's official daily average so the card matches the dashboard
  const official = wtData.value?.dailyAverageSeconds
  if (typeof official === 'number' && official > 0) return official
  const days = (wtData.value?.daily ?? []).filter((d) => d.seconds > 0)
  if (!days.length) return null
  return Math.round(totalSeconds.value / days.length)
})

const allTimeSeconds = computed(() => {
  const s = wtData.value?.allTimeSeconds
  return typeof s === 'number' && s > 0 ? s : null
})

const avgHm = computed(() => (avgDailySeconds.value !== null ? splitHm(avgDailySeconds.value) : null))
const weekHm = computed(() => splitHm(totalSeconds.value))
const allTimeHm = computed(() => (allTimeSeconds.value !== null ? splitHm(allTimeSeconds.value) : null))

const dailyBars = computed(() => {
  const days = wtData.value?.daily ?? []
  const max = Math.max(...days.map((d) => d.seconds), 1)
  return days.map((d) => ({
    ...d,
    label: fmtDayLabel(d.date),
    height: Math.max((d.seconds / max) * 100, d.seconds > 0 ? 6 : 2),
  }))
})

// --- GitHub ---
const ghContribItems = computed(() => gh.contributions.value ?? [])

// --- GitHub contributions skyline (2D heat map that folds into a 3D skyline) ---
const skylineLabels = computed(() => store.t.skyline)
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
        <!-- Contribution skyline: mirror the real card so loading swaps without a jump -->
        <div v-if="gh.contributionsLoading.value" class="mt-4 rounded-2xl border border-neutral-200 p-3 sm:p-5 dark:border-neutral-800">
          <div class="mb-3 hidden items-center justify-between gap-4 sm:flex">
            <Skeleton w="w-64 max-w-full" h="h-4" rounded="rounded-md" />
            <Skeleton w="w-[76px] shrink-0" h="h-9" rounded="rounded-md" />
          </div>
          <Skeleton w="w-full" h="h-[80px] sm:h-[400px]" rounded="rounded-lg" />
          <div class="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Skeleton v-for="i in 4" :key="i" w="w-full" h="h-14" rounded="rounded-lg" />
          </div>
          <div class="mt-4 flex items-center justify-between gap-4">
            <Skeleton w="w-56 max-w-full" h="h-3" rounded="rounded-sm" />
            <Skeleton w="w-28 shrink-0" h="h-3" rounded="rounded-sm" />
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

      </template>
    </section>

    <!-- ================= WakaTime ================= -->
    <section class="mt-12">
      <h2 class="text-lg font-semibold text-black dark:text-white">
        {{ store.t.stats.wakatime }}
      </h2>

      <WakaTimeSkeleton v-if="wt.loading.value" class="mt-4" />

      <template v-else-if="wtData">
        <p v-if="wt.stale.value" class="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
          {{ store.t.stats.cachedNote }}
        </p>

        <!-- Summary cards -->
        <StaggerGroup class="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-3">
          <StaggerItem class="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
            <p class="text-xs text-black dark:text-white">{{ store.t.stats.avgDailyTime }}</p>
            <p class="mt-1.5 font-bebas text-3xl leading-none text-black dark:text-white sm:text-4xl">
              <template v-if="avgHm">
                <template v-if="avgHm.h > 0">
                  <AnimatedNumber :value="avgHm.h" :locale="locale" /><span class="font-sans text-base sm:text-lg">h</span>
                  {{ ' ' }}
                </template>
                <AnimatedNumber :value="avgHm.m" :locale="locale" /><span class="font-sans text-base sm:text-lg">m</span>
              </template>
              <template v-else>--</template>
            </p>
          </StaggerItem>
          <StaggerItem class="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
            <p class="text-xs text-black dark:text-white">{{ store.t.stats.totalThisWeek }}</p>
            <p class="mt-1.5 font-bebas text-3xl leading-none text-black dark:text-white sm:text-4xl">
              <template v-if="weekHm.h > 0">
                <AnimatedNumber :value="weekHm.h" :locale="locale" /><span class="font-sans text-base sm:text-lg">h</span>
                {{ ' ' }}
              </template>
              <AnimatedNumber :value="weekHm.m" :locale="locale" /><span class="font-sans text-base sm:text-lg">m</span>
            </p>
          </StaggerItem>
          <StaggerItem class="col-span-2 rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800 lg:col-span-1">
            <p class="text-xs text-black dark:text-white">{{ store.t.stats.allTimeCoding }}</p>
            <p class="mt-1.5 font-bebas text-3xl leading-none text-black dark:text-white sm:text-4xl">
              <template v-if="allTimeHm">
                <template v-if="allTimeHm.h > 0">
                  <AnimatedNumber :value="allTimeHm.h" :locale="locale" /><span class="font-sans text-base sm:text-lg">h</span>
                  {{ ' ' }}
                </template>
                <AnimatedNumber :value="allTimeHm.m" :locale="locale" /><span class="font-sans text-base sm:text-lg">m</span>
              </template>
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
      </template>
    </section>
  </PageHeader>
</template>
