<script setup>
import { useAppStore } from '@/stores/app'
import SkillChip from '@/components/molecules/SkillChip.vue'
import StaggerGroup from '@/components/motion/StaggerGroup.vue'
import StaggerItem from '@/components/motion/StaggerItem.vue'

const store = useAppStore()
</script>

<template>
  <StaggerGroup
    :key="store.activeFilter"
    class="flex flex-wrap gap-2"
    :stagger="0.04"
  >
    <StaggerItem
      v-for="skill in store.filteredSkills"
      :key="skill.id"
    >
      <SkillChip
        :name="skill.name"
        :icon="skill.icon"
        :color="skill.color"
      />
    </StaggerItem>
  </StaggerGroup>

  <p
    v-if="store.filteredSkills.length === 0"
    class="text-sm text-neutral-600 dark:text-neutral-400 mt-4"
  >
    No skills match this filter.
  </p>
</template>
