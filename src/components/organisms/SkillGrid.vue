<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAppStore } from '@/stores/app'
import { motion } from 'motion-v'
import SkillChip from '@/components/molecules/SkillChip.vue'

const store = useAppStore()

const reducedMotion = ref(false)
onMounted(() => {
  reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
})

const initial = computed(() => (reducedMotion.value ? false : { opacity: 0, x: -18 }))

const layoutT = { duration: 0.4, ease: [0.22, 1, 0.36, 1] }

// Enter only: staggered slide-in. No exit animation, so chips from the previous
// category disappear instantly instead of lingering over the new ones.
function transitionFor(i) {
  if (reducedMotion.value) return { duration: 0, layout: { duration: 0 } }
  return {
    duration: 0.32,
    delay: Math.min(i * 0.022, 0.45),
    ease: [0.22, 1, 0.36, 1],
    layout: layoutT,
  }
}
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <motion.div
      v-for="(skill, i) in store.filteredSkills"
      :key="skill.id"
      layout
      :initial="initial"
      :animate="{ opacity: 1, x: 0 }"
      :transition="transitionFor(i)"
    >
      <SkillChip
        :name="skill.name"
        :icon="skill.icon"
        :color="skill.color"
      />
    </motion.div>
  </div>

  <p
    v-if="store.filteredSkills.length === 0"
    class="text-sm text-neutral-600 dark:text-neutral-400 mt-4"
  >
    No skills match this filter.
  </p>
</template>
