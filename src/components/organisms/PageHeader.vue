<script setup>
defineProps({
  title: String,
  description: String,
})
</script>

<template>
  <section class="py-6 lg:py-10">
    <h1 class="text-2xl lg:text-3xl font-bold text-black dark:text-white">{{ title }}</h1>
    <p class="mt-3 text-black dark:text-white max-w-2xl">{{ description }}</p>
    <slot />
  </section>
</template>
