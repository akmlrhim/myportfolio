<script setup>
import { RouterLink } from 'vue-router'
import BaseIcon from '@/components/atoms/BaseIcon.vue'

defineProps({
  to: String,
  icon: String,
  label: String,
  active: Boolean,
})
</script>

<template>
  <RouterLink
    :to="to"
    :title="label"
    :aria-current="active ? 'page' : undefined"
    class="flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 lg:w-full lg:gap-3 lg:py-2.5 lg:text-sm lg:rounded-xl"
    :class="
      active
        ? 'bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white'
        : 'text-black dark:text-white hover:text-black dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
    "
  >
    <BaseIcon :svg="icon" :size="18" />
    <span class="whitespace-nowrap">{{ label }}</span>
  </RouterLink>
</template>