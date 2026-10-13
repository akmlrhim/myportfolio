<script setup>
import { ref } from 'vue'
import { adminLogin } from '@/utils/api'
import { useAdminAuth } from './AdminAuth'

const emit = defineEmits(['authed'])
const auth = useAdminAuth()
const password = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  if (!password.value) return
  loading.value = true
  error.value = ''
  try {
    await adminLogin(password.value)
    auth.authenticated.value = true
    emit('authed')
  } catch (err) {
    error.value = err.message || 'Login gagal'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center px-4">
    <div class="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-950">
      <h1 class="text-xl font-semibold text-neutral-900 dark:text-neutral-100 text-center">Admin</h1>
      <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400 text-center">Masukkan password untuk melanjutkan</p>

      <form class="mt-6 space-y-4" @submit.prevent="submit">
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          autofocus
          class="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {{ loading ? 'Memproses...' : 'Masuk' }}
        </button>
      </form>
    </div>
  </div>
</template>
