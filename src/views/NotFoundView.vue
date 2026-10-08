<script setup>
import { useAppStore } from '@/stores/app'
import PageHeader from '@/components/organisms/PageHeader.vue'

const store = useAppStore()
</script>

<template>
  <PageHeader :title="store.t.page.notFound" :description="store.t.page.notFoundDesc">
    <div class="mt-6">
      <RouterLink
        to="/"
        class="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        {{ store.t.page.goHome }}
      </RouterLink>
    </div>
  </PageHeader>
</template>
