export const projectCategories = [
  { id: 'all', labelKey: 'all' },
  { id: 'web-app', labelKey: 'web' },
  { id: 'company-profile', labelKey: 'company' },
  { id: 'internal', labelKey: 'internal' },
  { id: 'experiment', labelKey: 'experiment' },
]

export const projects = [
  {
    slug: 'ms-construction',
    category: 'company-profile',
    stack: ['reactjs', 'tailwindcss', 'framermotion'],
    links: { live: 'https://www.msconstructione.com/', repo: null },
    en: { title: 'MS Construction' },
    id: { title: 'MS Construction' },
  },

  {
    slug: 'morarep',
    category: 'company-profile',
    stack: [
      'gsap',
      'inertiajs',
      'laravel',
      'mysql',
      'reactjs',
      'tailwindcss',
      'typescript',
      'framermotion',
    ],
    links: { live: 'https://www.morarepublicindonesia.com', repo: null },
    en: { title: 'MoraRepublic (KALSEL)' },
    id: { title: 'MoraRepublic (KALSEL)' },
  },

  {
    slug: 'attacargo',
    category: 'company-profile',
    stack: [
      'filament',
      'gsap',
      'inertiajs',
      'laravel',
      'mysql',
      'reactjs',
      'tailwindcss',
      'typescript',
    ],
    links: { live: 'https://www.attacargo.id', repo: null },
    en: { title: 'Atta Cargo' },
    id: { title: 'Atta Cargo' },
  },

  {
    slug: 'kusuma-jp',
    category: 'company-profile',
    stack: [
      'filament',
      'gsap',
      'inertiajs',
      'laravel',
      'mysql',
      'reactjs',
      'tailwindcss',
      'typescript',
    ],
    links: { live: 'https://www.kusumajp.co.id', repo: null },
    en: { title: 'Kusuma Jayaindo Perkasa' },
    id: { title: 'Kusuma Jayaindo Perkasa' },
  },

  {
    slug: 'impost-media',
    category: 'company-profile',
    stack: ['filament', 'gsap', 'inertiajs', 'laravel', 'mysql', 'reactjs', 'tailwindcss'],
    links: { live: 'https://www.impostmedia.com', repo: null },
    en: { title: 'Impost Media Indonesia' },
    id: { title: 'Impost Media Indonesia' },
  },

  {
    slug: 'villa-tebing-buluh',
    category: 'company-profile',
    stack: ['vuejs', 'tailwindcss', 'mysql', 'express.js'],
    links: { live: 'https://www.villatebingbuluh.com', repo: null },
    en: { title: 'Villa Tebing Buluh' },
    id: { title: 'Villa Tebing Buluh' },
  },

  {
    slug: 'hris-im',
    category: 'web-app',
    stack: ['livewire', 'laravel', 'mysql', 'tailwindcss'],
    links: { live: 'https://www.hris.impostmedia.com', repo: null },
    en: { title: 'HRIS Impost Media' },
    id: { title: 'HRIS Impost Media' },
  },

  {
    slug: 'wspace-im',
    category: 'web-app',
    stack: [
      'livewire',
      'inertiajs',
      'laravel',
      'mysql',
      'tailwindcss',
      'fluxui',
      'typescript',
      'pusher',
    ],
    links: { live: 'https://www.workspace.impostmedia.com', repo: null },
    en: { title: 'Workspace Impost Media' },
    id: { title: 'Workspace Impost Media' },
  },

  {
    slug: 'ops-im',
    category: 'web-app',
    stack: ['inertiajs', 'laravel', 'mysql', 'tailwindcss', 'shadcn/ui', 'typescript', 'pusher'],
    links: { live: 'https://www.ops.impostmedia.com', repo: null },
    en: { title: 'Operation Impost Media' },
    id: { title: 'Operation Impost Media' },
  },
]
