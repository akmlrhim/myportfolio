<script setup>
import Skeleton from '@/components/atoms/BaseSkeleton.vue'

// Mirrors GuestbookView: header + form fields.
</script>

<template>
  <div role="status" aria-busy="true" aria-label="Loading guestbook page" class="py-6 lg:py-10">
    <Skeleton w="w-56" h="h-8" rounded="rounded-xl" />
    <div class="mt-4 space-y-2">
      <Skeleton w="w-full max-w-2xl" h="h-4" />
      <Skeleton w="w-2/3 max-w-xl" h="h-4" />
    </div>

    <div class="mt-8 max-w-md space-y-4">
      <div class="space-y-2">
        <Skeleton w="w-20" h="h-3.5" />
        <Skeleton w="w-full" h="h-10" rounded="rounded-lg" />
      </div>
      <div class="space-y-2">
        <Skeleton w="w-24" h="h-3.5" />
        <Skeleton w="w-full" h="h-28" rounded="rounded-lg" />
      </div>
      <Skeleton w="w-28" h="h-10" rounded="rounded-lg" />
    </div>
  </div>
</template>
