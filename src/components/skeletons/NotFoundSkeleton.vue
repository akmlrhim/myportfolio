<script setup>
import Skeleton from '@/components/atoms/BaseSkeleton.vue'

// Mirrors NotFoundView: header + "go home" button (mt-6).
</script>

<template>
  <div role="status" aria-busy="true" aria-label="Loading page" class="py-6 lg:py-10">
    <Skeleton w="w-72" h="h-8" rounded="rounded-xl" />
    <div class="mt-3 max-w-2xl space-y-2">
      <Skeleton w="w-full" h="h-4" />
      <Skeleton w="w-2/3" h="h-4" />
    </div>

    <!-- RouterLink: px-4 py-2 rounded-lg text-sm -->
    <Skeleton w="w-32" h="h-9" rounded="rounded-lg" class="mt-6" />
  </div>
</template>
