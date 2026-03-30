# API Contracts: v0.4.0 — Extend, Deliver, Feedback

**Base URL**: `/api`
**Auth**: httpOnly cookie `ls_session` (JWT). All routes below require 🔒 authentication.
**Ownership rule**: All routes validate that the target `story_version_id` belongs to the authenticated user (join: story_extensions/deliveries/feedbacks → story_versions → stories → users.id).

Existing endpoints (auth, users, stories, versions) are unchanged — see `specs/003-v03-public-app/contracts/api.md`.

---

## Extensions

### List extensions for a version

`GET /api/stories/:storyId/versions/:versionId/extensions` 🔒

Returns all extension elements for a story version, ordered by `(anchor, sort_order)`.

**Response 200:**
```json
[
  {
    "id": "uuid",
    "story_version_id": "uuid",
    "element_type": "quote",
    "content": "The best way to predict the future is to invent it.",
    "anchor": "after_problem",
    "sort_order": 1,
    "created_at": "ISO8601",
    "updated_at": "ISO8601"
  }
]
```

**Errors:** 401 (unauthenticated), 403 (wrong user), 404 (story/version not found)

---

### Create an extension

`POST /api/stories/:storyId/versions/:versionId/extensions` 🔒

**Request body:**
```json
{
  "element_type": "quote",
  "content": "",
  "anchor": "after_why",
  "sort_order": 1
}
```

- `element_type`: required, enum (`challenge`, `data`, `quote`, `alternative`, `fail`, `call_to_action`)
- `content`: optional text
- `anchor`: optional, defaults to `after_why`
- `sort_order`: optional, defaults to `MAX(sort_order) + 1` at the given anchor

**Response 201:**
```json
{ "id": "uuid", "element_type": "quote", "content": "", "anchor": "after_why", "sort_order": 1, "created_at": "ISO8601", "updated_at": "ISO8601" }
```

**Errors:** 400 (invalid element_type), 401, 403, 404

---

### Update an extension (content and/or position)

`PATCH /api/extensions/:extensionId` 🔒

Used for both auto-save of content (debounced 2 s) and immediate placement saves.

**Request body (all fields optional):**
```json
{
  "content": "Updated quote text",
  "anchor": "after_solution",
  "sort_order": 2
}
```

**Response 200:**
```json
{ "id": "uuid", "content": "Updated quote text", "anchor": "after_solution", "sort_order": 2, "updated_at": "ISO8601" }
```

**Errors:** 400 (invalid anchor/sort_order), 401, 403, 404

---

### Delete an extension

`DELETE /api/extensions/:extensionId` 🔒

**Response 204:** No content.

**Errors:** 401, 403, 404

---

## Deliveries

### List deliveries for a version

`GET /api/stories/:storyId/versions/:versionId/deliveries` 🔒

**Response 200:**
```json
[
  {
    "id": "uuid",
    "story_version_id": "uuid",
    "audience": "Product managers, senior level, familiar with the domain",
    "context": "30-min weekly sync, 5 people, high energy",
    "format": "slides",
    "created_at": "ISO8601",
    "updated_at": "ISO8601"
  }
]
```

---

### Create a delivery

`POST /api/stories/:storyId/versions/:versionId/deliveries` 🔒

**Request body:**
```json
{
  "audience": "",
  "context": "",
  "format": null
}
```

All fields optional. Creates a new delivery record for this version.

**Response 201:**
```json
{ "id": "uuid", "audience": "", "context": "", "format": null, "created_at": "ISO8601", "updated_at": "ISO8601" }
```

---

### Update a delivery

`PATCH /api/deliveries/:deliveryId` 🔒

**Request body (all fields optional):**
```json
{
  "audience": "Updated audience",
  "context": "Updated context",
  "format": "live"
}
```

- `format`: enum (`text`, `slides`, `live`) or `null` to deselect

**Response 200:**
```json
{ "id": "uuid", "audience": "...", "context": "...", "format": "live", "updated_at": "ISO8601" }
```

**Errors:** 400 (invalid format value), 401, 403, 404

---

### Delete a delivery

`DELETE /api/deliveries/:deliveryId` 🔒

**Response 204:** No content.

---

## Feedbacks

### List feedbacks for a version

`GET /api/stories/:storyId/versions/:versionId/feedbacks` 🔒

**Response 200:**
```json
[
  {
    "id": "uuid",
    "story_version_id": "uuid",
    "third_party": "The problem slide resonated well. Solution felt rushed.",
    "self_impression": "I rushed the ending. Next time I'll pause after the solution.",
    "created_at": "ISO8601",
    "updated_at": "ISO8601"
  }
]
```

---

### Create a feedback

`POST /api/stories/:storyId/versions/:versionId/feedbacks` 🔒

**Request body:**
```json
{
  "third_party": "",
  "self_impression": ""
}
```

All fields optional.

**Response 201:**
```json
{ "id": "uuid", "third_party": "", "self_impression": "", "created_at": "ISO8601", "updated_at": "ISO8601" }
```

---

### Update a feedback

`PATCH /api/feedbacks/:feedbackId` 🔒

**Request body (all fields optional):**
```json
{
  "third_party": "Updated third-party feedback",
  "self_impression": "Updated self-impression"
}
```

**Response 200:**
```json
{ "id": "uuid", "third_party": "...", "self_impression": "...", "updated_at": "ISO8601" }
```

---

### Delete a feedback

`DELETE /api/feedbacks/:feedbackId` 🔒

**Response 204:** No content.

---

## Error format (all endpoints)

```json
{
  "error": "error_code",
  "message": "Human-readable message."
}
```

Common codes: `unauthenticated`, `forbidden`, `not_found`, `validation_error`.
