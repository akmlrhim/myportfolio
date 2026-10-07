<script setup>
defineProps({
  /** Tailwind width class or inline width via style. Default full. */
  w: { type: String, default: 'w-full' },
  h: { type: String, default: 'h-4' },
  rounded: { type: String, default: 'rounded-md' },
})
</script>

<template>
  <div class="skeleton-shimmer" :class="[w, h, rounded]" aria-hidden="true" />
</template>
