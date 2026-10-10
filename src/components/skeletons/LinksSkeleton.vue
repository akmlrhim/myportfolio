<script setup>
import Skeleton from '@/components/atoms/BaseSkeleton.vue'

// Mirrors LinksView: header + stacked social link rows.
</script>

<template>
  <div role="status" aria-busy="true" aria-label="Loading links page" class="py-6 lg:py-10">
    <Skeleton w="w-48" h="h-8" rounded="rounded-xl" />
    <div class="mt-4 space-y-2">
      <Skeleton w="w-full max-w-2xl" h="h-4" />
      <Skeleton w="w-2/3 max-w-xl" h="h-4" />
    </div>

    <div class="mt-8 space-y-3">
      <div
        v-for="i in 6"
        :key="i"
        class="flex max-w-md items-center gap-3 rounded-xl border border-neutral-200 px-4 py-3 dark:border-neutral-800"
      >
        <Skeleton w="w-5" h="h-5" rounded="rounded" />
        <Skeleton w="w-28" h="h-4" />
        <Skeleton w="w-4" h="h-4" rounded="rounded" class="ml-auto" />
      </div>
    </div>
  </div>
</template>
