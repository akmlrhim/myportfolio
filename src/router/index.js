import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView, meta: { title: 'Home' } },
    { path: '/about', name: 'about', component: () => import('../views/AboutView.vue'), meta: { title: 'About' } },
    { path: '/creations', name: 'creations', component: () => import('../views/CreationsView.vue'), meta: { title: 'Creations' } },
    { path: '/achievements', name: 'achievements', component: () => import('../views/AchievementsView.vue'), meta: { title: 'Achievements' } },
    { path: '/projects', name: 'projects', component: () => import('../views/ProjectsView.vue'), meta: { title: 'Projects' } },
    { path: '/activity', name: 'activity', component: () => import('../views/ActivityView.vue'), meta: { title: 'Activity' } },
    { path: '/stats', name: 'stats', component: () => import('../views/StatsView.vue'), meta: { title: 'Stats' } },
    { path: '/guestbook', name: 'guestbook', component: () => import('../views/GuestbookView.vue'), meta: { title: 'Guestbook' } },
    { path: '/contact', name: 'contact', component: () => import('../views/ContactView.vue'), meta: { title: 'Contact' } },
    { path: '/links', name: 'links', component: () => import('../views/LinksView.vue'), meta: { title: 'Links' } },
    { path: '/:pathMatch(.*)', name: 'NotFound', component: () => import('../views/NotFoundView.vue'), meta: { title: 'Page Not Found' } },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
