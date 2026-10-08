import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Accept both the bare WAKATIME_API name (shell/CI env or .env) and the
  // Vite-conventional VITE_WAKATIME_API.
  const wakatimeApi = env.WAKATIME_API || env.VITE_WAKATIME_API || process.env.WAKATIME_API || ''

  return {
    plugins: [vue(), vueDevTools(), tailwindcss()],
    define: {
      'import.meta.env.WAKATIME_API': JSON.stringify(wakatimeApi),
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      cssCodeSplit: true,
      reportCompressedSize: false,
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('motion')) return 'vendor-motion'
              if (id.includes('vue-router')) return 'vendor-router'
              if (id.includes('pinia')) return 'vendor-pinia'
              if (id.includes('@vue') || id.includes('/vue/')) return 'vendor-vue'
              return 'vendor'
            }
          },
        },
      },
    },
    server: {
      proxy: {
        '/api/wakatime': {
          target: 'https://api.wakatime.com/api/v1',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/wakatime/, ''),
        },
      },
    },
  }
})