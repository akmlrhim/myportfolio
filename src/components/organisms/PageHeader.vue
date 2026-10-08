<script setup>
defineProps({
  title: String,
  description: String,
})
</script>

<template>
  <section class="py-6 lg:py-10">
    <h1 class="text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-neutral-100">{{ title }}</h1>
    <p class="mt-3 text-neutral-600 dark:text-neutral-400 max-w-2xl">{{ description }}</p>
    <slot />
  </section>
</template>
