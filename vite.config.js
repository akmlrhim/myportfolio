import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// Reuse the exact Vercel function in dev so local behavior matches production.
import chatHandler from './api/chat.js'

// Minimal shim exposing the Vercel-style response helpers (status/json/send)
// on a plain Node response object.
function createResShim(nodeRes) {
  const state = { statusCode: 200 }
  const shim = {
    setHeader: (key, value) => nodeRes.setHeader(key, value),
    status(code) {
      state.statusCode = code
      return shim
    },
    json(payload) {
      nodeRes.statusCode = state.statusCode
      nodeRes.setHeader('Content-Type', 'application/json')
      nodeRes.end(JSON.stringify(payload))
    },
    send(body) {
      nodeRes.statusCode = state.statusCode
      nodeRes.end(body)
    },
  }
  return shim
}

// Serves POST /api/chat through api/chat.js during `vite dev`, mirroring how
// Vercel serves it in production (Vercel routes /api/* automatically).
function chatApiDevPlugin() {
  return {
    name: 'dev-chat-api',
    configureServer(server) {
      server.middlewares.use('/api/chat', (req, res) => {
        chatHandler(req, createResShim(res)).catch((err) => {
          console.error('Dev chat API failed:', err)
          res.statusCode = 500
          res.end(JSON.stringify({ error: 'Internal error' }))
        })
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const wakatimeApi = env.WAKATIME_API || env.VITE_WAKATIME_API || process.env.WAKATIME_API || ''

  // api/chat.js reads these from process.env; populate from .env files in dev.
  const groqKey = env.GROQ_API_KEY || env.VITE_GROQ_API_KEY || process.env.GROQ_API_KEY || ''
  const groqModel = env.GROQ_MODEL || process.env.GROQ_MODEL || ''
  if (groqKey) process.env.GROQ_API_KEY = groqKey
  if (groqModel) process.env.GROQ_MODEL = groqModel

  return {
    plugins: [vue(), vueDevTools(), tailwindcss(), chatApiDevPlugin()],
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