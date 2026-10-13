<script setup>
import Skeleton from '@/components/atoms/BaseSkeleton.vue'
</script>

<template>
  <div role="status" aria-busy="true" aria-label="Loading admin page" class="py-6 lg:py-10">
    <!-- Header h1 + subtitle -->
    <Skeleton w="w-48" h="h-8" rounded="rounded-xl" />
    <Skeleton w="w-32" h="h-4" class="mt-2" />

    <!-- Tabs row -->
    <div class="mt-6 flex flex-wrap gap-2">
      <Skeleton v-for="i in 6" :key="i" w="w-24" h="h-8" rounded="rounded-lg" />
    </div>

    <!-- Table -->
    <div class="mt-6 space-y-2">
      <Skeleton v-for="i in 6" :key="i" w="w-full" h="h-10" rounded="rounded-lg" />
    </div>
  </div>
</template>
