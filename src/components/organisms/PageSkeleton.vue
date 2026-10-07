<script setup>
import Skeleton from '@/components/atoms/BaseSkeleton.vue'
</script>

<template>
  <div aria-busy="true" aria-label="Loading page" class="py-6 lg:py-10">
    <Skeleton w="w-56" h="h-8" rounded="rounded-xl" />
    <div class="mt-4 space-y-2">
      <Skeleton w="w-full max-w-2xl" h="h-4" />
      <Skeleton w="w-2/3 max-w-xl" h="h-4" />
    </div>

    <div class="mt-8 space-y-4">
      <div
        v-for="row in 3"
        :key="row"
        class="rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800"
      >
        <div class="flex items-center gap-3">
          <Skeleton w="w-10" h="h-10" rounded="rounded-full" />
          <div class="flex-1 space-y-2">
            <Skeleton w="w-1/3" h="h-3.5" />
            <Skeleton w="w-2/3" h="h-3" />
          </div>
        </div>
        <div class="mt-4 space-y-2">
          <Skeleton w="w-full" h="h-3" />
          <Skeleton w="w-5/6" h="h-3" />
          <Skeleton w="w-1/2" h="h-3" />
        </div>
      </div>
    </div>
  </div>
</template>
