<script setup>
import { useAppStore } from '@/stores/app'
import BaseDivider from '@/components/atoms/BaseDivider.vue'

const store = useAppStore()
</script>

<template>
  <section class="py-6 lg:py-10">
    <h1 class="text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-neutral-100">
      {{ store.t.hero.greeting }}
    </h1>

    <BaseDivider />

    <slot />
  </section>
</template>
