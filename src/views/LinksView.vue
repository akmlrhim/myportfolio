<script setup>
import { useAppStore } from '@/stores/app'
import { socialLinks } from '@/data/social'
import PageHeader from '@/components/organisms/PageHeader.vue'
import SocialLink from '@/components/molecules/SocialLink.vue'
import StaggerGroup from '@/components/motion/StaggerGroup.vue'
import StaggerItem from '@/components/motion/StaggerItem.vue'

const store = useAppStore()

const linkIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`
</script>

<template>
  <PageHeader :title="store.t.page.links" :description="store.t.page.linksDesc">
    <div class="mt-8 space-y-3">
      <StaggerGroup class="space-y-3" :stagger="0.08">
        <StaggerItem v-for="link in socialLinks" :key="link.name">
          <SocialLink
            :href="link.url"
            :icon="linkIcon"
            :title="link.name"
          />
        </StaggerItem>
      </StaggerGroup>
    </div>
  </PageHeader>
</template>