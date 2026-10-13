-- Portfolio database schema.
-- Applied by db/seed.mjs via the direct (unpooled) connection string.

-- Profile: singleton row (id is always 1).
CREATE TABLE IF NOT EXISTS profile (
  id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  name TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT '',
  verified BOOLEAN NOT NULL DEFAULT false,
  open_to_work BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Skill filter categories (all, main, frontend, backend, database, tools).
CREATE TABLE IF NOT EXISTS skill_categories (
  id TEXT PRIMARY KEY,
  label_key TEXT NOT NULL,
  position INT NOT NULL DEFAULT 0
);

-- Skills shown on the home page.
CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL REFERENCES skill_categories(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  main BOOLEAN NOT NULL DEFAULT false,
  icon TEXT NOT NULL DEFAULT '',
  color TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0
);

-- Project filter categories (all, web-app, company-profile, internal, experiment).
CREATE TABLE IF NOT EXISTS project_categories (
  id TEXT PRIMARY KEY,
  label_key TEXT NOT NULL,
  position INT NOT NULL DEFAULT 0
);

-- Portfolio projects.
CREATE TABLE IF NOT EXISTS projects (
  slug TEXT PRIMARY KEY,
  category TEXT NOT NULL REFERENCES project_categories(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  image TEXT NOT NULL DEFAULT '',
  image_width INT,
  image_height INT,
  live_url TEXT NOT NULL DEFAULT '',
  repo_url TEXT,
  title_en TEXT NOT NULL DEFAULT '',
  title_id TEXT NOT NULL DEFAULT '',
  position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ordered tech stack labels per project. Labels are free form and may not
-- match a skills.id (e.g. gsap, filament, typescript).
CREATE TABLE IF NOT EXISTS project_stack (
  project_slug TEXT NOT NULL REFERENCES projects(slug) ON UPDATE CASCADE ON DELETE CASCADE,
  position INT NOT NULL,
  label TEXT NOT NULL,
  PRIMARY KEY (project_slug, position)
);

-- Education and experience share the same shape; kind separates them.
CREATE TABLE IF NOT EXISTS timeline_entries (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  kind TEXT NOT NULL CHECK (kind IN ('education', 'experience')),
  logo TEXT NOT NULL DEFAULT '',
  position INT NOT NULL DEFAULT 0,
  title_en TEXT NOT NULL DEFAULT '',
  subtitle_en TEXT NOT NULL DEFAULT '',
  period_en TEXT NOT NULL DEFAULT '',
  points_en JSONB NOT NULL DEFAULT '[]',
  title_id TEXT NOT NULL DEFAULT '',
  subtitle_id TEXT NOT NULL DEFAULT '',
  period_id TEXT NOT NULL DEFAULT '',
  points_id JSONB NOT NULL DEFAULT '[]'
);

-- Contact channels (gmail, linkedin, github, cv).
CREATE TABLE IF NOT EXISTS contact_channels (
  id TEXT PRIMARY KEY,
  href TEXT NOT NULL DEFAULT '',
  position INT NOT NULL DEFAULT 0
);

-- Misc settings (github user, wakatime share url).
CREATE TABLE IF NOT EXISTS site_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT ''
);

-- Editable copy: hero text, bio paragraphs, contact card copy.
-- Arrays (bio) use one row per paragraph via position.
CREATE TABLE IF NOT EXISTS content_blocks (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  key TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'en' CHECK (lang IN ('en', 'id')),
  position INT NOT NULL DEFAULT 0,
  value TEXT NOT NULL DEFAULT '',
  UNIQUE (key, lang, position)
);

CREATE INDEX IF NOT EXISTS idx_skills_category ON skills (category);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects (category);
CREATE INDEX IF NOT EXISTS idx_timeline_kind ON timeline_entries (kind, position);
CREATE INDEX IF NOT EXISTS idx_content_blocks_key ON content_blocks (key, lang, position);
