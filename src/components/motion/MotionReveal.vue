<script setup>
import { useReveal } from '@/composables/useReveal'

defineProps({
  delay: { type: Number, default: 0 },
  y: { type: Number, default: 24 },
  duration: { type: Number, default: 0.5 },
})

const { el, visible } = useReveal()
</script>

<template>
  <div
    ref="el"
    class="reveal"
    :class="{ 'is-visible': visible }"
    :style="{
      '--reveal-delay': `${delay}s`,
      '--reveal-duration': `${duration}s`,
      '--reveal-y': `${y}px`,
    }"
  >
    <slot />
  </div>
</template>
