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
        ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100'
        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
    "
  >
    <BaseIcon :svg="icon" :size="18" />
    <span class="whitespace-nowrap">{{ label }}</span>
    <svg
      v-if="active"
      class="ml-auto flex-shrink-0 hidden lg:block text-neutral-500 dark:text-neutral-400"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
  </RouterLink>
</template>