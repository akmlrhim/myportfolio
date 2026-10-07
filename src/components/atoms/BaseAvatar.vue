<script setup>
defineProps({
  initials: { type: String, default: '?' },
  size: { type: String, default: 'md' }, // sm | md | lg
})
</script>

<template>
  <div
    class="rounded-full bg-gradient-to-br from-accent to-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0"
    :class="{
      'w-10 h-10 text-sm': size === 'sm',
      'w-12 h-12 text-base lg:w-16 lg:h-16 lg:text-xl': size === 'md',
      'w-16 h-16 lg:w-20 lg:h-20 text-xl lg:text-2xl': size === 'lg',
    }"
  >
    {{ initials }}
  </div>
</template>
