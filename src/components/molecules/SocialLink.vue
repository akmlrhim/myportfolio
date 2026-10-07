<script setup>
import BaseIcon from '@/components/atoms/BaseIcon.vue'

defineProps({
  href: String,
  icon: String,
  title: String,
})
</script>

<template>
  <a
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    class="flex items-center gap-3 px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors max-w-md"
  >
    <BaseIcon :svg="icon" :size="20" />
    <span class="text-sm font-medium">{{ title }}</span>
    <svg class="ml-auto text-neutral-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M7 17 17 7"/><path d="M7 7h10v10"/>
    </svg>
  </a>
</template>