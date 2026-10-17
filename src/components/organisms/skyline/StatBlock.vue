<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: String, required: true },
  unit: { type: String, required: true },
  sub: { type: String, required: true },
  accent: { type: String, required: true },
  size: { type: Number, required: true },
  align: { type: String, default: 'start' },
})
</script>

<template>
  <div class="min-w-0" :class="align === 'end' ? 'text-right' : ''">
    <div class="text-[12px] leading-tight text-neutral-500 sm:text-[13px] dark:text-neutral-400">{{ label }}</div>
    <div class="mt-1 flex flex-wrap items-baseline gap-x-1.5" :class="align === 'end' ? 'justify-end' : ''">
      <span
        class="font-semibold tabular-nums transition-colors duration-500 motion-reduce:transition-none"
        :style="{ color: accent, fontSize: size + 'px', lineHeight: 1, letterSpacing: '-0.02em' }"
      >
        {{ value }}
      </span>
      <span class="text-[13px] sm:text-[14px]">{{ unit }}</span>
    </div>
    <div class="mt-0.5 text-[11px] leading-snug sm:text-[12px] text-neutral-500 dark:text-neutral-400">{{ sub }}</div>
  </div>
</template>
