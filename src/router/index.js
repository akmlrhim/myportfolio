import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView, meta: { title: 'Home' } },
    { path: '/about', name: 'about', component: () => import('../views/AboutView.vue'), meta: { title: 'About' } },
    { path: '/projects', name: 'projects', component: () => import('../views/ProjectsView.vue'), meta: { title: 'Projects' } },
    { path: '/activity', name: 'activity', component: () => import('../views/ActivityView.vue'), meta: { title: 'Activity' } },
    { path: '/stats', name: 'stats', component: () => import('../views/StatsView.vue'), meta: { title: 'Stats' } },
    { path: '/contact', name: 'contact', component: () => import('../views/ContactView.vue'), meta: { title: 'Contact' } },
    { path: '/admin', name: 'admin', component: () => import('../views/AdminView.vue'), meta: { title: 'Admin' } },
    { path: '/:pathMatch(.*)', name: 'NotFound', component: () => import('../views/NotFoundView.vue'), meta: { title: 'Page Not Found' } },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
