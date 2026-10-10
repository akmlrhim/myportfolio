<script setup>
import { useAppStore } from '@/stores/app'
import PageHeader from '@/components/organisms/PageHeader.vue'
import ProjectFilters from '@/components/organisms/ProjectFilters.vue'
import ProjectTable from '@/components/organisms/ProjectTable.vue'
import ProjectPagination from '@/components/molecules/ProjectPagination.vue'

const store = useAppStore()
</script>

<template>
  <PageHeader :title="store.t.page.projects" :description="store.t.page.projectsDesc">
    <ProjectFilters class="mt-8" />
    <div id="projects-grid" class="scroll-mt-24">
      <ProjectTable class="mt-6" />
      <ProjectPagination />
    </div>
  </PageHeader>
</template>
