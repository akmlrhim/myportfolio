<script setup>
import { ref } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { AnimatePresence, motion } from 'motion-v'
import DefaultLayout from './components/templates/DefaultLayout.vue'
import PageSkeleton from './components/organisms/PageSkeleton.vue'
import router from './router'
import { pageview } from '@vercel/analytics'

const route = useRoute()
const routeLoading = ref(false)

router.beforeEach((to) => {
  if (to.path !== route.path) routeLoading.value = true
})
router.afterEach((to) => {
  routeLoading.value = false
  pageview({ route: to.path })
})
</script>

<template>
  <DefaultLayout>
    <RouterView v-slot="{ Component }">
      <AnimatePresence mode="wait">
        <motion.div
          v-if="routeLoading"
          key="route-skeleton"
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1, transition: { duration: 0.15 } }"
          :exit="{ opacity: 0, transition: { duration: 0.15 } }"
        >
          <PageSkeleton />
        </motion.div>
        <motion.div
          v-else
          :key="route.path"
          :initial="{ opacity: 0, y: 24 }"
          :animate="{ opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] } }"
          :exit="{ opacity: 0, y: -16, transition: { duration: 0.2, ease: 'easeIn' } }"
        >
          <component :is="Component" />
        </motion.div>
      </AnimatePresence>
    </RouterView>
  </DefaultLayout>
</template>
