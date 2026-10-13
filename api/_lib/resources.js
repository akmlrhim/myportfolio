// Resource registry for the generic admin CRUD endpoint.
// Each entry: table, primary key column, writable columns, optional jsonb
// columns, default order, and whether rows are singleton (id = 1).

export const RESOURCES = {
  profile: {
    table: 'profile',
    pk: 'id',
    singleton: true,
    fields: ['name', 'location', 'verified', 'open_to_work'],
    booleans: ['verified', 'open_to_work'],
    order: 'id',
  },
  'skill-categories': {
    table: 'skill_categories',
    pk: 'id',
    fields: ['id', 'label_key', 'position'],
    numbers: ['position'],
    order: 'position',
  },
  skills: {
    table: 'skills',
    pk: 'id',
    fields: ['id', 'name', 'category', 'main', 'icon', 'color', 'sort_order'],
    booleans: ['main'],
    numbers: ['sort_order'],
    order: 'sort_order, name',
  },
  'project-categories': {
    table: 'project_categories',
    pk: 'id',
    fields: ['id', 'label_key', 'position'],
    numbers: ['position'],
    order: 'position',
  },
  projects: {
    table: 'projects',
    pk: 'slug',
    fields: [
      'slug',
      'category',
      'image',
      'image_width',
      'image_height',
      'live_url',
      'repo_url',
      'title_en',
      'title_id',
      'position',
    ],
    numbers: ['image_width', 'image_height', 'position'],
    nullable: ['repo_url'],
    order: 'position',
    // Projects own an ordered stack of free-form tech labels.
    child: { table: 'project_stack', fk: 'project_slug', column: 'label', field: 'stack' },
  },
  timeline: {
    table: 'timeline_entries',
    pk: 'id',
    generatedPk: true,
    fields: [
      'kind',
      'logo',
      'position',
      'title_en',
      'subtitle_en',
      'period_en',
      'points_en',
      'title_id',
      'subtitle_id',
      'period_id',
      'points_id',
    ],
    numbers: ['position'],
    jsonb: ['points_en', 'points_id'],
    order: 'kind, position',
  },
  'contact-channels': {
    table: 'contact_channels',
    pk: 'id',
    fields: ['id', 'href', 'position'],
    numbers: ['position'],
    order: 'position',
  },
  'site-config': {
    table: 'site_config',
    pk: 'key',
    fields: ['key', 'value'],
    order: 'key',
  },
  'content-blocks': {
    table: 'content_blocks',
    pk: 'id',
    generatedPk: true,
    conflictOn: ['key', 'lang', 'position'],
    fields: ['key', 'lang', 'position', 'value'],
    numbers: ['position'],
    order: 'key, lang, position',
  },
}

export function findResource(name) {
  return RESOURCES[name] || null
}
