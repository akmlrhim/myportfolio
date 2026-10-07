<script setup>
import AppSidebar from '@/components/organisms/AppSidebar.vue'
import MobileNavbar from '@/components/organisms/MobileNavbar.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col lg:flex-row">
    <MobileNavbar />
    <AppSidebar />

    <main class="flex-1 min-w-0 px-4 sm:px-6 lg:px-10 py-5 lg:py-8 max-w-4xl mx-auto w-full">
      <slot />
    </main>
  </div>
</template>