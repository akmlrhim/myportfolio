<script setup>
import Skeleton from '@/components/atoms/BaseSkeleton.vue'

// Mirrors AboutView: header + bio + education/experience timelines.
</script>

<template>
  <div role="status" aria-busy="true" aria-label="Loading about page" class="py-6 lg:py-10">
    <Skeleton w="w-48" h="h-8" rounded="rounded-xl" />
    <div class="mt-4 space-y-2">
      <Skeleton w="w-full max-w-2xl" h="h-4" />
      <Skeleton w="w-2/3 max-w-xl" h="h-4" />
    </div>

    <!-- About Me -->
    <div class="mt-10 max-w-3xl">
      <Skeleton w="w-32" h="h-6" rounded="rounded-lg" />
      <div class="mt-4 space-y-3">
        <Skeleton w="w-full" h="h-4" />
        <Skeleton w="w-11/12" h="h-4" />
        <Skeleton w="w-5/6" h="h-4" />
      </div>
    </div>

    <!-- Timelines -->
    <div v-for="section in 2" :key="section" class="mt-12">
      <Skeleton w="w-28" h="h-6" rounded="rounded-lg" />
      <div class="mt-5 ml-5 space-y-8 border-l border-neutral-200 py-1 dark:border-neutral-800 lg:ml-1.5">
        <div v-for="i in 2" :key="i" class="relative pl-6">
          <div class="flex items-center gap-3">
            <Skeleton w="w-10" h="h-10" rounded="rounded-full" />
            <div class="flex-1 space-y-2">
              <Skeleton w="w-1/3" h="h-4" />
              <Skeleton w="w-1/4" h="h-3" />
            </div>
          </div>
          <div class="mt-3 space-y-2">
            <Skeleton w="w-full" h="h-3" />
            <Skeleton w="w-3/4" h="h-3" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
