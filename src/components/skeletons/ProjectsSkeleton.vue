<script setup>
import Skeleton from '@/components/atoms/BaseSkeleton.vue'

// Mirrors ProjectsView: header + filter pills + project table.
</script>

<template>
  <div role="status" aria-busy="true" aria-label="Loading projects page" class="py-6 lg:py-10">
    <Skeleton w="w-48" h="h-8" rounded="rounded-xl" />
    <div class="mt-4 space-y-2">
      <Skeleton w="w-full max-w-2xl" h="h-4" />
      <Skeleton w="w-2/3 max-w-xl" h="h-4" />
    </div>

    <!-- Filter pills -->
    <div class="mt-8 flex flex-wrap gap-2">
      <Skeleton
        v-for="i in 5"
        :key="i"
        w="w-24"
        h="h-9"
        rounded="rounded-full"
      />
    </div>

    <!-- Project table -->
    <div class="mt-6 overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-800">
      <div class="flex items-center gap-4 border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
        <Skeleton w="w-1/3" h="h-3" />
        <Skeleton w="w-1/4" h="h-3" />
        <Skeleton w="w-16" h="h-3" class="ml-auto" />
      </div>
      <div
        v-for="i in 6"
        :key="i"
        class="flex items-center gap-4 border-b border-neutral-100 px-4 py-3.5 last:border-0 dark:border-neutral-800/60"
      >
        <Skeleton w="w-2/5" h="h-4" />
        <div class="flex flex-1 gap-2">
          <Skeleton w="w-4" h="h-4" rounded="rounded" />
          <Skeleton w="w-4" h="h-4" rounded="rounded" />
          <Skeleton w="w-4" h="h-4" rounded="rounded" />
        </div>
        <div class="flex gap-3">
          <Skeleton w="w-4" h="h-4" rounded="rounded" />
          <Skeleton w="w-4" h="h-4" rounded="rounded" />
        </div>
      </div>
    </div>
  </div>
</template>
