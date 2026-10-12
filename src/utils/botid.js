import { initBotId } from 'botid/client/core'

const PROTECTED_ROUTES = [
  { path: '/api/wakatime/summaries', method: 'GET' },
  { path: '/api/wakatime/all-time', method: 'GET' },
]

export function initBotProtection() {
  if (typeof window === 'undefined') return
  initBotId({ protect: PROTECTED_ROUTES })
}
