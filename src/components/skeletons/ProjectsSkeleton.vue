<script setup>
import Skeleton from '@/components/atoms/BaseSkeleton.vue'

// Mirrors ProjectsView: header + filter pills + ProjectCard grid.
</script>

<template>
  <div role="status" aria-busy="true" aria-label="Loading projects page" class="py-6 lg:py-10">
    <Skeleton w="w-48" h="h-8" rounded="rounded-xl" />
    <div class="mt-3 space-y-2">
      <Skeleton w="w-full max-w-2xl" h="h-4" />
      <Skeleton w="w-2/3 max-w-xl" h="h-4" />
    </div>

    <!-- FilterPill: px-4 py-1.5 text-sm rounded-full with count badge -->
    <div class="mt-8 flex flex-wrap gap-2">
      <Skeleton
        v-for="i in 5"
        :key="i"
        w="w-24"
        h="h-8"
        rounded="rounded-full"
      />
    </div>

    <!-- ProjectCard grid: card = media (~1280x580 ≈ 2.2:1) + body (p-6): category, title, stack icons pinned bottom -->
    <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div
        v-for="i in 4"
        :key="i"
        class="flex flex-col overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800"
      >
        <div class="skeleton-shimmer aspect-[1280/580] w-full border-b border-neutral-200 dark:border-neutral-800" aria-hidden="true" />
        <div class="flex flex-1 flex-col p-6">
          <!-- category -->
          <Skeleton w="w-20" h="h-3" />
          <!-- title -->
          <Skeleton w="w-3/4" h="h-5" rounded="rounded-md" class="mt-3" />
          <!-- stack icons pinned to bottom -->
          <div class="mt-auto flex items-center gap-2 pt-6">
            <Skeleton w="w-7" h="h-7" rounded="rounded-lg" />
            <Skeleton w="w-7" h="h-7" rounded="rounded-lg" />
            <Skeleton w="w-7" h="h-7" rounded="rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
