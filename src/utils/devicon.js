// Maps internal icon keys to devicon/simple-icons SVG files shipped in /public/icons/devicon.
const DEVICON_MAP = {
  javascript: 'javascript-javascript-original',
  react: 'react-react-original',
  reactjs: 'react-react-original',
  vuejs: 'vuejs-vuejs-original',
  vue: 'vuejs-vuejs-original',
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
  googleanalytics: 'googleanalytics-googleanalytics-original',
  googletagmanager: 'googletagmanager-googletagmanager-original',
  googlesearchconsole: 'googlesearchconsole-googlesearchconsole-original',
  laragon: 'laragon-original',
  prisma: 'prisma-prisma-original',
  expressjs: 'express-js-original',
  express: 'express-js-original',
  go: 'go-go-original',
  golang: 'go-go-original',
  typescript: 'typescript-typescript-original',
  inertiajs: 'inertiajs-inertiajs-original',
  filament: 'filamentphp-filamentphp-original',
  tailwindcss: 'tailwindcss-tailwindcss-original',
  bootstrap: 'bootstrap-bootstrap-original',
  inertiajs: 'inertiajs-inertiajs-original',
  gsap: 'gsap-gsap-original',
  pinia: 'pinia-pinia-original',
  vite: 'vite-vite-original',
  scikitlearn: 'scikitlearn-scikitlearn-original',
  pandas: 'pandas-pandas-original',
  pusher: 'pusher-pusher-original',
  umami: 'umami-umami-original',
  livewire: 'livewire-livewire-original',
  shadcnui: 'shadcnui-shadcnui-original',
  fluxui: 'fluxui-fluxui-original',
  framer: 'framer-framer-original',
  framermotion: 'framer-framer-original',
}

function normalizeIconKey(iconKey) {
  return iconKey.toLowerCase().replace(/[^a-z0-9]/g, '')
}

const LOOKUP = Object.fromEntries(
  Object.entries(DEVICON_MAP).map(([k, v]) => [normalizeIconKey(k), v]),
)

export function deviconSlug(iconKey) {
  return LOOKUP[normalizeIconKey(iconKey)] || null
}

export function deviconUrl(iconKey) {
  const slug = deviconSlug(iconKey)
  return slug ? `/icons/devicon/${slug}.svg` : null
}
