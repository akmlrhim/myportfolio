// Field descriptor for the generic admin CRUD UI.
// Each resource matches the server-side registry in api/_lib/resources.js.

import { useAppStore } from '@/stores/app'

export const ADMIN_RESOURCES = [
  {
    key: 'profile',
    label: 'Profile',
    singleton: true,
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'verified', label: 'Verified', type: 'checkbox' },
      { key: 'open_to_work', label: 'Open to Work', type: 'checkbox' },
    ],
  },
  {
    key: 'skill-categories',
    label: 'Skill Categories',
    fields: [
      { key: 'id', label: 'ID', type: 'pk', required: true },
      { key: 'label_key', label: 'Label Key', type: 'text', required: true },
      { key: 'position', label: 'Position', type: 'number' },
    ],
  },
  {
    key: 'skills',
    label: 'Skills',
    fields: [
      { key: 'id', label: 'ID', type: 'pk', required: true },
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'category', label: 'Category', type: 'select',
        options: () => (useAppStore().skillCategories || []).map((c) => ({ value: c.id, label: c.label_key })) },
      { key: 'main', label: 'Main', type: 'checkbox' },
      { key: 'icon', label: 'Icon', type: 'text' },
      { key: 'color', label: 'Color', type: 'text' },
      { key: 'sort_order', label: 'Sort Order', type: 'number' },
    ],
  },
  {
    key: 'project-categories',
    label: 'Project Categories',
    fields: [
      { key: 'id', label: 'ID', type: 'pk', required: true },
      { key: 'label_key', label: 'Label Key', type: 'text', required: true },
      { key: 'position', label: 'Position', type: 'number' },
    ],
  },
  {
    key: 'projects',
    label: 'Projects',
    hasChild: true,
    fields: [
      { key: 'slug', label: 'Slug', type: 'pk', required: true },
      { key: 'category', label: 'Category', type: 'select',
        options: () => (useAppStore().projectCategories || []).filter((c) => c.id !== 'all').map((c) => ({ value: c.id, label: c.label_key })) },
      { key: 'image', label: 'Image Path', type: 'text' },
      { key: 'image_width', label: 'Image Width', type: 'number' },
      { key: 'image_height', label: 'Image Height', type: 'number' },
      { key: 'live_url', label: 'Live URL', type: 'text' },
      { key: 'repo_url', label: 'Repo URL', type: 'text', nullable: true },
      { key: 'title_en', label: 'Title (EN)', type: 'text', required: true },
      { key: 'title_id', label: 'Title (ID)', type: 'text', required: true },
      { key: 'position', label: 'Position', type: 'number' },
      { key: 'stack', label: 'Stack Labels', type: 'list', childField: true },
    ],
  },
  {
    key: 'timeline',
    label: 'Timeline',
    fields: [
      { key: 'kind', label: 'Kind', type: 'select', required: true, options: [{ value: 'education', label: 'Education' }, { value: 'experience', label: 'Experience' }] },
      { key: 'logo', label: 'Logo Path', type: 'text' },
      { key: 'position', label: 'Position', type: 'number' },
      { key: 'title_en', label: 'Title (EN)', type: 'text', required: true },
      { key: 'subtitle_en', label: 'Subtitle (EN)', type: 'text' },
      { key: 'period_en', label: 'Period (EN)', type: 'text' },
      { key: 'points_en', label: 'Points (EN)', type: 'list', required: true },
      { key: 'title_id', label: 'Title (ID)', type: 'text', required: true },
      { key: 'subtitle_id', label: 'Subtitle (ID)', type: 'text' },
      { key: 'period_id', label: 'Period (ID)', type: 'text' },
      { key: 'points_id', label: 'Points (ID)', type: 'list', required: true },
    ],
  },
  {
    key: 'contact-channels',
    label: 'Contact Channels',
    fields: [
      { key: 'id', label: 'ID', type: 'pk', required: true },
      { key: 'href', label: 'URL', type: 'text', required: true },
      { key: 'position', label: 'Position', type: 'number' },
    ],
  },
  {
    key: 'site-config',
    label: 'Site Config',
    fields: [
      { key: 'key', label: 'Key', type: 'pk', required: true },
      { key: 'value', label: 'Value', type: 'textarea' },
    ],
  },
  {
    key: 'content-blocks',
    label: 'Content Blocks',
    fields: [
      { key: 'key', label: 'Key', type: 'text', required: true },
      { key: 'lang', label: 'Language', type: 'select',
        options: [{ value: 'en', label: 'English' }, { value: 'id', label: 'Indonesian' }], required: true },
      { key: 'position', label: 'Position', type: 'number' },
      { key: 'value', label: 'Value', type: 'textarea', required: true },
    ],
  },
]

export function resourceByKey(key) {
  return ADMIN_RESOURCES.find((r) => r.key === key) || null
}
