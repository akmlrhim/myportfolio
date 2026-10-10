<script setup>
import { ref, watch, computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import DefaultLayout from './components/templates/DefaultLayout.vue'
import PageSkeleton from './components/organisms/PageSkeleton.vue'
import HomeSkeleton from './components/skeletons/HomeSkeleton.vue'
import AboutSkeleton from './components/skeletons/AboutSkeleton.vue'
import ProjectsSkeleton from './components/skeletons/ProjectsSkeleton.vue'
import ComingSoonSkeleton from './components/skeletons/ComingSoonSkeleton.vue'
import ActivityPageSkeleton from './components/skeletons/ActivityPageSkeleton.vue'
import StatsSkeleton from './components/skeletons/StatsSkeleton.vue'
import GuestbookSkeleton from './components/skeletons/GuestbookSkeleton.vue'
import ContactSkeleton from './components/skeletons/ContactSkeleton.vue'
import LinksSkeleton from './components/skeletons/LinksSkeleton.vue'
import NotFoundSkeleton from './components/skeletons/NotFoundSkeleton.vue'
import router from './router'
import { pageview } from '@vercel/analytics'
import { capturePageview } from './utils/analytics'

const route = useRoute()
const routeLoading = ref(false)

// Map each route name to its layout-matched skeleton.
const SKELETONS = {
  home: HomeSkeleton,
  about: AboutSkeleton,
  creations: ComingSoonSkeleton,
  achievements: ComingSoonSkeleton,
  projects: ProjectsSkeleton,
  activity: ActivityPageSkeleton,
  stats: StatsSkeleton,
  guestbook: GuestbookSkeleton,
  contact: ContactSkeleton,
  links: LinksSkeleton,
  NotFound: NotFoundSkeleton,
}

const activeSkeleton = computed(() => SKELETONS[route.name] || PageSkeleton)

router.beforeEach((to) => {
  if (to.path !== route.path) routeLoading.value = true
})
router.afterEach((to) => {
  routeLoading.value = false
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
  </DefaultLayout>
</template>
