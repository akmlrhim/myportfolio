<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { profile } from '@/data/profile'
import { navItems } from '@/data/nav'
import SidebarControls from '@/components/organisms/SidebarControls.vue'
import NavItem from '@/components/molecules/NavItem.vue'

const store = useAppStore()
const route = useRoute()
const open = ref(false)

// tutup menu tiap pindah halaman
watch(() => route.path, () => {
  open.value = false
})

const isActive = (path) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <header
    class="lg:hidden sticky top-0 z-40 border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 backdrop-blur relative"
  >
    <div class="flex items-center gap-3 px-4 py-2.5">
      <p class="font-semibold text-base truncate">{{ profile.name }}</p>
      <div class="flex-1 min-w-0"></div>
      <div class="shrink-0">
        <SidebarControls />
      </div>

      <!-- Hamburger -->
      <button
        class="flex items-center justify-center w-9 h-9 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        :aria-expanded="open"
        aria-controls="mobile-nav"
        :aria-label="open ? store.t.sidebar.openMenu : store.t.sidebar.closeMenu"
        @click="open = !open"
      >
        <svg v-if="!open" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="18"
            y2="18" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6 6 18" /><path d="m6 6 12 12" />
        </svg>
      </button>
    </div>

    <!-- Dropdown menu -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="-translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="-translate-y-2 opacity-0"
    >
      <nav
        v-if="open"
        id="mobile-nav"
        class="absolute top-full inset-x-0 flex flex-col gap-0.5 px-3 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-lg"
        role="menu"
      >
        <NavItem
          v-for="item in navItems"
          :key="item.id"
          :to="item.path"
          :icon="item.icon"
          :label="store.t.nav[item.id]"
          :active="isActive(item.path)"
        />
      </nav>
    </Transition>
  </header>
</template>