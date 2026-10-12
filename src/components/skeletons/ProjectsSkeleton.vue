<script setup>
import Skeleton from '@/components/atoms/BaseSkeleton.vue'

// Mirrors ProjectsView: header + filter pills + ProjectCard grid + pagination.
</script>

<template>
  <div role="status" aria-busy="true" aria-label="Loading projects page" class="py-6 lg:py-10">
    <Skeleton w="w-48" h="h-8" rounded="rounded-xl" />
    <div class="mt-3 max-w-2xl space-y-2">
      <Skeleton w="w-full" h="h-4" />
      <Skeleton w="w-2/3" h="h-4" />
    </div>

    <!-- ProjectFilters: mt-8 flex flex-wrap gap-2 -->
    <div class="mt-8 flex flex-wrap gap-2">
      <Skeleton v-for="i in 5" :key="i" w="w-24" h="h-8" rounded="rounded-full" />
    </div>

    <!-- ProjectCard grid: 8 per page, rounded-2xl border, media + body + pinned stack -->
    <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div
        v-for="i in 8"
        :key="i"
        class="flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950"
      >
        <div class="skeleton-shimmer aspect-[1280/580] w-full" aria-hidden="true" />
        <div class="flex flex-1 flex-col p-6">
          <!-- category + arrow -->
          <div class="flex items-start justify-between gap-3">
            <Skeleton w="w-20" h="h-5" />
            <Skeleton w="w-[18px]" h="h-[18px]" rounded="rounded-sm" />
          </div>
          <!-- title -->
          <Skeleton w="w-3/4" h="h-6" rounded="rounded-md" class="mt-3" />
          <!-- stack icons pinned to bottom (max 5 shown) -->
          <div class="mt-auto flex items-center gap-2 pt-6">
            <Skeleton v-for="k in 5" :key="k" w="w-7" h="h-7" rounded="rounded-lg" />
          </div>
        </div>
      </div>
    </div>

    <!-- ProjectPagination: nav mt-10 (9 projects / 8 per page = 2 pages) -->
    <div class="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
      <Skeleton w="w-32" h="h-5" />
      <div class="flex items-center gap-1.5">
        <Skeleton w="w-20" h="h-9" rounded="rounded-full" />
        <Skeleton v-for="i in 2" :key="i" w="w-9" h="h-9" rounded="rounded-full" />
        <Skeleton w="w-20" h="h-9" rounded="rounded-full" />
      </div>
    </div>
  </div>
</template>
