<script setup>
import ProfileInfo from '@/components/molecules/ProfileInfo.vue'

defineProps({
  name: String,
  avatar: String,
  verified: Boolean,
  openToWork: Boolean,
  openToWorkLabel: String,
  location: String,
})
</script>

<template>
  <div class="p-4 lg:p-5 border-b border-neutral-200 dark:border-neutral-800">
    <div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
      <ProfileInfo
        :name="name"
        :avatar="avatar"
        :verified="verified"
        :open-to-work="openToWork"
        :open-to-work-label="openToWorkLabel"
        :location="location"
      />
      <slot name="controls" />
    </div>
  </div>
</template>
