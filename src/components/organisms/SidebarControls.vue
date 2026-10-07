<script setup>
import { useAppStore } from '@/stores/app'
import TogglePill from '@/components/molecules/TogglePill.vue'

const store = useAppStore()
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <!-- Lang toggle -->
    <TogglePill :model-value="store.lang === 'id'" @update:model-value="store.toggleLang()"
      :label="store.t.sidebar.langToggle" left-label="EN" right-label="ID" />

    <!-- Dark mode toggle -->
    <TogglePill :model-value="store.dark" @update:model-value="store.toggleDark()" :label="store.t.sidebar.darkToggle"
      :left-icon="`<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; width=&quot;14&quot; height=&quot;14&quot; viewBox=&quot;0 0 24 24&quot; fill=&quot;none&quot; stroke=&quot;currentColor&quot; stroke-width=&quot;2&quot;><circle cx=&quot;12&quot; cy=&quot;12&quot; r=&quot;5&quot;/><path d=&quot;M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42&quot;/></svg>`"
      :right-icon="`<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; width=&quot;14&quot; height=&quot;14&quot; viewBox=&quot;0 0 24 24&quot; fill=&quot;none&quot; stroke=&quot;currentColor&quot; stroke-width=&quot;2&quot;><path d=&quot;M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z&quot;/></svg>`" />
  </div>
</template>