<script setup>
import Reveal from '@/components/motion/MotionReveal.vue'
import { useAppStore } from '@/stores/app'
import InfoBullet from '@/components/molecules/InfoBullet.vue'
import BaseDivider from '@/components/atoms/BaseDivider.vue'

const store = useAppStore()

const locationIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`
</script>

<template>
  <section class="py-6 lg:py-10">
    <Reveal :y="18">
      <h2 class="text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-neutral-100">
        {{ store.t.hero.greeting }}
      </h2>

      <div class="flex flex-wrap items-center gap-x-2 gap-y-1 mt-3 text-sm text-neutral-600 dark:text-neutral-400">
        <InfoBullet :icon="locationIcon">{{ store.t.hero.based }} 🇮🇩</InfoBullet>
        <span class="text-neutral-400 dark:text-neutral-500">•</span>
        <span>{{ store.t.hero.onsite }}</span>
      </div>
    </Reveal>

    <Reveal :delay="0.1">
      <p class="mt-6 text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-2xl">
        {{ store.t.hero.bio1 }}
      </p>
      <p class="mt-4 text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-2xl">
        {{ store.t.hero.bio2 }}
      </p>
    </Reveal>

    <BaseDivider />

    <slot />
  </section>
</template>
