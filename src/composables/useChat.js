import { ref } from 'vue'
import { useAppStore } from '@/stores/app'

// All requests hit the same relative path: the Vite dev plugin serves it in
// dev (see vite.config.js) and the Vercel function api/chat.js serves it in
// production. The Groq API key never reaches the browser bundle.
const API_URL = '/api/chat'

export function useChat() {
  const store = useAppStore()

  const messages = ref([]) // [{ role: 'user' | 'assistant', content }]
  const loading = ref(false)
  const error = ref(null)

  async function send(text) {
    const content = (text ?? '').trim()
    if (!content || loading.value) return

    error.value = null
    messages.value.push({ role: 'user', content })
    loading.value = true

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lang: store.lang,
          messages: messages.value.map((m) => ({ role: m.role, content: m.content })),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`)
      messages.value.push({ role: 'assistant', content: data.reply })
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  function clear() {
    messages.value = []
    error.value = null
  }

  return { messages, loading, error, send, clear }
}
