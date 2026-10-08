<script setup>
import { ref, provide } from 'vue'
import { useReveal } from '@/composables/useReveal'

const props = defineProps({
  stagger: { type: Number, default: 0.06 },
  delayChildren: { type: Number, default: 0 },
})

const { el, visible } = useReveal()
const count = ref(0)

provide('staggerShown', visible)
provide('staggerStep', props.stagger)
provide('staggerDelayChildren', props.delayChildren)
provide('staggerNextIndex', () => count.value++)
</script>

<template>
  <div ref="el" :class="{ 'is-visible': visible }">
    <slot />
  </div>
</template>
