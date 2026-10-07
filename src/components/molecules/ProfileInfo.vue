<script setup>
import { computed } from 'vue'
import BaseAvatar from '@/components/atoms/BaseAvatar.vue'

const props = defineProps({
  name: String,
  avatar: String,
  verified: Boolean,
  openToWork: Boolean,
  openToWorkLabel: String,
})

const initials = computed(() => {
  if (!props.name) return '?'
  return props.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
})
</script>

<template>
  <div class="min-w-0">
    <div class="flex items-center gap-3 lg:gap-4">
      <img v-if="avatar" :src="avatar" :alt="name"
        class="w-12 h-12 lg:w-16 lg:h-16 rounded-full object-cover flex-shrink-0" />
      <BaseAvatar v-else :initials="initials" size="md" />

      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-1.5">
          <h1 class="font-semibold text-base lg:text-xl truncate">{{ name }}</h1>
          <svg v-if="verified" class="flex-shrink-0 text-blue-500" width="18" height="18" viewBox="0 0 24 24"
            fill="currentColor">
            <path
              d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
          </svg>
        </div>
      </div>
    </div>

    <div v-if="openToWork"
      class="mt-2.5 lg:mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-blue-400 text-blue-600 dark:text-blue-400 text-xs font-medium">
      <span class="w-2 h-2 rounded-full bg-blue-500"></span>
      {{ openToWorkLabel }}
    </div>
  </div>
</template>
