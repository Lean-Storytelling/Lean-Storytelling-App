# Data Model: v0.4.0 — App Shell + Extend, Deliver, Feedback

## Existing tables (unchanged)

`users`, `stories`, `story_versions`, `magic_link_tokens` — see `specs/003-v03-public-app/data-model.md`.

---

## New tables

### story_extensions

Stores extension elements added to a story version. Each element has a type, free-form content, a position anchor within the Lean Storytelling structure, and a sort order within that anchor.

```sql
CREATE TYPE extension_element_type AS ENUM (
  'challenge',
  'data',
  'quote',
  'alternative',
  'fail',
  'call_to_action'
);

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

CREATE TABLE story_extensions (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  story_version_id  UUID        NOT NULL REFERENCES story_versions(id) ON DELETE CASCADE,
  element_type      extension_element_type NOT NULL,
  content           TEXT,
  anchor            extension_anchor NOT NULL DEFAULT 'after_why',
  sort_order        INTEGER     NOT NULL DEFAULT 1,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_story_extensions_version ON story_extensions(story_version_id);
```

**Relationships:**
- Belongs to one `story_version` (CASCADE delete)
- Multiple extensions per version allowed, including multiple of the same `element_type`

**Sort order semantics:**
- `sort_order` is scoped to `(story_version_id, anchor)` — i.e., sort order 1, 2, 3 means "first, second, third element placed at this anchor"
- When an element is moved to a new anchor, its `sort_order` is set to `MAX(sort_order) + 1` at the target anchor (appended by default; user can then reorder)
- The UI is responsible for recomputing `sort_order` values after drag-and-drop or arrow-button moves

---

### story_deliveries

Stores delivery plans for a story version. Each delivery captures the intended audience, delivery context, and chosen format.

```sql
CREATE TYPE delivery_format AS ENUM (
  'text',
  'slides',
  'live'
);

CREATE TABLE story_deliveries (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  story_version_id  UUID        NOT NULL REFERENCES story_versions(id) ON DELETE CASCADE,
  audience          TEXT,
  context           TEXT,
  format            delivery_format,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_story_deliveries_version ON story_deliveries(story_version_id);
```

**Relationships:**
- Belongs to one `story_version` (CASCADE delete)
- Multiple deliveries per version allowed (same story presented in different contexts)

**Notes:**
- `format` is nullable — the user may save audience/context before selecting a format
- `audience` and `context` are plain text; `format` is an enum toggled by card selection

---

### story_feedbacks

Stores post-delivery reflections for a story version.

```sql
CREATE TABLE story_feedbacks (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  story_version_id  UUID        NOT NULL REFERENCES story_versions(id) ON DELETE CASCADE,
  third_party       TEXT,
  self_impression   TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_story_feedbacks_version ON story_feedbacks(story_version_id);
```

**Relationships:**
- Belongs to one `story_version` (CASCADE delete)
- Multiple feedbacks per version allowed

---

## Migration file

All DDL above lives in `backend/src/db/migrations/002_v040.sql`. The existing migration runner applies files in alphabetical/numerical order; `002_` ensures it runs after `001_init.sql`.

---

## Entity relationship summary

```
users
 └── stories (user_id → users.id CASCADE)
      └── story_versions (story_id → stories.id CASCADE)
           ├── story_extensions (story_version_id → story_versions.id CASCADE)
           ├── story_deliveries (story_version_id → story_versions.id CASCADE)
           └── story_feedbacks  (story_version_id → story_versions.id CASCADE)
```
