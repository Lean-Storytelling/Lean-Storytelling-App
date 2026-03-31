# Quickstart: v0.4.0 — App Shell + Extend, Deliver, Feedback

## Prerequisites

- Docker + Docker Compose installed
- Node.js 20 LTS (for local backend dev without Docker)
- Active on branch `006-extend-deliver-feedback`

## Run locally

```bash
git checkout 006-extend-deliver-feedback
docker compose up
```

App available at http://localhost:3000

## Key files to touch

| What | Where |
|---|---|
| DB migration | `backend/src/db/migrations/002_v040.sql` |
| Extension routes | `backend/src/routes/extensions.js` (new) |
| Delivery routes | `backend/src/routes/deliveries.js` (new) |
| Feedback routes | `backend/src/routes/feedbacks.js` (new) |
| Register new routes | `backend/src/server.js` |
| App shell HTML | `frontend/index.html` |
| App shell styles | `frontend/style.css` |
| Nav/section controller | `frontend/nav.js` (new) |
| Shared story selector | `frontend/story-selector.js` (new) |
| Shared story preview | `frontend/story-preview.js` (new) |
| Extend section JS | `frontend/extend.js` (new) |
| Deliver section JS | `frontend/deliver.js` (new) |
| Feedback section JS | `frontend/feedback.js` (new) |
| Core app wiring | `frontend/app.js` (modified) |
| Sidebar | `frontend/sidebar.js` (modified) |
| Service worker cache | `frontend/service-worker.js` (add new JS files) |

## Adding the migration

1. Create `backend/src/db/migrations/002_v040.sql` with the DDL from `specs/006-extend-deliver-feedback/data-model.md`.
2. `docker compose restart backend` — migrations run automatically on startup.

## Frontend section pattern

Each new section follows this structure:

```js
// frontend/extend.js
export function initExtend() {
  // Called from app.js when user navigates to the Extend section
  // Renders story selector, preview, add-elements, placement widget, blend scaffold
}
```

All user content written to DOM via `.textContent` only (XSS rule — never `innerHTML` for user data).

## Auto-save pattern (reuse from app.js / auto-save.js)

```js
import { createAutoSave } from './auto-save.js'
const save = createAutoSave(
  (payload) => apiClient.patch(`/api/extensions/${id}`, payload),
  { debounceMs: 2000 }
)
textarea.addEventListener('input', () => save({ content: textarea.value }))
```

For immediate saves (placement, format selection):
```js
await apiClient.patch(`/api/extensions/${id}`, { anchor, sort_order })
```

## Drag-and-drop chips (placement widget)

Use native HTML5 DnD API — no library:
```js
chip.setAttribute('draggable', 'true')
chip.addEventListener('dragstart', (e) => { e.dataTransfer.setData('id', extensionId) })
dropZone.addEventListener('dragover', (e) => e.preventDefault())
dropZone.addEventListener('drop', async (e) => {
  const id = e.dataTransfer.getData('id')
  await updatePosition(id, newAnchor, newSortOrder)
})
```

## CSP note

`default-src 'self'` is enforced. Do not reference any external URL in HTML, CSS, or JS.

## Service worker

After adding new `.js` files to `frontend/`, add them to `CACHE_FILES` in `frontend/service-worker.js` so they are available offline.
