import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const wakatimeApi = env.WAKATIME_API || env.VITE_WAKATIME_API || process.env.WAKATIME_API || ''

  return {
    plugins: [vue(), vueDevTools(), tailwindcss()],
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
              if (id.includes('posthog')) return 'vendor-posthog'
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
          rewrite: (path) => {
            const [route, query = ''] = path.replace(/^\/api\/wakatime/, '').split('?')
            const upstream =
              route === '/all-time'
                ? '/users/current/all_time_since_today'
                : '/users/current/summaries'
            return query ? `${upstream}?${query}` : upstream
          },
          headers: wakatimeApi
            ? { Authorization: `Basic ${Buffer.from(wakatimeApi).toString('base64')}` }
            : {},
        },
      },
    },
  }
})