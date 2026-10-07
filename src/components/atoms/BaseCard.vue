<script setup>
defineProps({
  dashed: Boolean,
  padded: { type: Boolean, default: true },
})
</script>

<template>
  <div
    class="rounded-2xl"
    :class="[
      dashed
        ? 'border border-dashed border-neutral-300 dark:border-neutral-700'
        : 'border border-neutral-200 dark:border-neutral-800',
      padded ? 'p-10 text-center' : '',
    ]"
  >
    <slot />
  </div>
</template>