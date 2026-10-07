<script setup>
import { ref, onMounted, onUnmounted, provide } from 'vue'
import { motion } from 'motion-v'

const props = defineProps({
  stagger: { type: Number, default: 0.06 },
  delayChildren: { type: Number, default: 0 },
})

const el = ref(null)
const shown = ref(false)
let observer = null

provide('staggerShown', shown)

function getDOM(target) {
  if (!target) return null
  if (target instanceof Element) return target
  const dom = target.$el
  return dom instanceof Element ? dom : null
}

onMounted(() => {
  const target = getDOM(el.value)
  if (target) {
    observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        shown.value = true
        observer.disconnect()
        observer = null
      },
      { rootMargin: '-40px' },
    )
    observer.observe(target)
  } else {
    shown.value = true
  }
})

onUnmounted(() => {
  observer?.disconnect()
  observer = null
})
</script>

<template>
  <motion.div
    ref="el"
    :initial="false"
    :animate="shown ? 'show' : 'hidden'"
    :variants="{
      hidden: {},
      show: {
        transition: {
          staggerChildren: props.stagger,
          delayChildren: props.delayChildren,
        },
      },
    }"
  >
    <slot />
  </motion.div>
</template>
