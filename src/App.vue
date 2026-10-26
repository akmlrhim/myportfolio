<script setup>
import { ref, watch, computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import DefaultLayout from './components/templates/DefaultLayout.vue'
import PageSkeleton from './components/organisms/PageSkeleton.vue'
import AskAiWidget from './components/organisms/AskAiWidget.vue'
import HomeSkeleton from './components/skeletons/HomeSkeleton.vue'
import AboutSkeleton from './components/skeletons/AboutSkeleton.vue'
import ProjectsSkeleton from './components/skeletons/ProjectsSkeleton.vue'
import ActivityPageSkeleton from './components/skeletons/ActivityPageSkeleton.vue'
import StatsSkeleton from './components/skeletons/StatsSkeleton.vue'
import ContactSkeleton from './components/skeletons/ContactSkeleton.vue'
import NotFoundSkeleton from './components/skeletons/NotFoundSkeleton.vue'
import router from './router'
import { pageview } from '@vercel/analytics'
import { SpeedInsights } from '@vercel/speed-insights/vue'
import { capturePageview } from './utils/analytics'

const route = useRoute()
const routeLoading = ref(false)
// Destination route name captured before the route object updates, so the
// skeleton always matches the page being navigated to, not the previous one.
const loadingRouteName = ref(null)

// Map each route name to its layout-matched skeleton.
const SKELETONS = {
  home: HomeSkeleton,
  about: AboutSkeleton,
  projects: ProjectsSkeleton,
  activity: ActivityPageSkeleton,
  stats: StatsSkeleton,
  contact: ContactSkeleton,
  NotFound: NotFoundSkeleton,
}

const activeSkeleton = computed(() => SKELETONS[loadingRouteName.value] || PageSkeleton)

router.beforeEach((to) => {
  if (to.path !== route.path) {
    loadingRouteName.value = to.name
    routeLoading.value = true
  }
})
router.afterEach((to) => {
  routeLoading.value = false
  loadingRouteName.value = null
  pageview({ route: to.path })
  capturePageview(to.path, to.meta?.title)
})

watch(
  () => route.path,
  () => {
    const title = route.meta?.title
    document.title = title ? `${title} | Akmal Rahim` : 'Akmal Rahim | Portfolio'
  },
  { immediate: true },
)
</script>

<template>
  <DefaultLayout>
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="activeSkeleton" v-if="routeLoading" key="skeleton" />
        <component :is="Component" v-else :key="route.path" />
      </Transition>
    </RouterView>
    <AskAiWidget />
    <SpeedInsights />
  </DefaultLayout>
</template>
