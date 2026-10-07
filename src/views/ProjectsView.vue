<script setup>
import { useAppStore } from '@/stores/app'
import PageHeader from '@/components/organisms/PageHeader.vue'
import ComingSoonSection from '@/components/organisms/ComingSoonSection.vue'

const store = useAppStore()
</script>

<template>
  <PageHeader :title="store.t.page.projects" :description="store.t.page.projectsDesc">
    <ComingSoonSection />
  </PageHeader>
</template>