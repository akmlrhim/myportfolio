<script setup>
import Reveal from '@/components/motion/MotionReveal.vue'

defineProps({
  title: String,
  description: String,
})
</script>

<template>
  <section class="py-6 lg:py-10">
    <Reveal :y="16" :duration="0.45">
      <h2 class="text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-neutral-100">{{ title }}</h2>
      <p class="mt-3 text-neutral-600 dark:text-neutral-400 max-w-2xl">{{ description }}</p>
    </Reveal>
    <Reveal :delay="0.12">
      <slot />
    </Reveal>
  </section>
</template>
