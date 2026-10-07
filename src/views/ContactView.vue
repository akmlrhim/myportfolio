<script setup>
import { useAppStore } from '@/stores/app'
import PageHeader from '@/components/organisms/PageHeader.vue'
import BrandCard from '@/components/molecules/BrandCard.vue'
import { contactChannels } from '@/data/portfolio'
import StaggerGroup from '@/components/motion/StaggerGroup.vue'
import StaggerItem from '@/components/motion/StaggerItem.vue'

const store = useAppStore()
</script>

<template>
  <PageHeader :title="store.t.page.contact" :description="store.t.page.contactDesc">
    <StaggerGroup class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2" :stagger="0.08">
      <StaggerItem
        v-for="(channel, index) in contactChannels"
        :key="channel.id"
        :class="{ 'sm:col-span-2': index === 0 }"
      >
        <BrandCard
          :brand="channel.id"
          :href="channel.href"
          :title="store.t.contactCards[channel.id].title"
          :description="store.t.contactCards[channel.id].desc"
          :cta="store.t.contactCards[channel.id].cta"
          :wide="index === 0"
        />
      </StaggerItem>
    </StaggerGroup>
  </PageHeader>
</template>