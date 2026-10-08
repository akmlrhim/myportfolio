<script setup>
const props = defineProps({
  name: String,
  icon: String,
  color: String,
})

function deviconSlug(skillIcon) {
  const map = {
    javascript: 'javascript-javascript-original',
    react: 'react-react-original',
    vuejs: 'vuejs-vuejs-original',
    laravel: 'laravel-laravel-original',
    php: 'php-php-original',
    codeigniter: 'codeigniter-codeigniter-plain',
    python: 'python-python-original',
    mysql: 'mysql-mysql-original-wordmark',
    postgresql: 'postgresql-postgresql-original',
    bun: 'bun-bun-original',
    npm: 'npm-npm-original-wordmark',
    github: 'github-github-original',
    gitlab: 'gitlab-gitlab-original',
    figma: 'figma-figma-original',
    'github-actions': 'github-actions-plain',
    'google-colaboratory': 'googlecolaboratory-original',
    laragon: 'laragon-original',
    prisma: 'prisma-prisma-original',
    expressjs: 'express-js-original',
    go: 'go-go-original',
  }
  const slug = map[skillIcon]
  if (slug) return `/icons/devicon/${slug}.svg`
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