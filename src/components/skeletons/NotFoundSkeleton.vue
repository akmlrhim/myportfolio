<script setup>
import Skeleton from '@/components/atoms/BaseSkeleton.vue'

// Mirrors NotFoundView.
</script>

<template>
  <div role="status" aria-busy="true" aria-label="Loading page" class="py-6 lg:py-10">
    <Skeleton w="w-72" h="h-10" rounded="rounded-xl" />
    <div class="mt-3 space-y-2">
      <Skeleton w="w-full max-w-xl" h="h-4" />
      <Skeleton w="w-2/3 max-w-md" h="h-4" />
    </div>
    <Skeleton w="w-36" h="h-10" rounded="rounded-lg" class="mt-8" />
  </div>
</template>
