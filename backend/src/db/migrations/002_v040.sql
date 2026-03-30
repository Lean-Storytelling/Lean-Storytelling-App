-- Lean Storytelling v0.4.0 — Extension, Delivery, Feedback tables

-- Enums (safe to run multiple times via DO blocks)
DO $$ BEGIN
  CREATE TYPE extension_element_type AS ENUM (
    'challenge',
    'data',
    'quote',
    'alternative',
    'fail',
    'call_to_action'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE extension_anchor AS ENUM (
    'before_context',
    'after_context',
    'after_target',
    'after_empathy',
    'after_problem',
    'after_consequences',
    'after_solution',
    'after_benefits',
    'after_why'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE delivery_format AS ENUM (
    'text',
    'slides',
    'live'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- story_extensions: extension elements added to a story version
CREATE TABLE IF NOT EXISTS story_extensions (
  id                UUID                   PRIMARY KEY DEFAULT gen_random_uuid(),
  story_version_id  UUID                   NOT NULL REFERENCES story_versions(id) ON DELETE CASCADE,
  element_type      extension_element_type NOT NULL,
  content           TEXT,
  anchor            extension_anchor       NOT NULL DEFAULT 'after_why',
  sort_order        INTEGER                NOT NULL DEFAULT 1,
  created_at        TIMESTAMPTZ            NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ            NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_story_extensions_version ON story_extensions(story_version_id);

-- story_deliveries: delivery plans for a story version
CREATE TABLE IF NOT EXISTS story_deliveries (
  id                UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
  story_version_id  UUID             NOT NULL REFERENCES story_versions(id) ON DELETE CASCADE,
  audience          TEXT,
  context           TEXT,
  format            delivery_format,
  created_at        TIMESTAMPTZ      NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ      NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_story_deliveries_version ON story_deliveries(story_version_id);

-- story_feedbacks: post-delivery reflections for a story version
CREATE TABLE IF NOT EXISTS story_feedbacks (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  story_version_id  UUID        NOT NULL REFERENCES story_versions(id) ON DELETE CASCADE,
  third_party       TEXT,
  self_impression   TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_story_feedbacks_version ON story_feedbacks(story_version_id);
