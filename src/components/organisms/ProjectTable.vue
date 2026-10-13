<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { skillById } from '@/data/skills'
import { projectCategories } from '@/data/projects'
import { deviconUrl } from '@/utils/devicon'
import BaseCard from '@/components/atoms/BaseCard.vue'
import ProjectCard from '@/components/molecules/ProjectCard.vue'
import StaggerGroup from '@/components/motion/StaggerGroup.vue'
import StaggerItem from '@/components/motion/StaggerItem.vue'

const store = useAppStore()

const normalizeKey = (key) => String(key).toLowerCase().replace(/[^a-z0-9]/g, '')
const skillByNormalizedKey = Object.fromEntries(
  Object.values(skillById).map((skill) => [normalizeKey(skill.id), skill]),
)

// Maps a project's category id (e.g. 'web-app') to its i18n labelKey ('web').
const labelKeyByCategory = Object.fromEntries(
  projectCategories.map((category) => [category.id, category.labelKey]),
)

function categoryLabel(categoryId) {
  const labelKey = labelKeyByCategory[categoryId]
  return store.t.projectFilter[labelKey] ?? categoryId
}

const rows = computed(() =>
  store.paginatedProjects.map((project) => {
    const content = project[store.lang] ?? project.en
    const stackItems = (project.stack || []).map((entry) => {
      const skill = skillById[entry] ?? skillByNormalizedKey[normalizeKey(entry)]
      return {
        key: entry,
        name: skill ? skill.name : entry,
        icon: skill ? deviconUrl(skill.icon) : deviconUrl(entry),
        sortOrder: skill?.sortOrder ?? 99,
      }
    })
    stackItems.sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))
    return {
      slug: project.slug,
      content,
      stack: stackItems,
      category: categoryLabel(project.category),
      live: project.links?.live ?? null,
      repo: project.links?.repo ?? null,
      image: project.image ?? null,
      imageSize: project.imageSize ?? null,
    }
  }),
)
</script>

<template>
  <StaggerGroup
    v-if="rows.length"
    :key="`${store.activeProjectFilter}-${store.currentPage}`"
    class="grid grid-cols-1 gap-5 sm:grid-cols-2"
    :stagger="0.05"
  >
    <StaggerItem v-for="row in rows" :key="row.slug" class="h-full">
      <ProjectCard
        :content="row.content"
        :stack="row.stack"
        :category="row.category"
        :live="row.live"
        :repo="row.repo"
        :image="row.image"
        :image-size="row.imageSize"
      />
    </StaggerItem>
  </StaggerGroup>

  <BaseCard v-else dashed>
    <p class="text-sm font-medium text-neutral-500">{{ store.t.projects.empty }}</p>
    <p class="mt-1 text-xs text-neutral-500">{{ store.t.projects.emptyDesc }}</p>
  </BaseCard>
</template>
