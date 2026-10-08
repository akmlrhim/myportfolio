export const skillCategories = [
  { id: 'all', labelKey: 'all' },
  { id: 'main', labelKey: 'main' },
  { id: 'frontend', labelKey: 'frontend' },
  { id: 'backend', labelKey: 'backend' },
  { id: 'database', labelKey: 'database' },
  { id: 'tools', labelKey: 'tools' },
]

export const skills = [
  // Frontend (3)
  {
    id: 'javascript',
    name: 'JavaScript',
    category: 'frontend',
    main: true,
    icon: 'javascript',
    color: '#F7DF1E',
  },
  { id: 'reactjs', name: 'React.js', category: 'frontend', icon: 'react', color: '#61DAFB' },
  { id: 'vuejs', name: 'Vue.js', category: 'frontend', main: true, icon: 'vuejs', color: '#4FC08D' },
  // Backend (4)
  {
    id: 'laravel',
    name: 'Laravel',
    category: 'backend',
    main: true,
    icon: 'laravel',
    color: '#FF2D20',
  },
  { id: 'php', name: 'PHP', category: 'backend', main: true, icon: 'php', color: '#777BB4' },
  { id: 'codeigniter', name: 'CodeIgniter', category: 'backend', icon: 'codeigniter', color: '#EF4A23' },
  { id: 'python', name: 'Python', category: 'backend', icon: 'python', color: '#3776AB' },
  // Database (2)
  { id: 'mysql', name: 'MySQL', category: 'database', icon: 'mysql', color: '#4479A1' },
  { id: 'postgresql', name: 'PostgreSQL', category: 'database', icon: 'postgresql', color: '#4169E1' },
  // Tools (5)
  { id: 'bun', name: 'Bun', category: 'tools', icon: 'bun', color: '#FBF0DF' },
  { id: 'npm', name: 'NPM', category: 'tools', icon: 'npm', color: '#CB3837' },
  { id: 'github', name: 'GitHub', category: 'tools', icon: 'github', color: '#181717' },
  { id: 'gitlab', name: 'GitLab', category: 'tools', icon: 'gitlab', color: '#FC6D26' },
  { id: 'figma', name: 'Figma', category: 'tools', icon: 'figma', color: '#F24E1E' },
  { id: 'github-actions', name: 'GitHub Actions', category: 'tools', icon: 'github-actions', color: '#2088FF' },
  { id: 'google-colaboratory', name: 'Google Colaboratory', category: 'tools', icon: 'google-colaboratory', color: '#F9AB00' },
  { id: 'laragon', name: 'Laragon', category: 'tools', icon: 'laragon', color: '#0E83CD' },
  { id: 'prisma', name: 'Prisma', category: 'database', icon: 'prisma', color: '#2D3748' },
  { id: 'expressjs', name: 'Express.js', category: 'backend', icon: 'expressjs', color: '#000000' },
  { id: 'golang', name: 'Golang', category: 'backend', icon: 'go', color: '#00ADD8' },
]
