<script setup>
import Skeleton from '@/components/atoms/BaseSkeleton.vue'

// A stats card: rounded-2xl border p-4.
// `order` controls which line is the bold value:
//  - 'value-first' -> big value line, then small label (GitHub stats)
//  - 'label-first' -> small label line, then big value (WakaTime summary)
defineProps({
  order: { type: String, default: 'value-first' },
})
</script>

<template>
  <div class="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
    <template v-if="order === 'value-first'">
      <Skeleton w="w-1/3" h="h-6" rounded="rounded-lg" />
      <Skeleton w="w-2/3" h="h-3" class="mt-1.5" />
    </template>
    <template v-else>
      <Skeleton w="w-2/3" h="h-3" />
      <Skeleton w="w-1/2" h="h-5" rounded="rounded-lg" class="mt-1.5" />
    </template>
  </div>
</template>
