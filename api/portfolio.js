// Public portfolio content endpoint.
// GET  /api/portfolio  — returns all data in the shape expected by the Vue app.

import { query, json, error, handleOptions } from './_lib/db.js'

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return handleOptions(req, res)
  if (req.method !== 'GET') return error(res, 405, 'Method not allowed')

  try {
    const [
      profileRows,
      skillCats,
      skillRows,
      projectCats,
      projectRows,
      projectStackRows,
      timelineRows,
      contactRows,
      configRows,
      blockRows,
    ] = await Promise.all([
      query('SELECT * FROM profile WHERE id = 1 LIMIT 1'),
      query('SELECT * FROM skill_categories ORDER BY position'),
      query('SELECT * FROM skills ORDER BY sort_order, name'),
      query('SELECT * FROM project_categories ORDER BY position'),
      query('SELECT * FROM projects ORDER BY position'),
      query('SELECT * FROM project_stack ORDER BY project_slug, position'),
      query('SELECT * FROM timeline_entries ORDER BY kind, position'),
      query('SELECT * FROM contact_channels ORDER BY position'),
      query('SELECT * FROM site_config ORDER BY key'),
      query('SELECT * FROM content_blocks ORDER BY key, lang, position'),
    ])

    // Build profile object (camelCase as frontend expects).
    const profileRow = profileRows.rows[0] || {}
    const profile = {
      name: profileRow.name || '',
      location: profileRow.location || '',
      verified: profileRow.verified || false,
      openToWork: profileRow.open_to_work ?? true,
    }

    // Build skills (camelCase).
    const skills = skillRows.rows.map((r) => ({
      id: r.id,
      name: r.name,
      category: r.category,
      main: r.main || false,
      icon: r.icon,
      color: r.color,
      sortOrder: r.sort_order,
    }))

    // Skill categories.
    const skillCategories = skillCats.rows.map((r) => ({ id: r.id, labelKey: r.label_key }))

    // Project categories.
    const projectCategories = projectCats.rows.map((r) => ({ id: r.id, labelKey: r.label_key }))

    // Build project stack lookup.
    const stackBySlug = {}
    for (const sr of projectStackRows.rows) {
      if (!stackBySlug[sr.project_slug]) stackBySlug[sr.project_slug] = []
      stackBySlug[sr.project_slug].push(sr.label)
    }

    // Projects.
    const projects = projectRows.rows.map((r) => ({
      slug: r.slug,
      category: r.category,
      image: r.image || '',
      imageSize: r.image_width
        ? { width: r.image_width, height: r.image_height || null }
        : null,
      stack: stackBySlug[r.slug] || [],
      links: {
        live: r.live_url || null,
        repo: r.repo_url || null,
      },
      en: { title: r.title_en },
      id: { title: r.title_id },
    }))

    // Timeline (education + experience).
    const education = []
    const experience = []
    for (const r of timelineRows.rows) {
      const item = {
        logo: r.logo || '',
        en: {
          title: r.title_en,
          subtitle: r.subtitle_en,
          period: r.period_en,
          points: Array.isArray(r.points_en) ? r.points_en : (typeof r.points_en === 'string' ? JSON.parse(r.points_en || '[]') : []),
        },
        id: {
          title: r.title_id,
          subtitle: r.subtitle_id,
          period: r.period_id,
          points: Array.isArray(r.points_id) ? r.points_id : (typeof r.points_id === 'string' ? JSON.parse(r.points_id || '[]') : []),
        },
      }
      if (r.kind === 'education') education.push(item)
      else experience.push(item)
    }

    // Contact channels.
    const contactChannels = contactRows.rows.map((r) => ({ id: r.id, href: r.href }))

    // Site config.
    const configMap = {}
    for (const r of configRows.rows) configMap[r.key] = r.value

    const statsConfig = { githubUser: configMap.github_user || '', wakatimeShareUrl: configMap.wakatime_share_url || '' }

    // Content blocks: build { en: { hero: { greeting, based, summary }, about: { bio: [] }, contactCards }, id: {} }
    const content = { en: buildContent('en', blockRows.rows), id: buildContent('id', blockRows.rows) }

    return json(res, 200, {
      profile,
      skills,
      skillCategories,
      projects,
      projectCategories,
      education,
      experience,
      contactChannels,
      statsConfig,
      content,
    })
  } catch (err) {
    console.error('Portfolio API error:', err)
    return error(res, 500, 'Failed to load portfolio data')
  }
}

function buildContent(lang, rows) {
  const filtered = rows.filter((r) => r.lang === lang)
  const result = {}

  // Group rows by dotted key first, so array detection is reliable.
  const byKey = new Map()
  for (const r of filtered) {
    if (!byKey.has(r.key)) byKey.set(r.key, [])
    byKey.get(r.key).push(r)
  }

  for (const [key, keyRows] of byKey) {
    keyRows.sort((a, b) => a.position - b.position)
    const isList = keyRows.some((r) => r.position > 0)

    let value
    if (isList) {
      value = keyRows.map((r) => r.value)
    } else {
      value = keyRows[0]?.value ?? ''
    }

    const parts = key.split('.')
    let current = result
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i]
      if (!current[part] || typeof current[part] !== 'object' || Array.isArray(current[part])) {
        current[part] = {}
      }
      current = current[part]
    }
    current[parts[parts.length - 1]] = value
  }

  return result
}
