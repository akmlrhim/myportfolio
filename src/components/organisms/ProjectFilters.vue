<script setup>
import { useAppStore } from '@/stores/app'
import { projectCategories } from '@/data/projects'
import FilterPill from '@/components/molecules/FilterPill.vue'

const store = useAppStore()
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <FilterPill
      v-for="cat in projectCategories"
      :key="cat.id"
      :label="store.t.projectFilter[cat.labelKey]"
      :count="store.projectFilterCounts[cat.id]"
      :active="store.activeProjectFilter === cat.id"
      @click="store.setProjectFilter(cat.id)"
    />
  </div>
</template>
