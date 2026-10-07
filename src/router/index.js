import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/about', name: 'about', component: () => import('../views/AboutView.vue') },
    { path: '/creations', name: 'creations', component: () => import('../views/CreationsView.vue') },
    { path: '/achievements', name: 'achievements', component: () => import('../views/AchievementsView.vue') },
    { path: '/projects', name: 'projects', component: () => import('../views/ProjectsView.vue') },
    { path: '/activity', name: 'activity', component: () => import('../views/ActivityView.vue') },
    { path: '/stats', name: 'stats', component: () => import('../views/StatsView.vue') },
    { path: '/guestbook', name: 'guestbook', component: () => import('../views/GuestbookView.vue') },
    { path: '/contact', name: 'contact', component: () => import('../views/ContactView.vue') },
    { path: '/links', name: 'links', component: () => import('../views/LinksView.vue') },
    { path: '/:pathMatch(.*)', name: 'NotFound', component: () => import('../views/NotFoundView.vue') },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
