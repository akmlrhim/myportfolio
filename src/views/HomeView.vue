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
    <Reveal :delay="0.15">
      <h3 class="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
        {{ store.t.hero.skills }}
      </h3>
      <SkillFilters />
      <div class="mt-6">
        <SkillGrid />
      </div>
    </Reveal>
  </HeroSection>
</template>
