<script setup>
import { ref } from 'vue'

defineProps({
  logo: String,
  title: String,
  subtitle: String,
  period: String,
  points: { type: Array, default: () => [] },
})

const logoFailed = ref(false)

function handleLogoError() {
  logoFailed.value = true
}
</script>

<template>
  <div class="relative pl-14">
    <!-- logo on the timeline (falls back to a dot when empty or broken) -->
    <img
      v-if="logo && !logoFailed"
      :src="logo"
      :alt="title"
      class="absolute left-0 top-0 w-10 h-10 -translate-x-1/2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white object-contain p-1.5"
      width="40"
      height="40"
      loading="lazy"
      decoding="async"
      @error="handleLogoError"
    />
    <span
      v-else
      class="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-blue-500 bg-white dark:bg-neutral-950 -translate-x-1/2"
    ></span>
    <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
      <h3 class="font-semibold text-neutral-900 dark:text-neutral-100">{{ title }}</h3>
      <span
        v-if="period"
        class="text-xs font-medium text-neutral-500 dark:text-neutral-400 whitespace-nowrap"
      >
        {{ period }}
      </span>
    </div>
    <p v-if="subtitle" class="mt-0.5 text-sm text-blue-600 dark:text-blue-400">{{ subtitle }}</p>
    <ul v-if="points.length" class="mt-2.5 space-y-1.5">
      <li
        v-for="(point, i) in points"
        :key="i"
        class="flex gap-2 text-sm text-neutral-600 dark:text-neutral-400"
      >
        <span class="mt-[7px] w-1 h-1 rounded-full bg-neutral-400 dark:bg-neutral-500 flex-shrink-0"></span>
        <span>{{ point }}</span>
      </li>
    </ul>
  </div>
</template>
