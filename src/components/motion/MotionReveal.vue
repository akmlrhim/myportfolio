<script setup>
import { motion } from 'motion-v'

defineProps({
  delay: { type: Number, default: 0 },
  y: { type: Number, default: 24 },
  duration: { type: Number, default: 0.5 },
  once: { type: Boolean, default: true },
})
</script>

<template>
  <motion.div
    :initial="{ opacity: 0, y }"
    :whileInView="{ opacity: 1, y: 0 }"
    :viewport="{ once, margin: '-40px' }"
    :transition="{ duration, delay, ease: [0.21, 0.47, 0.32, 0.98] }"
  >
    <slot />
  </motion.div>
</template>
