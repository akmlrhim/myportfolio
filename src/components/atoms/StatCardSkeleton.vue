<script setup>
import Skeleton from '@/components/atoms/BaseSkeleton.vue'
</script>

<template>
  <div class="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
    <Skeleton w="w-2/3" h="h-3" />
    <Skeleton w="w-1/2" h="h-6" rounded="rounded-lg" class="mt-3" />
  </div>
</template>
