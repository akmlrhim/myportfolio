<script setup>
const props = defineProps({
  name: String,
  icon: String,
  color: String,
})

function deviconSlug(skillIcon) {
  const map = {
    html5: 'html5-html5-original',
    css3: 'css3-css3-original',
    bootstrap: 'bootstrap-bootstrap-original',
    tailwindcss: 'tailwindcss-tailwindcss-original',
    javascript: 'javascript-javascript-original',
    typescript: 'typescript-typescript-original',
    react: 'react-react-original',
    vitejs: 'vitejs-vitejs-original',
    astro: 'astro-astro-original',
    nextjs: 'nextjs-nextjs-original',
    redux: 'redux-redux-original',
    nodejs: 'nodejs-nodejs-original',
    express: 'express-express-original',
    go: 'go-go-original-wordmark',
    gin: 'gin-original',
    swagger: 'swagger-original',
    php: 'php-php-original',
    laravel: 'laravel-laravel-original',
    kotlin: 'kotlin-kotlin-original',
    jetpackcompose: 'jetpackcompose-original',
    postgresql: 'postgresql-postgresql-original',
    mysql: 'mysql-mysql-original-wordmark',
    firebase: 'firebase-firebase-original',
    docker: 'docker-docker-original-wordmark',
    npm: 'npm-npm-original-wordmark',
    yarn: 'yarn-yarn-original-wordmark',
    git: 'git-git-original-wordmark',
    postman: 'postman-postman-original',
    prisma: 'prisma-original',
  }
  const slug = map[skillIcon]
  if (slug) return `/icons/devicon/${slug}.svg`
  const simpleMap = {
    shadcnui: 'shadcnui',
    tanstack: 'tanstack',
    axios: 'axios',
    zod: 'zod',
    supabase: 'supabase',
  }
  const simpleSlug = simpleMap[skillIcon]
  if (simpleSlug) return `/icons/simple-icons/${simpleSlug}.svg`
  return null
}

const imgSrc = deviconSlug(props.icon)

function handleImgError(e) {
  const fallback = e.target.nextElementSibling
  if (fallback) {
    e.target.style.display = 'none'
    fallback.style.display = 'flex'
  }
}
</script>

<template>
  <div
    class="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
  >
    <span class="relative w-5 h-5 flex-shrink-0">
      <img
        :src="imgSrc"
        :alt="name"
        class="w-5 h-5"
        loading="lazy"
        @error="handleImgError"
      />
      <span
        class="hidden w-5 h-5 rounded bg-neutral-200 dark:bg-neutral-700 items-center justify-center text-[10px] font-bold text-neutral-700 dark:text-neutral-200"
      >
        {{ name.charAt(0) }}
      </span>
    </span>
    {{ name }}
  </div>
</template>