<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'

const store = useAppStore()

const current = computed(() => store.currentPage)
const total = computed(() => store.projectTotalPages)

// Compact page list with ellipses for larger sets (e.g. 1 … 4 5 6 … 12).
const pages = computed(() => {
  const t = total.value
  const c = current.value
  if (t <= 7) return Array.from({ length: t }, (_, i) => i + 1)

  const set = new Set([1, t, c, c - 1, c + 1])
  if (c <= 3) [2, 3, 4].forEach((n) => set.add(n))
  if (c >= t - 2) [t - 1, t - 2, t - 3].forEach((n) => set.add(n))

  const sorted = [...set].filter((n) => n >= 1 && n <= t).sort((a, b) => a - b)
  const out = []
  let prev = 0
  for (const n of sorted) {
    if (n - prev > 1) out.push('…')
    out.push(n)
    prev = n
  }
  return out
})

const pageInfo = computed(() =>
  store.t.projects.pageInfo
    .replace('{page}', String(current.value))
    .replace('{total}', String(total.value)),
)

function go(page) {
  store.setProjectPage(page)
  if (typeof window !== 'undefined') {
    document.getElementById('projects-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<template>
  <nav
    v-if="total > 1"
    class="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-between"
    :aria-label="pageInfo"
  >
    <p class="text-sm font-medium text-neutral-400 dark:text-neutral-500">
      {{ pageInfo }}
    </p>

    <div class="flex items-center gap-1.5">
      <!-- Prev -->
      <button
        type="button"
        class="inline-flex h-9 items-center gap-1.5 rounded-full border border-neutral-200 px-3.5 text-sm font-medium text-neutral-600 transition-colors hover:border-neutral-300 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-neutral-200 disabled:hover:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent dark:border-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:text-neutral-100 dark:disabled:hover:border-neutral-800 dark:disabled:hover:text-neutral-400"
        :disabled="current === 1"
        :aria-label="store.t.projects.prev"
        @click="go(current - 1)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="m15 18-6-6 6-6" />
        </svg>
        <span class="hidden sm:inline">{{ store.t.projects.prev }}</span>
      </button>

      <!-- Page numbers -->
      <ul class="flex items-center gap-1.5">
        <li v-for="(p, i) in pages" :key="`${p}-${i}`">
          <span
            v-if="p === '…'"
            class="flex h-9 w-9 select-none items-center justify-center text-sm text-neutral-400 dark:text-neutral-600"
            aria-hidden="true"
          >
            …
          </span>
          <button
            v-else
            type="button"
            class="inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            :class="
              p === current
                ? 'bg-accent text-white'
                : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
            "
            :aria-current="p === current ? 'page' : undefined"
            :aria-label="`Page ${p}`"
            @click="go(p)"
          >
            {{ p }}
          </button>
        </li>
      </ul>

      <!-- Next -->
      <button
        type="button"
        class="inline-flex h-9 items-center gap-1.5 rounded-full border border-neutral-200 px-3.5 text-sm font-medium text-neutral-600 transition-colors hover:border-neutral-300 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-neutral-200 disabled:hover:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent dark:border-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:text-neutral-100 dark:disabled:hover:border-neutral-800 dark:disabled:hover:text-neutral-400"
        :disabled="current === total"
        :aria-label="store.t.projects.next"
        @click="go(current + 1)"
      >
        <span class="hidden sm:inline">{{ store.t.projects.next }}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
  </nav>
</template>
