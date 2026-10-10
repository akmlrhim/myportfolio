<script setup>
import Skeleton from '@/components/atoms/BaseSkeleton.vue'

// Mirrors HomeView: hero greeting + divider + summary + skills section.
</script>

<template>
  <div role="status" aria-busy="true" aria-label="Loading home page" class="py-6 lg:py-10">
    <Skeleton w="w-64" h="h-8" rounded="rounded-xl" />

    <div class="my-6 h-px w-full bg-neutral-200 dark:bg-neutral-800" />

    <div class="space-y-2">
      <Skeleton w="w-full max-w-2xl" h="h-4" />
      <Skeleton w="w-4/5 max-w-xl" h="h-4" />
      <Skeleton w="w-2/3 max-w-lg" h="h-4" />
    </div>

    <Skeleton w="w-32" h="h-6" rounded="rounded-lg" class="mt-8" />

    <div class="mt-4 flex flex-wrap gap-2">
      <Skeleton
        v-for="i in 6"
        :key="i"
        w="w-24"
        h="h-9"
        rounded="rounded-full"
      />
    </div>

    <div class="mt-6 flex flex-wrap gap-2">
      <Skeleton
        v-for="i in 14"
        :key="i"
        w="w-28"
        h="h-10"
        rounded="rounded-xl"
      />
    </div>
  </div>
</template>
