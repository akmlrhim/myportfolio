<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { education, experience } from '@/data/about'
import PageHeader from '@/components/organisms/PageHeader.vue'
import TimelineItem from '@/components/molecules/TimelineItem.vue'
import BaseCard from '@/components/atoms/BaseCard.vue'
import StaggerGroup from '@/components/motion/StaggerGroup.vue'
import StaggerItem from '@/components/motion/StaggerItem.vue'

const store = useAppStore()
const t = computed(() => store.t.about)

function localize(entry) {
  return { logo: entry.logo, ...(entry[store.lang] || entry.en) }
}

const eduItems = computed(() => education.map(localize))
const expItems = computed(() => experience.map(localize))
</script>

<template>
  <PageHeader :title="store.t.page.about" :description="store.t.page.aboutDesc">
    <!-- About Me -->
    <section class="mt-10 max-w-3xl">
      <h2 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{{ t.aboutMe }}</h2>
      <div class="mt-4 space-y-4 leading-relaxed text-neutral-600 dark:text-neutral-400">
        <p v-for="(paragraph, i) in t.bio" :key="i">{{ paragraph }}</p>
      </div>
    </section>

    <!-- Education -->
    <section class="mt-12">
      <h2 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{{ t.education }}</h2>
      <StaggerGroup v-if="eduItems.length" class="mt-5 border-l border-neutral-200 dark:border-neutral-800 ml-5 lg:ml-1.5 py-1 space-y-8">
        <StaggerItem v-for="(item, i) in eduItems" :key="i">
          <TimelineItem v-bind="item" />
        </StaggerItem>
      </StaggerGroup>
      <BaseCard v-else dashed class="mt-5">
        <p class="text-sm text-neutral-500 dark:text-neutral-400">{{ t.empty }}</p>
      </BaseCard>
    </section>

    <!-- Experience -->
    <section class="mt-12">
      <h2 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{{ t.experience }}</h2>
      <StaggerGroup v-if="expItems.length" class="mt-5 border-l border-neutral-200 dark:border-neutral-800 ml-5 lg:ml-1.5 py-1 space-y-8">
        <StaggerItem v-for="(item, i) in expItems" :key="i">
          <TimelineItem v-bind="item" />
        </StaggerItem>
      </StaggerGroup>
      <BaseCard v-else dashed class="mt-5">
        <p class="text-sm text-neutral-500 dark:text-neutral-400">{{ t.empty }}</p>
      </BaseCard>
    </section>
  </PageHeader>
</template>
