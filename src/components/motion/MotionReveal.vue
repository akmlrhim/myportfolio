<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { motion } from 'motion-v'

const props = defineProps({
  delay: { type: Number, default: 0 },
  y: { type: Number, default: 24 },
  duration: { type: Number, default: 0.5 },
})

const el = ref(null)
const shown = ref(false)
let observer = null

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
    :animate="shown ? { opacity: 1, y: 0 } : { opacity: 0, y }"
    :transition="{ duration, delay, ease: [0.21, 0.47, 0.32, 0.98] }"
  >
    <slot />
  </motion.div>
</template>
