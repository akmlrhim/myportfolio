<script setup>
import Skeleton from '@/components/atoms/BaseSkeleton.vue'

// Mirrors HomeView (HeroSection): greeting + divider + summary + skills section.
</script>

<template>
  <div role="status" aria-busy="true" aria-label="Loading home page" class="py-6 lg:py-10">
    <!-- Greeting h1: text-2xl lg:text-3xl -->
    <Skeleton w="w-64" h="h-8" rounded="rounded-xl" />

    <!-- BaseDivider: my-8 -->
    <div class="my-8 h-px w-full bg-neutral-200 dark:bg-neutral-800" />

    <!-- Summary paragraph: max-w-2xl -->
    <div class="space-y-2">
      <Skeleton w="w-full max-w-2xl" h="h-4" />
      <Skeleton w="w-4/5 max-w-xl" h="h-4" />
      <Skeleton w="w-2/3 max-w-lg" h="h-4" />
    </div>

    <!-- "Skills" h2: mt-8 mb-4 -->
    <Skeleton w="w-32" h="h-6" rounded="rounded-lg" class="mt-8" />

    <!-- SkillFilters: flex-wrap gap-2 mb-6, pills are py-1.5 rounded-full -->
    <div class="mt-4 mb-6 flex flex-wrap gap-2">
      <Skeleton
        v-for="i in 6"
        :key="i"
        w="w-24"
        h="h-8"
        rounded="rounded-full"
      />
    </div>

    <!-- SkillGrid: flex-wrap gap-2, chips are py-2 rounded-xl -->
    <div class="flex flex-wrap gap-2">
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
