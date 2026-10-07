<script setup>
import { useAppStore } from '@/stores/app'
import PageHeader from '@/components/organisms/PageHeader.vue'
import GuestbookForm from '@/components/organisms/GuestbookForm.vue'

const store = useAppStore()
</script>

<template>
  <PageHeader :title="store.t.page.guestbook" :description="store.t.page.guestbookDesc">
    <GuestbookForm />
  </PageHeader>
</template>