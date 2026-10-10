<script setup>
import Skeleton from '@/components/atoms/BaseSkeleton.vue'
import StatCardSkeleton from '@/components/atoms/StatCardSkeleton.vue'

const CARD_COUNT = 7
</script>

<template>
  <div aria-busy="true" aria-label="Loading GitHub stats">
    <div class="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCardSkeleton v-for="i in CARD_COUNT" :key="i" order="value-first" />
    </div>

    <!-- Contribution graph skeleton -->
    <div class="mt-6 rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800">
      <Skeleton w="w-40" h="h-3" />
      <div class="mt-4 flex gap-[3px]">
        <div
          v-for="week in 40"
          :key="week"
          class="flex flex-col gap-[3px]"
        >
          <Skeleton
            v-for="day in 7"
            :key="day"
            w="w-[10px]"
            h="h-[10px]"
            rounded="rounded-[2px]"
          />
        </div>
      </div>
    </div>

    <!-- Languages skeleton -->
    <div class="mt-6 rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800">
      <Skeleton w="w-32" h="h-3" />
      <div class="mt-4 space-y-3">
        <div v-for="i in 6" :key="i" class="flex items-center gap-3">
          <Skeleton w="w-28" h="h-3.5" />
          <Skeleton w="w-full" h="h-2" rounded="rounded-full" class="flex-1" />
          <Skeleton w="w-10" h="h-3" />
        </div>
      </div>
    </div>
  </div>
</template>
