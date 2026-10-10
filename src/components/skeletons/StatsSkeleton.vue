<script setup>
import Skeleton from '@/components/atoms/BaseSkeleton.vue'
import GitHubSkeleton from '@/components/organisms/GitHubSkeleton.vue'
import WakaTimeSkeleton from '@/components/organisms/WakaTimeSkeleton.vue'

// Mirrors StatsView: header + GitHub section + WakaTime section.
</script>

<template>
  <div role="status" aria-busy="true" aria-label="Loading stats page" class="py-6 lg:py-10">
    <Skeleton w="w-40" h="h-8" rounded="rounded-xl" />
    <div class="mt-3 space-y-2">
      <Skeleton w="w-full max-w-2xl" h="h-4" />
      <Skeleton w="w-2/3 max-w-xl" h="h-4" />
    </div>

    <!-- GitHub section -->
    <section class="mt-10">
      <Skeleton w="w-24" h="h-5" rounded="rounded-md" />
      <GitHubSkeleton class="mt-4" />
    </section>

    <!-- WakaTime section -->
    <section class="mt-12">
      <Skeleton w="w-40" h="h-5" rounded="rounded-md" />
      <WakaTimeSkeleton class="mt-4" />
    </section>
  </div>
</template>
