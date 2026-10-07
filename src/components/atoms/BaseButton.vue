<script setup>
defineProps({
  variant: { type: String, default: 'primary' }, // primary | ghost
  type: { type: String, default: 'button' },
})
</script>

<template>
  <button
    :type="type"
    class="px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
    :class="{
      'bg-blue-600 text-white hover:bg-blue-500': variant === 'primary',
      'border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-neutral-600':
        variant === 'ghost',
    }"
  >
    <slot />
  </button>
</template>