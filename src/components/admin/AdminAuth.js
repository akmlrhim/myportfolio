import { ref } from 'vue'
import { getAdminToken, clearAdminToken } from '@/utils/api'

// Shared admin authentication state.
export function useAdminAuth() {
  const authenticated = ref(!!getAdminToken())

  function logout() {
    clearAdminToken()
    authenticated.value = false
  }

  return { authenticated, logout }
}

// Singleton instance shared across components.
export const adminAuth = useAdminAuth()
