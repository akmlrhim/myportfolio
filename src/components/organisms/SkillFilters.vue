<script setup>
import { useAppStore } from '@/stores/app'
import { skillCategories } from '@/data/portfolio'
import FilterPill from '@/components/molecules/FilterPill.vue'

const store = useAppStore()
</script>

<template>
  <div class="flex flex-wrap gap-2 mb-6">
    <FilterPill
      v-for="cat in skillCategories"
      :key="cat.id"
      :label="store.t.filter[cat.labelKey]"
      :count="store.filterCounts[cat.id]"
      :active="store.activeFilter === cat.id"
      @click="store.setFilter(cat.id)"
    />
  </div>
</template>