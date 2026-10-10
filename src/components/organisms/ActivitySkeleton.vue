<script setup>
// Mirrors the commit row in ActivityView:
// rounded-lg card, px-4 py-3, header (repo pill + time),
// single truncated message line, and a small SHA footer line.
defineProps({
  /** Number of skeleton rows */
  count: { type: Number, default: 10 },
})
</script>

<template>
  <div class="space-y-2">
    <div
      v-for="i in count"
      :key="i"
      class="rounded-lg border border-neutral-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <!-- Header: repo pill (left) + time (right) -->
      <div class="mb-1.5 flex items-start justify-between gap-3">
        <div class="skeleton-shimmer h-5 w-24 rounded-full" />
        <div class="skeleton-shimmer h-3 w-16 rounded-md" />
      </div>

      <!-- Message (single truncated line) -->
      <div class="skeleton-shimmer h-4 w-full max-w-md rounded-md" />

      <!-- Footer: SHA -->
      <div class="skeleton-shimmer mt-1.5 h-2.5 w-28 rounded-sm" />
    </div>
  </div>
</template>
