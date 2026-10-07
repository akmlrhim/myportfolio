<script setup>
import { useAppStore } from '@/stores/app'
import BaseCard from '@/components/atoms/BaseCard.vue'
import Reveal from '@/components/motion/MotionReveal.vue'

const store = useAppStore()
</script>

<template>
  <Reveal :y="20">
    <BaseCard dashed class="mt-8">
      <p class="text-sm font-medium text-neutral-500">{{ store.t.page.comingSoon }}</p>
      <p class="mt-1 text-xs text-neutral-400">{{ store.t.page.underDevelopment }}</p>
    </BaseCard>
  </Reveal>
</template>
