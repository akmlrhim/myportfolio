<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { motion } from 'motion-v'
import { useAppStore } from '@/stores/app'
import { useChat } from '@/composables/useChat'

const store = useAppStore()
const { messages, loading, error, send, clear } = useChat()

const open = ref(false)
const draft = ref('')
const listEl = ref(null)
const widgetEl = ref(null)

// Clicking or tapping outside the button and the panel closes the widget.
// Both live in one wrapper so pressing the toggle itself is never "outside".
onClickOutside(widgetEl, () => {
  open.value = false
})

// Static greeting first, then the live conversation underneath it.
const visibleMessages = computed(() => [
  { role: 'assistant', content: store.t.chat.greeting },
  ...messages.value,
])

function scrollToBottom() {
  nextTick(() => {
    const el = listEl.value
    if (el) el.scrollTop = el.scrollHeight
  })
}

watch(() => messages.value.map((m) => m.content).join('|'), scrollToBottom)
watch(loading, scrollToBottom)
watch(open, (v) => {
  if (v) scrollToBottom()
})

function submit() {
  const text = draft.value
  if (!text.trim() || loading.value) return
  draft.value = ''
  send(text)
}

function onEnter(e) {
  e.preventDefault()
  submit()
}

function onKeydown(e) {
  if (e.key === 'Escape') open.value = false
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div ref="widgetEl">
    <!-- Floating button -->
    <motion.button
      type="button"
      class="fixed right-5 bottom-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white shadow-lg transition-colors hover:bg-accent-dark sm:right-6 sm:bottom-6"
      :aria-label="open ? store.t.chat.close : store.t.chat.open"
      :aria-expanded="open"
      aria-haspopup="dialog"
      :initial="{ scale: 0, opacity: 0 }"
      :animate="{ scale: 1, opacity: 1 }"
      :transition="{ delay: 0.6, type: 'spring', stiffness: 260, damping: 20 }"
      @click="open = !open"
    >
      <svg v-if="!open" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    </motion.button>

    <!-- Chat panel -->
    <motion.div
      v-if="open"
      role="dialog"
      aria-modal="false"
      :aria-label="store.t.chat.title"
      class="fixed right-5 bottom-[4.75rem] z-50 flex h-[min(32rem,72vh)] w-[min(24rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-neutral-950 sm:right-6 sm:bottom-[5rem]"
      :initial="{ opacity: 0, y: 16, scale: 0.96 }"
      :animate="{ opacity: 1, y: 0, scale: 1 }"
      :transition="{ duration: 0.2, ease: 'easeOut' }"
    >
      <!-- Header -->
      <div class="flex items-center justify-between gap-3 border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
        <div class="min-w-0">
          <p class="text-sm font-semibold text-black dark:text-white">{{ store.t.chat.title }}</p>
          <p class="truncate text-xs text-black dark:text-white">{{ store.t.chat.subtitle }}</p>
        </div>
        <button
          type="button"
          class="shrink-0 rounded-lg p-1.5 text-black transition-colors hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800"
          :aria-label="store.t.chat.clear"
          @click="clear"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
          </svg>
        </button>
      </div>

      <!-- Messages -->
      <div ref="listEl" class="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        <div
          v-for="(m, i) in visibleMessages"
          :key="i"
          class="flex"
          :class="m.role === 'user' ? 'justify-end' : 'justify-start'"
        >
          <p
            class="max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap"
            :class="
              m.role === 'user'
                ? 'rounded-br-md bg-accent text-white'
                : 'rounded-bl-md bg-neutral-100 text-black dark:bg-neutral-800 dark:text-white'
            "
          >
            {{ m.content }}
          </p>
        </div>

        <div v-if="loading" class="flex justify-start">
          <span class="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-neutral-100 px-4 py-3 dark:bg-neutral-800">
            <span class="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:0ms]" />
            <span class="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:150ms]" />
            <span class="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:300ms]" />
          </span>
        </div>

        <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
      </div>

      <!-- Input -->
      <form class="flex items-center gap-2 border-t border-neutral-200 p-3 dark:border-neutral-800" @submit.prevent="submit">
        <input
          v-model="draft"
          type="text"
          class="min-w-0 flex-1 rounded-xl border border-neutral-200 bg-transparent px-3 py-2 text-sm text-black outline-none transition-colors placeholder:text-neutral-400 focus:border-accent dark:border-neutral-800 dark:text-white"
          :placeholder="store.t.chat.placeholder"
          :aria-label="store.t.chat.placeholder"
          maxlength="800"
          @keydown.enter="onEnter"
        />
        <button
          type="submit"
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-white transition-colors hover:bg-accent-dark disabled:opacity-40"
          :disabled="loading || !draft.trim()"
          :aria-label="store.t.chat.send"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m22 2-7 20-4-9-9-4z" />
            <path d="M22 2 11 13" />
          </svg>
        </button>
      </form>

      <p class="pb-2 text-center text-[10px] text-neutral-400 dark:text-neutral-500">
        {{ store.t.chat.disclaimer }}
      </p>
    </motion.div>
  </div>
</template>
