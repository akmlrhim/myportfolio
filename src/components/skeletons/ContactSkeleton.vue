<script setup>
import Skeleton from '@/components/atoms/BaseSkeleton.vue'

// Mirrors ContactView: header + brand cards (first spans full width).
</script>

<template>
  <div role="status" aria-busy="true" aria-label="Loading contact page" class="py-6 lg:py-10">
    <Skeleton w="w-56" h="h-8" rounded="rounded-xl" />
    <div class="mt-4 space-y-2">
      <Skeleton w="w-full max-w-2xl" h="h-4" />
      <Skeleton w="w-2/3 max-w-xl" h="h-4" />
    </div>

    <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div class="sm:col-span-2">
        <Skeleton w="w-full" h="h-48" rounded="rounded-2xl" />
      </div>
      <Skeleton w="w-full" h="h-48" rounded="rounded-2xl" />
      <Skeleton w="w-full" h="h-48" rounded="rounded-2xl" />
    </div>
  </div>
</template>
