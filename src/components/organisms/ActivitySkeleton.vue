<script setup>
defineProps({
  /** Number of skeleton rows */
  count: { type: Number, default: 10 },
})
</script>

<template>
  <div class="space-y-3">
    <div v-for="i in count" :key="i" class="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
      <!-- Avatar line -->
      <div class="skeleton-shimmer w-9 h-9 rounded-full mb-3" />
      <!-- Message lines -->
      <div class="skeleton-shimmer w-full h-4 mb-2" />
      <div class="skeleton-shimmer w-3/4 h-4" />
    </div>
  </div>
</template>
