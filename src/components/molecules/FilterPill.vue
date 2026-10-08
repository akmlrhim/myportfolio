<script setup>
defineProps({
  label: String,
  count: Number,
  active: Boolean,
})
</script>

<template>
  <button
    class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    :class="
      active
        ? 'bg-blue-600 text-white border-blue-600'
        : 'border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-neutral-600'
    "
  >
    {{ label }}
    <span
      class="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded text-[11px] font-bold"
      :class="
        active
          ? 'bg-white/20 text-white'
          : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
      "
    >
      {{ count }}
    </span>
  </button>
</template>