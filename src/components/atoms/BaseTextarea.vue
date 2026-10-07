<script setup>
defineProps({
  id: String,
  label: String,
  modelValue: String,
  placeholder: String,
  required: Boolean,
  rows: { type: Number, default: 4 },
})
defineEmits(['update:modelValue'])
</script>

<template>
  <div>
    <label v-if="label" :for="id" class="block text-sm font-medium mb-1.5">{{ label }}</label>
    <textarea
      :id="id"
      :value="modelValue"
      :required="required"
      :rows="rows"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
      class="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    ></textarea>
  </div>
</template>