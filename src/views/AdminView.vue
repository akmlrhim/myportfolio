<script setup>
import { ref, onMounted } from 'vue'
import { adminAuth } from '@/components/admin/AdminAuth'
import AdminLogin from '@/components/admin/AdminLogin.vue'
import AdminResource from '@/components/admin/AdminResource.vue'
import { ADMIN_RESOURCES } from '@/data/adminResources'

const activeTab = ref(ADMIN_RESOURCES[0].key)

onMounted(() => {
  document.title = 'Admin | Akmal Rahim'
})
</script>

<template>
  <AdminLogin v-if="!adminAuth.authenticated.value" />

  <div v-else class="py-6 lg:py-10">
    <!-- Header -->
    <div class="flex items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-neutral-100">Admin Panel</h1>
        <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Kelola data portfolio</p>
      </div>
      <button
        class="text-sm px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
        @click="adminAuth.logout()"
      >
        Keluar
      </button>
    </div>

    <!-- Tabs -->
    <div class="mt-6 flex flex-wrap gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3">
      <button
        v-for="r in ADMIN_RESOURCES"
        :key="r.key"
        class="text-sm px-3 py-1.5 rounded-lg transition-colors"
        :class="activeTab === r.key
          ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
          : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'"
        @click="activeTab = r.key"
      >
        {{ r.label }}
      </button>
    </div>

    <!-- Resource panel -->
    <div class="mt-6">
      <AdminResource :key="activeTab" :resource-key="activeTab" />
    </div>
  </div>
</template>
