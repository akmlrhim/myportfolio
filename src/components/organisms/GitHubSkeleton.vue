<script setup>
import Skeleton from '@/components/atoms/BaseSkeleton.vue'

const REPO_CARDS = 6
const STAT_BLOCKS = 4
const LEGEND_SWATCHES = 5
</script>

<template>
  <div aria-busy="true" aria-label="Loading GitHub stats">
    <!-- Contribution skyline skeleton: mirrors the card header, canvas stage,
         stat row and legend of ContributionSkyline -->
    <div class="mt-4 rounded-2xl border border-neutral-200 p-3 sm:p-5 dark:border-neutral-800">
      <div class="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <Skeleton w="w-56" h="h-5" />
        <Skeleton w="w-[76px]" h="h-9" rounded="rounded-md" class="sm:h-7 sm:w-[68px]" />
      </div>

      <div class="rounded-lg border border-neutral-200 p-3 sm:p-4 dark:border-neutral-800">
        <Skeleton w="w-full" h="h-[180px] sm:h-[240px]" rounded="rounded-md" />
        <div class="mt-4 grid grid-cols-2 gap-x-3 gap-y-3 sm:gap-x-4 md:grid-cols-4">
          <div v-for="i in STAT_BLOCKS" :key="i" class="space-y-1.5">
            <Skeleton w="w-16" h="h-3" />
            <Skeleton w="w-14" h="h-7" />
            <Skeleton w="w-24" h="h-3" />
          </div>
        </div>
        <div class="mt-4 flex items-center justify-between gap-4">
          <Skeleton w="w-40" h="h-3" />
          <div class="flex shrink-0 items-center gap-1.5">
            <Skeleton w="w-8" h="h-3" />
            <Skeleton
              v-for="i in LEGEND_SWATCHES"
              :key="i"
              w="w-[11px]"
              h="h-[11px]"
              rounded="rounded-[2px]"
            />
            <Skeleton w="w-8" h="h-3" />
          </div>
        </div>
      </div>
    </div>

    <!-- Top repos skeleton -->
    <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="i in REPO_CARDS"
        :key="i"
        class="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800"
      >
        <div class="flex items-start justify-between gap-3">
          <Skeleton w="w-28" h="h-4" />
          <Skeleton w="w-8" h="h-4" />
        </div>
        <div class="mt-3 space-y-1.5">
          <Skeleton w="w-full" h="h-3" />
          <Skeleton w="w-3/4" h="h-3" />
        </div>
        <div class="mt-4 flex items-center gap-3">
          <Skeleton w="w-2.5" h="h-2.5" rounded="rounded-full" />
          <Skeleton w="w-20" h="h-3" />
        </div>
      </div>
    </div>
  </div>
</template>
