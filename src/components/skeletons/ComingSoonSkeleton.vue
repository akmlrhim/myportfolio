<script setup>
import Skeleton from '@/components/atoms/BaseSkeleton.vue'

// Mirrors CreationsView / AchievementsView: header + coming-soon card.
</script>

<template>
  <div role="status" aria-busy="true" aria-label="Loading page" class="py-6 lg:py-10">
    <Skeleton w="w-56" h="h-8" rounded="rounded-xl" />
    <div class="mt-4 space-y-2">
      <Skeleton w="w-full max-w-2xl" h="h-4" />
      <Skeleton w="w-2/3 max-w-xl" h="h-4" />
    </div>

    <div class="mt-8 rounded-2xl border border-dashed border-neutral-300 p-6 dark:border-neutral-700">
      <Skeleton w="w-48" h="h-4" />
      <Skeleton w="w-64" h="h-3" class="mt-3" />
    </div>
  </div>
</template>
