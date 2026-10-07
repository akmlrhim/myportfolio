<script setup>
defineProps({
  svg: { type: String, required: true },
  size: { type: Number, default: 20 },
})
</script>

<template>
  <span
    class="flex-shrink-0 inline-flex items-center justify-center"
    :style="{ width: size + 'px', height: size + 'px' }"
    v-html="svg"
  />
</template>