import posthog from 'posthog-js'

const token = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN
const host = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com'

export const isAnalyticsEnabled = Boolean(token)

export function initAnalytics() {
  if (!isAnalyticsEnabled) return

  posthog.init(token, {
    api_host: host,
    defaults: '2026-05-30',
    capture_pageview: false,
    capture_pageleave: true,
    autocapture: true,
    rageclick: true,
    person_profiles: 'identified_only',
    persistence: 'localStorage+cookie',
    session_recording: {
      maskAllInputs: true,
    },
    capture_exceptions: true,
    respect_dnt: true,
  })
}

export function capturePageview(path, title) {
  if (!isAnalyticsEnabled) return
  posthog.capture('$pageview', {
    $current_url: window.location.href,
    path,
    ...(title ? { title } : {}),
  })
}

export function captureEvent(name, properties) {
  if (!isAnalyticsEnabled) return
  posthog.capture(name, properties)
}

export function identifyUser(distinctId, properties) {
  if (!isAnalyticsEnabled || !distinctId) return
  posthog.identify(distinctId, properties)
}

export function resetUser() {
  if (!isAnalyticsEnabled) return
  posthog.reset()
}

export function captureError(error, properties) {
  if (!isAnalyticsEnabled) return
  posthog.captureException(error, properties)
}

export default posthog
