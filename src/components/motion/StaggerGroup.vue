<script setup>
import { computed } from 'vue'
import { motion } from 'motion-v'

const props = defineProps({
  stagger: { type: Number, default: 0.06 },
  delayChildren: { type: Number, default: 0 },
  once: { type: Boolean, default: true },
})

const variants = computed(() => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: props.stagger,
      delayChildren: props.delayChildren,
    },
  },
}))
</script>

<template>
  <motion.div
    initial="hidden"
    :whileInView="'show'"
    :viewport="{ once, margin: '-40px' }"
    :variants="variants"
  >
    <slot />
  </motion.div>
</template>
