<script setup>
defineProps({
  icon: String,
})
</script>

<template>
  <span class="flex items-center gap-1">
    <span v-html="icon"></span>
    <slot />
  </span>
</template>