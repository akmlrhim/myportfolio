<script setup>
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { navItems } from '@/data/portfolio'
import NavItem from '@/components/molecules/NavItem.vue'

const route = useRoute()
const store = useAppStore()

const isActive = (path) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <nav class="flex-1 p-2.5 lg:p-4 flex flex-wrap lg:flex-col gap-1.5 lg:gap-1">
    <NavItem
      v-for="item in navItems"
      :key="item.id"
      :to="item.path"
      :icon="item.icon"
      :label="store.t.nav[item.id]"
      :active="isActive(item.path)"
    />
  </nav>
</template>