// Seed database from static data files.
// Usage: node --env-file=.env db/seed.mjs

import { readFileSync } from 'node:fs'
import pg from 'pg'

const { Pool } = pg

// Import static data (ESM works because package type: module).
import { profile } from '../src/data/profile.js'
import { skillCategories, skills } from '../src/data/skills.js'
import { projectCategories, projects } from '../src/data/projects.js'
import { education, experience } from '../src/data/about.js'
import { contactChannels } from '../src/data/social.js'
import { statsConfig } from '../src/data/stats.js'
import i18nEn from '../src/data/i18n/en.js'
import i18nId from '../src/data/i18n/id.js'

const POOL_CONNECTION = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL

if (!POOL_CONNECTION) {
  console.error('No DATABASE_URL or DATABASE_URL_UNPOOLED in .env')
  process.exit(1)
}

const pool = new Pool({ connectionString: POOL_CONNECTION })

async function seed() {
  const sql = readFileSync(new URL('./schema.sql', import.meta.url), 'utf8')

  await pool.query(sql)
  console.log('  schema applied')

  // Clear existing data in correct order (FK dependencies).
  await pool.query('DELETE FROM project_stack')
  await pool.query('DELETE FROM projects')
  await pool.query('DELETE FROM skills')
  await pool.query('DELETE FROM skill_categories')
  await pool.query('DELETE FROM timeline_entries')
  await pool.query('DELETE FROM contact_channels')
  await pool.query('DELETE FROM site_config')
  await pool.query('DELETE FROM content_blocks')
  await pool.query('DELETE FROM profile')

  // 1. Profile
  await pool.query(
    `INSERT INTO profile (id, name, location, verified, open_to_work) VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (id) DO NOTHING`,
    [1, profile.name, profile.location, profile.verified, profile.openToWork],
  )
  console.log('  profile seeded')

  // 2. Skill categories
  for (const cat of skillCategories) {
    await pool.query(
      `INSERT INTO skill_categories (id, label_key, position) VALUES ($1, $2, $3)
       ON CONFLICT (id) DO UPDATE SET label_key = EXCLUDED.label_key, position = EXCLUDED.position`,
      [
        cat.id,
        cat.labelKey,
        { all: 0, main: 1, frontend: 2, backend: 3, database: 4, tools: 5 }[cat.id] ?? 99,
      ],
    )
  }
  console.log(`  ${skillCategories.length} skill_categories seeded`)

  // 3. Skills
  for (const skill of skills) {
    await pool.query(
      `INSERT INTO skills (id, name, category, main, icon, color, sort_order) VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, main = EXCLUDED.main, icon = EXCLUDED.icon, color = EXCLUDED.color, sort_order = EXCLUDED.sort_order`,
      [
        skill.id,
        skill.name,
        skill.category,
        skill.main || false,
        skill.icon,
        skill.color,
        skill.sortOrder ?? 0,
      ],
    )
  }
  console.log(`  ${skills.length} skills seeded`)

  // 4. Project categories
  for (const cat of projectCategories) {
    await pool.query(
      `INSERT INTO project_categories (id, label_key, position) VALUES ($1, $2, $3)
       ON CONFLICT (id) DO UPDATE SET label_key = EXCLUDED.label_key, position = EXCLUDED.position`,
      [
        cat.id,
        cat.labelKey,
        { all: 0, 'web-app': 1, 'company-profile': 2, internal: 3, experiment: 4 }[cat.id] ?? 99,
      ],
    )
  }
  console.log(`  ${projectCategories.length} project_categories seeded`)

  // 5. Projects + stack
  for (let i = 0; i < projects.length; i++) {
    const p = projects[i]
    await pool.query(
      `INSERT INTO projects (slug, category, image, image_width, image_height, live_url, repo_url, title_en, title_id, position)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (slug) DO UPDATE SET category = EXCLUDED.category, image = EXCLUDED.image, image_width = EXCLUDED.image_width, image_height = EXCLUDED.image_height, live_url = EXCLUDED.live_url, repo_url = EXCLUDED.repo_url, title_en = EXCLUDED.title_en, title_id = EXCLUDED.title_id, position = EXCLUDED.position`,
      [
        p.slug,
        p.category,
        p.image || '',
        p.imageSize?.width || null,
        p.imageSize?.height || null,
        p.links?.live || '',
        p.links?.repo || null,
        p.en.title,
        p.id.title,
        i,
      ],
    )
    // Stack
    if (p.stack?.length) {
      for (let j = 0; j < p.stack.length; j++) {
        await pool.query(
          `INSERT INTO project_stack (project_slug, position, label) VALUES ($1, $2, $3)
           ON CONFLICT (project_slug, position) DO UPDATE SET label = EXCLUDED.label`,
          [p.slug, j, p.stack[j]],
        )
      }
    }
  }
  console.log(
    `  ${projects.length} projects seeded (${projects.reduce((a, p) => a + (p.stack?.length || 0), 0)} stack rows)`,
  )

  // 6. Timeline entries
  const eduItems = education.map((e) => ({ kind: 'education', ...e }))
  const expItems = experience.map((e) => ({ kind: 'experience', ...e }))
  const allTimeline = [...eduItems, ...expItems]
  for (const entry of allTimeline) {
    await pool.query(
      `INSERT INTO timeline_entries (kind, logo, position, title_en, subtitle_en, period_en, points_en, title_id, subtitle_id, period_id, points_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        entry.kind,
        entry.logo || '',
        0,
        entry.en.title,
        entry.en.subtitle,
        entry.en.period,
        JSON.stringify(entry.en.points),
        entry.id.title,
        entry.id.subtitle,
        entry.id.period,
        JSON.stringify(entry.id.points),
      ],
    )
  }
  console.log(`  ${allTimeline.length} timeline entries seeded`)

  // 7. Contact channels
  for (let i = 0; i < contactChannels.length; i++) {
    const ch = contactChannels[i]
    await pool.query(
      `INSERT INTO contact_channels (id, href, position) VALUES ($1, $2, $3)
       ON CONFLICT (id) DO UPDATE SET href = EXCLUDED.href, position = EXCLUDED.position`,
      [ch.id, ch.href, i],
    )
  }
  console.log(`  ${contactChannels.length} contact_channels seeded`)

  // 8. Site config
  const configEntries = [
    ['github_user', statsConfig.githubUser || ''],
    ['wakatime_share_url', statsConfig.wakatimeShareUrl || ''],
  ]
  for (const [key, value] of configEntries) {
    await pool.query(
      `INSERT INTO site_config (key, value) VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
      [key, value],
    )
  }
  console.log(`  ${configEntries.length} site_config keys seeded`)

  // 9. Content blocks (hero, bio, contact card copy)
  const blocks = []

  // Hero text
  blocks.push({ key: 'hero.greeting', lang: 'en', position: 0, value: i18nEn.hero.greeting })
  blocks.push({ key: 'hero.greeting', lang: 'id', position: 0, value: i18nId.hero.greeting })
  blocks.push({ key: 'hero.based', lang: 'en', position: 0, value: i18nEn.hero.based })
  blocks.push({ key: 'hero.based', lang: 'id', position: 0, value: i18nId.hero.based })
  blocks.push({ key: 'hero.summary', lang: 'en', position: 0, value: i18nEn.hero.summary })
  blocks.push({ key: 'hero.summary', lang: 'id', position: 0, value: i18nId.hero.summary })
  blocks.push({ key: 'hero.skills', lang: 'en', position: 0, value: i18nEn.hero.skills })
  blocks.push({ key: 'hero.skills', lang: 'id', position: 0, value: i18nId.hero.skills })

  // About bio (3 paragraphs)
  for (let i = 0; i < i18nEn.about.bio.length; i++) {
    blocks.push({ key: 'about.bio', lang: 'en', position: i, value: i18nEn.about.bio[i] })
    blocks.push({ key: 'about.bio', lang: 'id', position: i, value: i18nId.about.bio[i] })
  }

  // Contact card copy
  for (const ch of ['gmail', 'linkedin', 'github', 'cv']) {
    const enCard = i18nEn.contactCards[ch]
    const idCard = i18nId.contactCards[ch]
    for (const field of ['title', 'desc', 'cta']) {
      blocks.push({
        key: `contactCards.${ch}.${field}`,
        lang: 'en',
        position: 0,
        value: enCard?.[field] ?? '',
      })
      blocks.push({
        key: `contactCards.${ch}.${field}`,
        lang: 'id',
        position: 0,
        value: idCard?.[field] ?? '',
      })
    }
  }

  for (const b of blocks) {
    try {
      await pool.query(
        `INSERT INTO content_blocks (key, lang, position, value) VALUES ($1, $2, $3, $4)
         ON CONFLICT (key, lang, position) DO UPDATE SET value = EXCLUDED.value`,
        [b.key, b.lang, b.position, b.value],
      )
    } catch (err) {
      console.error(
        `  content_block insert failed: ${b.key} (${b.lang} pos ${b.position}): ${err.message}`,
      )
    }
  }
  console.log(`  ${blocks.length} content_blocks seeded`)

  console.log('\nSeed complete.')
}

seed()
  .catch((err) => {
    console.error('Seed failed:', err)
    process.exit(1)
  })
  .finally(async () => {
    await pool.end()
  })
