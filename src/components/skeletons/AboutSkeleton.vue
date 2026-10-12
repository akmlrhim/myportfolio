<script setup>
import Skeleton from '@/components/atoms/BaseSkeleton.vue'

// Mirrors AboutView: header + bio + education/experience timelines.
// Bullet counts follow src/data/about.js (2 edu points, 5 + 4 exp points).
const TIMELINES = [
  { points: [2] },
  { points: [5, 4] },
]
</script>

<template>
  <div role="status" aria-busy="true" aria-label="Loading about page" class="py-6 lg:py-10">
    <Skeleton w="w-48" h="h-8" rounded="rounded-xl" />
    <div class="mt-3 max-w-2xl space-y-2">
      <Skeleton w="w-full" h="h-4" />
      <Skeleton w="w-2/3" h="h-4" />
    </div>

    <!-- About Me: bio = 3 wrapped paragraphs -->
    <div class="mt-10 max-w-3xl">
      <Skeleton w="w-32" h="h-7" rounded="rounded-lg" />
      <div class="mt-4 space-y-4">
        <div v-for="p in 3" :key="p" class="space-y-2">
          <Skeleton w="w-full" h="h-4" />
          <Skeleton :w="p === 3 ? 'w-2/3' : 'w-11/12'" h="h-4" />
        </div>
      </div>
    </div>

    <!-- Education + Experience -->
    <div v-for="(section, ti) in TIMELINES" :key="ti" class="mt-12">
      <Skeleton w="w-28" h="h-7" rounded="rounded-lg" />
      <div class="mt-5 ml-5 space-y-8 border-l border-neutral-200 py-1 dark:border-neutral-800 lg:ml-1.5">
        <div v-for="(pointCount, i) in section.points" :key="i" class="relative pl-14">
          <Skeleton w="w-10" h="h-10" rounded="rounded-xl" class="absolute left-0 top-0 -translate-x-1/2" />
          <div class="flex items-baseline justify-between gap-x-3">
            <Skeleton w="w-1/3" h="h-6" rounded="rounded-md" />
            <Skeleton w="w-16" h="h-4" />
          </div>
          <Skeleton w="w-1/4" h="h-5" rounded="rounded-md" class="mt-0.5" />
          <div class="mt-2.5 space-y-1.5">
            <div v-for="pt in pointCount" :key="pt" class="flex gap-2">
              <span class="mt-[7px] h-1 w-1 flex-shrink-0 rounded-full bg-neutral-400 dark:bg-neutral-500" />
              <Skeleton :w="pt % 2 ? 'w-full' : 'w-11/12'" h="h-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
