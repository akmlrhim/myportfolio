<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { useCommits } from '@/composables/useCommits'
import PageHeader from '@/components/organisms/PageHeader.vue'
import ActivitySkeleton from '@/components/organisms/ActivitySkeleton.vue'
import StaggerGroup from '@/components/motion/StaggerGroup.vue'
import StaggerItem from '@/components/motion/StaggerItem.vue'
import { motion } from 'motion-v'

const store = useAppStore()
const { loading, error, commits, fetchCommits } = useCommits()

const locale = computed(() => (store.lang === 'id' ? 'id-ID' : 'en-US'))
const commitIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><line x1="3" x2="9" y1="12" y2="12"/><line x1="15" x2="21" y1="12" y2="12"/></svg>`

/**
 * Format ISO date to relative time ("2 days ago" / "2 hari lalu").
 */
function timeAgo(isoDate) {
  const now = Date.now()
  const then = new Date(isoDate).getTime()
  const diffSec = Math.floor((now - then) / 1000)

  const units = [
    { unit: 'year', sec: 31536000 },
    { unit: 'month', sec: 2592000 },
    { unit: 'week', sec: 604800 },
    { unit: 'day', sec: 86400 },
    { unit: 'hour', sec: 3600 },
    { unit: 'minute', sec: 60 },
    { unit: 'second', sec: 1 },
  ]

  const rtf = new Intl.RelativeTimeFormat(locale.value, { numeric: 'auto' })

  for (const { unit, sec } of units) {
    if (diffSec >= sec) {
      const value = -Math.floor(diffSec / sec)
      return rtf.format(value, unit)
    }
  }
  return rtf.format(0, 'second')
}
</script>

<template>
  <PageHeader :title="store.t.page.activity" :description="store.t.page.activityDesc">
    <!-- Loading state -->
    <ActivitySkeleton v-if="loading && commits.length === 0" :count="10" />

    <!-- Error state -->
    <motion.div
      v-else-if="error && commits.length === 0"
      :initial="{ opacity: 0, y: 12 }"
      :animate="{ opacity: 1, y: 0 }"
      class="mt-8 rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/50 dark:bg-red-950/30"
    >
      <p class="text-sm text-red-700 dark:text-red-300">{{ store.t.activity.failedToLoad }}</p>
      <button
        @click="fetchCommits()"
        class="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
      >
        {{ store.t.activity.retry }}
      </button>
    </motion.div>

    <!-- Empty state -->
    <motion.div
      v-else-if="!loading && commits.length === 0"
      :initial="{ opacity: 0, y: 12 }"
      :animate="{ opacity: 1, y: 0 }"
      class="mt-8 rounded-xl border border-neutral-200 bg-neutral-50 p-8 text-center dark:border-neutral-800 dark:bg-neutral-900/50"
    >
      <p class="text-sm text-neutral-600 dark:text-neutral-400">{{ store.t.activity.noCommits }}</p>
    </motion.div>

    <!-- Commit list (10 most recent) -->
    <div v-else class="mt-8 space-y-2">
      <StaggerGroup class="space-y-2" :stagger="0.05">
        <StaggerItem v-for="commit in commits" :key="commit.fullSha">
          <a
            :href="commit.url"
            target="_blank"
            rel="noopener noreferrer"
            class="group block rounded-lg border border-neutral-200 bg-white px-4 py-3 transition-all hover:border-neutral-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
          >
            <!-- Header: repo + time -->
            <div class="flex items-start justify-between gap-3 mb-1.5">
              <span
                class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
              >
                <span v-html="commitIcon" class="opacity-60" />
                {{ commit.repo }}
              </span>
              <time
                :datetime="commit.date"
                class="shrink-0 text-[10px] text-neutral-500 dark:text-neutral-400"
              >
                {{ timeAgo(commit.date) }}
              </time>
            </div>

            <!-- Message (single line, CSS truncation at end) -->
            <p class="truncate text-sm font-medium text-neutral-900 group-hover:text-neutral-700 dark:text-neutral-100 dark:group-hover:text-neutral-200">
              {{ commit.message }}
            </p>

            <!-- Footer: SHA -->
            <code class="mt-0.5 inline-block text-[10px] leading-none text-neutral-500 dark:text-neutral-400">
              {{ commit.sha }} &middot; {{ commit.owner }}
            </code>
          </a>
        </StaggerItem>
      </StaggerGroup>
    </div>
  </PageHeader>
</template>