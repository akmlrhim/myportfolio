<script setup>
import Skeleton from '@/components/atoms/BaseSkeleton.vue'
import ActivitySkeleton from '@/components/organisms/ActivitySkeleton.vue'

// Mirrors ActivityView: header + commit list.
</script>

<template>
  <div role="status" aria-busy="true" aria-label="Loading activity page" class="py-6 lg:py-10">
    <Skeleton w="w-48" h="h-8" rounded="rounded-xl" />
    <div class="mt-4 space-y-2">
      <Skeleton w="w-full max-w-2xl" h="h-4" />
      <Skeleton w="w-2/3 max-w-xl" h="h-4" />
    </div>

    <div class="mt-8">
      <ActivitySkeleton :count="10" />
    </div>
  </div>
</template>
