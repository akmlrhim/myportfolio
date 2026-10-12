<script setup>
defineProps({
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
      <div class="mb-1.5 flex items-start justify-between gap-3">
        <div class="skeleton-shimmer h-5 w-24 rounded-full" />
        <div class="skeleton-shimmer h-4 w-16 rounded-md" />
      </div>

      <div class="skeleton-shimmer h-5 w-2/3 max-w-md rounded-md" />

      <div class="skeleton-shimmer mt-0.5 h-2.5 w-32 rounded-sm" />
    </div>
  </div>
</template>
