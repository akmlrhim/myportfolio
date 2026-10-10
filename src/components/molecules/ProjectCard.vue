<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  // Localized content: { title }
  content: { type: Object, required: true },
  // Normalized stack items: [{ key, name, icon }]
  stack: { type: Array, default: () => [] },
  category: { type: String, default: '' },
  live: { type: String, default: null },
  repo: { type: String, default: null },
  // Local preview image path (e.g. '/images/projects/<slug>.webp').
  image: { type: String, default: null },
  // Intrinsic image size { width, height } to reserve space (avoids layout shift).
  imageSize: { type: Object, default: null },
})

const hasLink = computed(() => Boolean(props.live || props.repo))
const href = computed(() => props.live || props.repo || '#')
const isExternal = computed(() => /^https?:/.test(href.value))

// Preview image is uploaded to /public/images/projects; falls back to a
// gradient + initials when missing or when the file fails to load.
const previewFailed = ref(false)
const showPreview = computed(() => Boolean(props.image) && !previewFailed.value)
const initials = computed(() => initialsOf(props.content?.title))

function initialsOf(title) {
  if (!title) return '—'
  const words = String(title).trim().split(/\s+/).filter(Boolean)
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

// Show up to 5 stack icons; overflow as "+N".
const MAX_ICONS = 5
const visibleStack = computed(() => props.stack.slice(0, MAX_ICONS))
const overflow = computed(() => Math.max(props.stack.length - MAX_ICONS, 0))
const stackLabel = computed(() => props.stack.map((s) => s.name).join(', '))
</script>

<template>
  <article class="group relative h-full">
    <component
      :is="hasLink ? 'a' : 'div'"
      :href="hasLink ? href : undefined"
      :target="hasLink && isExternal ? '_blank' : undefined"
      :rel="hasLink && isExternal ? 'noopener noreferrer' : undefined"
      :aria-label="hasLink ? `${content.title} — ${live ? 'Live Demo' : 'Source Code'}` : undefined"
      class="flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-[border-color,box-shadow] duration-200 ease-out dark:border-neutral-800 dark:bg-neutral-950"
      :class="
        hasLink
          ? 'cursor-pointer hover:border-neutral-300 hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 dark:hover:border-neutral-600 dark:hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)] dark:focus-visible:ring-offset-neutral-950'
          : ''
      "
    >
      <!-- Preview media -->
      <div class="relative w-full overflow-hidden">
        <img
          v-if="showPreview"
          :src="image"
          :alt="`Preview of ${content.title}`"
          :width="imageSize?.width"
          :height="imageSize?.height"
          class="block h-auto w-full"
          loading="lazy"
          decoding="async"
          @error="previewFailed = true"
        />

        <!-- Fallback: subtle gradient + initials (no external asset needed) -->
        <div
          v-else
          aria-hidden="true"
          class="flex aspect-[16/10] w-full items-center justify-center bg-gradient-to-br from-neutral-100 via-neutral-50 to-neutral-200 dark:from-neutral-800 dark:via-neutral-900 dark:to-neutral-950"
        >
          <span class="text-3xl font-semibold tracking-wide text-neutral-300 dark:text-neutral-600">
            {{ initials }}
          </span>
        </div>

        <!-- Fade the image into the card surface (no hard edge) -->
        <div
          aria-hidden="true"
          class="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-white via-white/70 to-transparent dark:from-neutral-950 dark:via-neutral-950/70"
        />
      </div>

      <!-- Body -->
      <div class="flex flex-1 flex-col p-6">
        <!-- Top row: category + arrow affordance -->
        <div class="flex items-start justify-between gap-3">
          <span
            v-if="category"
            class="text-sm font-medium text-neutral-400 dark:text-neutral-500"
          >
            {{ category }}
          </span>
          <span
            v-if="hasLink"
            aria-hidden="true"
            class="text-neutral-300 transition-colors duration-200 group-hover:text-accent dark:text-neutral-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M7 17 17 7" /><path d="M7 7h10v10" />
            </svg>
          </span>
        </div>

        <!-- Title -->
        <h3 class="mt-3 text-base font-semibold leading-snug text-neutral-900 dark:text-neutral-100">
          {{ content.title }}
        </h3>

        <!-- Stack, pinned to bottom -->
        <div class="mt-auto pt-6">
          <div class="flex items-center gap-2" :aria-label="stackLabel">
            <span
              v-for="item in visibleStack"
              :key="item.key"
              class="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900"
              :title="item.name"
            >
              <img
                v-if="item.icon"
                :src="item.icon"
                :alt="item.name"
                class="h-4 w-4 object-contain"
                loading="lazy"
                decoding="async"
              />
              <span v-else class="text-[10px] font-bold text-neutral-500 dark:text-neutral-400">
                {{ item.name.charAt(0) }}
              </span>
            </span>
            <span
              v-if="overflow"
              class="flex h-7 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 px-2 text-[11px] font-medium text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400"
            >
              +{{ overflow }}
            </span>
          </div>
        </div>
      </div>
    </component>
  </article>
</template>
