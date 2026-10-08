const CATEGORY_ORDER = {
  main: 1,
  frontend: 2,
  backend: 3,
  database: 4,
  tools: 5,
}

export const skillCategories = [
  { id: 'all', labelKey: 'all' },
  { id: 'main', labelKey: 'main' },
  { id: 'frontend', labelKey: 'frontend' },
  { id: 'backend', labelKey: 'backend' },
  { id: 'database', labelKey: 'database' },
  { id: 'tools', labelKey: 'tools' },
]

export const skills = [
  // Main
  { id: 'javascript', name: 'JavaScript', category: 'frontend', main: true, icon: 'javascript', color: '#F7DF1E', sortOrder: CATEGORY_ORDER.main },
  { id: 'laravel', name: 'Laravel', category: 'backend', main: true, icon: 'laravel', color: '#FF2D20', sortOrder: CATEGORY_ORDER.main },
  { id: 'php', name: 'PHP', category: 'backend', main: true, icon: 'php', color: '#777BB4', sortOrder: CATEGORY_ORDER.main },
  { id: 'vuejs', name: 'Vue.js', category: 'frontend', main: true, icon: 'vuejs', color: '#4FC08D', sortOrder: CATEGORY_ORDER.main },
  // Frontend
  { id: 'reactjs', name: 'React.js', category: 'frontend', icon: 'react', color: '#61DAFB', sortOrder: CATEGORY_ORDER.frontend },
  { id: 'tailwindcss', name: 'Tailwind CSS', category: 'frontend', icon: 'tailwindcss', color: '#06B6D4', sortOrder: CATEGORY_ORDER.frontend },
  { id: 'bootstrap', name: 'Bootstrap', category: 'frontend', icon: 'bootstrap', color: '#7952B3', sortOrder: CATEGORY_ORDER.frontend },
  { id: 'inertiajs', name: 'Inertia.js', category: 'frontend', icon: 'inertiajs', color: '#9553E9', sortOrder: CATEGORY_ORDER.frontend },
  { id: 'livewire', name: 'Livewire', category: 'frontend', icon: 'livewire', color: '#FB70A9', sortOrder: CATEGORY_ORDER.frontend },
  { id: 'shadcn-ui', name: 'shadcn/ui', category: 'frontend', icon: 'shadcnui', color: '#000000', sortOrder: CATEGORY_ORDER.frontend },
  { id: 'fluxui', name: 'Flux UI', category: 'frontend', icon: 'fluxui', color: '#000000', sortOrder: CATEGORY_ORDER.frontend },
  { id: 'framer-motion', name: 'Framer Motion', category: 'frontend', icon: 'framermotion', color: '#0055FF', sortOrder: CATEGORY_ORDER.frontend },
  // Backend
  { id: 'codeigniter', name: 'CodeIgniter', category: 'backend', icon: 'codeigniter', color: '#EF4A23', sortOrder: CATEGORY_ORDER.backend },
  { id: 'python', name: 'Python', category: 'backend', icon: 'python', color: '#3776AB', sortOrder: CATEGORY_ORDER.backend },
  { id: 'expressjs', name: 'Express.js', category: 'backend', icon: 'expressjs', color: '#000000', sortOrder: CATEGORY_ORDER.backend },
  { id: 'golang', name: 'Golang', category: 'backend', icon: 'go', color: '#00ADD8', sortOrder: CATEGORY_ORDER.backend },
  // Database
  { id: 'mysql', name: 'MySQL', category: 'database', icon: 'mysql', color: '#4479A1', sortOrder: CATEGORY_ORDER.database },
  { id: 'postgresql', name: 'PostgreSQL', category: 'database', icon: 'postgresql', color: '#4169E1', sortOrder: CATEGORY_ORDER.database },
  { id: 'prisma', name: 'Prisma', category: 'database', icon: 'prisma', color: '#2D3748', sortOrder: CATEGORY_ORDER.database },
  // Tools
  { id: 'bun', name: 'Bun', category: 'tools', icon: 'bun', color: '#FBF0DF', sortOrder: CATEGORY_ORDER.tools },
  { id: 'npm', name: 'NPM', category: 'tools', icon: 'npm', color: '#CB3837', sortOrder: CATEGORY_ORDER.tools },
  { id: 'github', name: 'GitHub', category: 'tools', icon: 'github', color: '#181717', sortOrder: CATEGORY_ORDER.tools },
  { id: 'gitlab', name: 'GitLab', category: 'tools', icon: 'gitlab', color: '#FC6D26', sortOrder: CATEGORY_ORDER.tools },
  { id: 'figma', name: 'Figma', category: 'tools', icon: 'figma', color: '#F24E1E', sortOrder: CATEGORY_ORDER.tools },
  { id: 'github-actions', name: 'GitHub Actions', category: 'tools', icon: 'github-actions', color: '#2088FF', sortOrder: CATEGORY_ORDER.tools },
  { id: 'google-colaboratory', name: 'Google Colaboratory', category: 'tools', icon: 'google-colaboratory', color: '#F9AB00', sortOrder: CATEGORY_ORDER.tools },
  { id: 'pusher', name: 'Pusher', category: 'tools', icon: 'pusher', color: '#C6214D', sortOrder: CATEGORY_ORDER.tools },
  { id: 'umami', name: 'Umami', category: 'tools', icon: 'umami', color: '#000000', sortOrder: CATEGORY_ORDER.tools },
  { id: 'google-analytics', name: 'Google Analytics', category: 'tools', icon: 'googleanalytics', color: '#E37400', sortOrder: CATEGORY_ORDER.tools },
  { id: 'google-tag-manager', name: 'Google Tag Manager', category: 'tools', icon: 'googletagmanager', color: '#246FDB', sortOrder: CATEGORY_ORDER.tools },
  { id: 'google-search-console', name: 'Google Search Console', category: 'tools', icon: 'googlesearchconsole', color: '#4285F4', sortOrder: CATEGORY_ORDER.tools },
]

// Quick lookup: skillId -> skill object (used by projects, stats, etc.)
export const skillById = Object.fromEntries(skills.map((skill) => [skill.id, skill]))
