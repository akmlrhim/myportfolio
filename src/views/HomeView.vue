<script setup>
import { useAppStore } from '@/stores/app'
import HeroSection from '@/components/organisms/HeroSection.vue'
import SkillFilters from '@/components/organisms/SkillFilters.vue'
import SkillGrid from '@/components/organisms/SkillGrid.vue'
import Reveal from '@/components/motion/MotionReveal.vue'

const store = useAppStore()
</script>

<template>
  <HeroSection>
    <Reveal :delay="0.1">
      <p class="text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl">
        {{ store.t.hero.summary }}
      </p>
    </Reveal>

    <Reveal :delay="0.2">
      <h2 class="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mt-8 mb-4">
        {{ store.t.hero.skills }}
      </h2>
      <SkillFilters />
      <div class="mt-6">
        <SkillGrid />
      </div>
    </Reveal>
  </HeroSection>
</template>
