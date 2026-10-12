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

    <!-- Summary: leading-relaxed max-w-2xl (single paragraph, wraps) -->
    <div class="max-w-2xl space-y-2">
      <Skeleton w="w-full" h="h-4" />
      <Skeleton w="w-11/12" h="h-4" />
      <Skeleton w="w-4/5" h="h-4" />
    </div>

    <!-- "Skills" h2: text-xl font-semibold, mt-8 mb-4 -->
    <Skeleton w="w-32" h="h-7" rounded="rounded-lg" class="mt-8" />

    <!-- SkillFilters: flex-wrap gap-2 mb-6, pills px-4 py-1.5 rounded-full -->
    <div class="mt-4 mb-6 flex flex-wrap gap-2">
      <Skeleton v-for="i in 6" :key="i" w="w-24" h="h-8" rounded="rounded-full" />
    </div>

    <!-- SkillGrid: mt-6, chips px-3 py-2 rounded-xl (39 skills, wraps) -->
    <div class="mt-6 flex flex-wrap gap-2">
      <Skeleton v-for="i in 39" :key="i" w="w-28" h="h-9" rounded="rounded-xl" />
    </div>
  </div>
</template>
