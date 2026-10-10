<script setup>
import Skeleton from '@/components/atoms/BaseSkeleton.vue'
import StatCardSkeleton from '@/components/atoms/StatCardSkeleton.vue'

const SUMMARY_CARDS = 6
</script>

<template>
  <div aria-busy="true" aria-label="Loading WakaTime stats">
    <div class="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-3">
      <StatCardSkeleton
        v-for="i in SUMMARY_CARDS"
        :key="i"
        order="label-first"
        :class="{ 'col-span-2 lg:col-span-1': i === 5 }"
      />
    </div>

    <!-- Daily breakdown skeleton -->
    <div class="mt-6 rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800">
      <div class="flex items-center justify-between">
        <Skeleton w="w-36" h="h-3" />
        <Skeleton w="w-16" h="h-3" />
      </div>
      <div class="mt-6 flex h-40 items-end gap-2">
        <Skeleton
          v-for="(barHeight, i) in ['h-16', 'h-28', 'h-10', 'h-32', 'h-20', 'h-36', 'h-24']"
          :key="i"
          w="w-full"
          :h="barHeight"
          rounded="rounded-t-md"
          class="flex-1"
        />
      </div>
    </div>

    <!-- Languages skeleton -->
    <div class="mt-6 rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800">
      <Skeleton w="w-28" h="h-3" />
      <div class="mt-4 space-y-3">
        <div v-for="i in 5" :key="i" class="flex items-center gap-3">
          <Skeleton w="w-28" h="h-3.5" />
          <Skeleton w="w-full" h="h-2" rounded="rounded-full" class="flex-1" />
          <Skeleton w="w-10" h="h-3" />
        </div>
      </div>
    </div>
  </div>
</template>
