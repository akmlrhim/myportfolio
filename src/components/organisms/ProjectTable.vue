<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { skillById } from '@/data/skills'
import { deviconUrl } from '@/utils/devicon'
import BaseIcon from '@/components/atoms/BaseIcon.vue'
import BaseCard from '@/components/atoms/BaseCard.vue'

const store = useAppStore()

const normalizeKey = (key) => String(key).toLowerCase().replace(/[^a-z0-9]/g, '')
const skillByNormalizedkey = Object.fromEntries(
  Object.values(skillById).map((skill) => [normalizeKey(skill.id), skill]),
)

const rows = computed(() =>
  store.filteredProjects.map((project) => {
    const content = project[store.lang] ?? project.en
    const stackItems = (project.stack || []).map((entry) => {
      const skill = skillById[entry] ?? skillByNormalizedkey[normalizeKey(entry)]
      return {
        key: entry,
        name: skill ? skill.name : entry,
        icon: skill ? deviconUrl(skill.icon) : deviconUrl(entry),
        sortOrder: skill?.sortOrder ?? 99,
      }
    })
    stackItems.sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))
    return { project, content, stack: stackItems }
  }),
)

const eyeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.458 12C3.732 7.943 7.5 5.5 12 5.5c4.5 0 8.268 2.443 9.542 6.5C19.5 15.057 16.5 17.5 12 17.5c-4.5 0-8.268-2.443-9.542-5.5z"/><path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/></svg>`
const githubLogo = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.205 11.387.6.11.79-.258.79-.571 0-.282-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.755-1.333-1.755-1.09-.745.083-.73.083-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.419-1.305.76-1.605-2.665-.3-5.466-1.334-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.809 5.63-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.18.69.795.571C20.565 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12"/></svg>`
</script>

<template>
  <div
    v-if="rows.length"
    class="overflow-x-auto rounded-sm border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900/40"
  >
    <table class="w-full min-w-[500px] border-collapse text-left text-sm">
      <thead>
        <tr class="border-b border-neutral-200 dark:border-neutral-800">
          <th scope="col" class="w-2/5 px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
            {{ store.t.projects.project }}
          </th>
          <th scope="col" class="px-4 py-3">
            <span class="sr-only">{{ store.t.projects.stack }}</span>
          </th>
          <th scope="col" class="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
            {{ store.t.projects.links }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in rows"
          :key="row.project.slug"
          class="border-b border-neutral-100 transition-colors last:border-0 hover:bg-neutral-50 dark:border-neutral-800/60 dark:hover:bg-neutral-800/30"
        >
          <td class="px-4 py-3.5">
            <span class="font-semibold text-neutral-900 dark:text-neutral-100">{{ row.content.title }}</span>
          </td>
          <td class="px-4 py-3.5">
            <ul class="flex flex-wrap items-center gap-x-2 gap-y-1" :aria-label="store.t.projects.stack">
              <li v-for="item in row.stack" :key="item.key">
                <img
                  v-if="item.icon"
                  :src="item.icon"
                  :alt="item.name"
                  :title="item.name"
                  class="h-4 w-4"
                  loading="lazy"
                />
              </li>
            </ul>
          </td>
          <td class="whitespace-nowrap px-4 py-3.5">
            <div class="flex items-center justify-end gap-3">
              <a
                v-if="row.project.links?.live"
                :href="row.project.links.live"
                target="_blank"
                rel="noopener noreferrer"
                class="text-neutral-600 transition-colors hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400"
                :aria-label="store.t.projects.viewLive + ': ' + row.content.title"
                :title="store.t.projects.viewLive"
              >
                <BaseIcon :svg="eyeIcon" :size="16" />
              </a>
              <a
                v-if="row.project.links?.repo"
                :href="row.project.links.repo"
                target="_blank"
                rel="noopener noreferrer"
                class="text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"
                :aria-label="store.t.projects.viewCode + ': ' + row.content.title"
                :title="store.t.projects.viewCode"
              >
                <BaseIcon :svg="githubLogo" :size="16" />
              </a>
              <span
                v-if="!row.project.links?.live && !row.project.links?.repo"
                class="text-xs text-neutral-400 dark:text-neutral-600"
                aria-hidden="true"
              >
                -
              </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <BaseCard v-else dashed>
    <p class="text-sm font-medium text-neutral-500">{{ store.t.projects.empty }}</p>
    <p class="mt-1 text-xs text-neutral-500">{{ store.t.projects.emptyDesc }}</p>
  </BaseCard>
</template>
