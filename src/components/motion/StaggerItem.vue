<script setup>
import { ref, inject, computed } from 'vue'

defineProps({
  y: { type: Number, default: 18 },
  duration: { type: Number, default: 0.45 },
})

const shown = inject('staggerShown', ref(true))
const step = inject('staggerStep', 0.06)
const delayChildren = inject('staggerDelayChildren', 0)
const nextIndex = inject('staggerNextIndex', null)

const index = nextIndex ? nextIndex() : 0
const delay = computed(() => delayChildren + index * step)
</script>

<template>
  <div
    class="stagger-item"
    :class="{ 'is-visible': shown }"
    :style="{
      '--item-y': `${y}px`,
      '--item-duration': `${duration}s`,
      '--item-delay': `${delay}s`,
    }"
  >
    <slot />
  </div>
</template>
