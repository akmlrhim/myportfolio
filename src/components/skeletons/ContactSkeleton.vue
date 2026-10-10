<script setup>
import Skeleton from '@/components/atoms/BaseSkeleton.vue'

// Mirrors ContactView: header + brand cards (first spans full width).
// Each BrandCard: rounded-2xl, min-h-48, p-7, with title + description + CTA pinned bottom.
</script>

<template>
  <div role="status" aria-busy="true" aria-label="Loading contact page" class="py-6 lg:py-10">
    <Skeleton w="w-56" h="h-8" rounded="rounded-xl" />
    <div class="mt-3 space-y-2">
      <Skeleton w="w-full max-w-2xl" h="h-4" />
      <Skeleton w="w-2/3 max-w-xl" h="h-4" />
    </div>

    <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div
        v-for="(i, index) in 3"
        :key="i"
        class="flex min-h-48 flex-col rounded-2xl border border-neutral-200 p-7 dark:border-neutral-800"
        :class="{ 'sm:col-span-2': index === 0 }"
      >
        <Skeleton w="w-40" h="h-7" rounded="rounded-lg" />
        <div class="mt-3 space-y-2">
          <Skeleton w="w-full max-w-sm" h="h-4" />
          <Skeleton w="w-2/3 max-w-xs" h="h-4" />
        </div>
        <Skeleton w="w-32" h="h-12" rounded="rounded-xl" class="mt-auto" />
      </div>
    </div>
  </div>
</template>
