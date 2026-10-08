import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { inject } from '@vercel/analytics'
import posthog from 'posthog-js'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// PostHog: only init when the project token is configured, so local dev
// without env vars stays silent. `defaults` enables autocapture and
// `capture_pageview: 'history_change'`, which tracks vue-router navigations.
const posthogToken = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN
if (posthogToken) {
  posthog.init(posthogToken, {
    api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com',
    defaults: '2026-05-30',
  })
  app.config.errorHandler = (err) => posthog.captureException(err)
}

app.mount('#app')

inject()