<script setup>
import { ref, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
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
        <PageSkeleton v-if="routeLoading" key="skeleton" />
        <component :is="Component" v-else :key="route.path" />
      </Transition>
    </RouterView>
  </DefaultLayout>
</template>
