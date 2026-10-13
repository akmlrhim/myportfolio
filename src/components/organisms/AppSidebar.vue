<script setup>
import { useAppStore } from '@/stores/app'
import ProfileSection from '@/components/organisms/ProfileSection.vue'
import SidebarControls from '@/components/organisms/SidebarControls.vue'
import SidebarNav from '@/components/organisms/SidebarNav.vue'
import { computed } from 'vue'

const store = useAppStore()

const year = computed(() => new Date().getFullYear())
</script>

<template>
  <aside class="
      hidden lg:flex lg:w-72
      lg:h-screen lg:sticky lg:top-0 lg:overflow-y-auto
      flex-shrink-0 border-r border-neutral-200 dark:border-neutral-800
      bg-white dark:bg-neutral-950 z-30
      flex-col
    ">
    <ProfileSection :name="store.profile.name" :verified="store.profile.verified"
      :open-to-work="store.profile.openToWork" :open-to-work-label="store.t.sidebar.openToWork"
      :location="store.t.hero.based">
      <template #controls>
        <SidebarControls />
      </template>
    </ProfileSection>

    <SidebarNav />

    <div class="p-4 border-t border-neutral-200 dark:border-neutral-800 hidden lg:block">
      <p class="text-xs text-neutral-500 dark:text-neutral-500">&copy; {{ year }} {{ store.profile.name }}</p>
    </div>
  </aside>
</template>
