<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import { useReveal } from '@/composables/useReveal'

const props = defineProps({
  value: { type: Number, required: true },
  duration: { type: Number, default: 1.2 },
  delay: { type: Number, default: 0 },
  decimals: { type: Number, default: 0 },
  locale: { type: String, default: 'en-US' },
  format: { type: Function, default: null },
  suffix: { type: String, default: '' },
})

const { el, visible } = useReveal()
const current = ref(0)
let started = false
let raf = null
let safety = null
let grace = null

const reducedMotion = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false

// Fallback for when the reveal observer never fires (element kept off-screen,
// observer quirks): after a grace period, show the real value no matter what.
const START_GRACE_MS = 3000

function fmt(n) {
  if (props.format) return props.format(n) + props.suffix
  return (
    n.toLocaleString(props.locale, {
      minimumFractionDigits: props.decimals,
      maximumFractionDigits: props.decimals,
    }) + props.suffix
  )
}

const display = computed(() => fmt(current.value))

function stop() {
  if (raf) {
    cancelAnimationFrame(raf)
    raf = null
  }
  if (safety) {
    clearTimeout(safety)
    safety = null
  }
}

function run(to) {
  stop()
  if (reducedMotion || props.duration <= 0) {
    current.value = to
    return
  }
  const from = current.value
  const dur = props.duration * 1000
  const delayMs = props.delay * 1000
  const t0 = performance.now()

  // Mobile browsers can drop requestAnimationFrame callbacks during momentum
  // scroll, freezing the count at a wrong number (observed as "0h 49m" where
  // the hours froze at 0). A plain timer always fires and pins the final value.
  safety = setTimeout(() => {
    raf = null
    current.value = to
  }, delayMs + dur + 120)

  function tick(now) {
    const elapsed = now - t0
    if (elapsed < delayMs) {
      raf = requestAnimationFrame(tick)
      return
    }
    const p = Math.min((elapsed - delayMs) / dur, 1)
    const eased = 1 - Math.pow(1 - p, 4) // easeOutQuart
    current.value = from + (to - from) * eased
    if (p < 1) {
      raf = requestAnimationFrame(tick)
    } else {
      current.value = to
    }
  }
  raf = requestAnimationFrame(tick)
}

watch(visible, (v) => {
  if (v && !started) {
    started = true
    run(props.value)
  }
})

watch(() => props.value, (nv) => {
  if (started && visible.value) {
    run(nv)
  }
})

onMounted(() => {
  grace = setTimeout(() => {
    if (!started) {
      started = true
      run(props.value)
    }
  }, START_GRACE_MS)
})

onUnmounted(() => {
  stop()
  clearTimeout(grace)
})
</script>

<template>
  <span ref="el" class="tabular-nums">{{ display }}</span>
</template>
