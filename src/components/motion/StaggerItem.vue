<script setup>
import { motion } from 'motion-v'

defineProps({
  y: { type: Number, default: 18 },
  duration: { type: Number, default: 0.45 },
})
</script>

<template>
  <motion.div
    :variants="{
      hidden: { opacity: 0, y },
      show: { opacity: 1, y: 0, transition: { duration } },
    }"
  >
    <slot />
  </motion.div>
</template>
