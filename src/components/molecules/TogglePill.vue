<script setup>
defineEmits(['update:modelValue'])

defineProps({
  modelValue: Boolean,
  leftLabel: String,
  rightLabel: String,
  leftIcon: String,
  rightIcon: String,
  label: String,
})
</script>

<template>
  <button
    class="flex items-center shrink-0 rounded-full border border-neutral-300 dark:border-neutral-700 overflow-hidden text-xs font-medium h-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    :aria-label="label"
    :title="label"
    :aria-pressed="modelValue"
    @click="$emit('update:modelValue', !modelValue)"
  >
    <span
      class="flex h-full items-center gap-1 px-3 transition-colors"
      :class="!modelValue ? 'bg-blue-600 text-white' : 'text-neutral-500 dark:text-neutral-400'">
      <span v-if="leftIcon" v-html="leftIcon"></span>
      {{ leftLabel }}
    </span>
    <span
      class="flex h-full items-center gap-1 px-3 transition-colors"
      :class="modelValue ? 'bg-blue-600 text-white' : 'text-neutral-500 dark:text-neutral-400'">
      <span v-if="rightIcon" v-html="rightIcon"></span>
      {{ rightLabel }}
    </span>
  </button>
</template>