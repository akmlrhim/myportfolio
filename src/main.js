import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { inject } from '@vercel/analytics'
import { captureError, initAnalytics, isAnalyticsEnabled } from './utils/analytics'
import { initBotProtection } from './utils/botid'
import { useAppStore } from './stores/app'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

initAnalytics()
initBotProtection()

if (isAnalyticsEnabled) {
  app.config.errorHandler = (err, _instance, info) =>
    captureError(err, { $exception_source: 'vue', info })
}

// Load portfolio content from DB (falls back to static data on failure).
const store = useAppStore()
store.loadPortfolio()

app.mount('#app')

inject()