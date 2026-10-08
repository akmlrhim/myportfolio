<script setup>
import { useAppStore } from '@/stores/app'
import PageHeader from '@/components/organisms/PageHeader.vue'
import ProjectFilters from '@/components/organisms/ProjectFilters.vue'
import ProjectTable from '@/components/organisms/ProjectTable.vue'

const store = useAppStore()
</script>

<template>
  <PageHeader :title="store.t.page.projects" :description="store.t.page.projectsDesc">
    <ProjectFilters class="mt-8" />
    <ProjectTable class="mt-6" />
  </PageHeader>
</template>
