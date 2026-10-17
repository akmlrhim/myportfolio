import { initBotId } from 'botid/client/core'

const PROTECTED_ROUTES = [
  { path: '/api/wakatime/summaries', method: 'GET' },
  { path: '/api/wakatime/all-time', method: 'GET' },
]

export function initBotProtection() {
  if (typeof window === 'undefined') return
  // The challenge script only exists behind Vercel's rewrites (see vercel.json).
  // In dev there is no such route, so loading it only produces a 404.
  if (import.meta.env.DEV) return
  initBotId({ protect: PROTECTED_ROUTES })
}
