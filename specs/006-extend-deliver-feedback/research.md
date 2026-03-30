# Research: v0.4.0 — App Shell + Extend, Deliver, Feedback

## Drag-and-drop in the placement widget

**Decision**: Use the native HTML5 Drag and Drop API (`draggable`, `dragstart`, `dragover`, `drop`, `dragend` events).

**Rationale**: The constitution mandates zero runtime dependencies. No library (SortableJS, dnd-kit, etc.) may be added. The native API is sufficient for a linear ordered list of chips. Touch devices are desktop-only in scope (mobile is out of scope), so touch-drag limitations do not apply.

**Alternatives considered**:
- SortableJS / dnd-kit: Would require a new dependency — rejected per constitution Principle I.
- CSS-only reorder: Not feasible for arbitrary reordering across anchor points.

---

## Auto-save pattern for new entities

**Decision**: Reuse the existing `auto-save.js` module pattern. Each new section (extend, deliver, feedback) registers its own debounced save function using the same 2-second debounce and offline queue logic. Immediate saves (placement, format selection) call the PATCH endpoint directly without debouncing.

**Rationale**: The auto-save pattern is already tested and proven in Build Story. Reusing it avoids duplicating logic and keeps the codebase maintainable (Principle IV).

**Alternatives considered**:
- Separate auto-save module per section: Rejected — unnecessary duplication.
- Single shared auto-save instance: Current approach — already used by Build Story.

---

## Shared Story + Version Selector component

**Decision**: Extract a reusable vanilla JS function `renderStoryVersionSelector(containerId, onSelect)` that renders a story dropdown + version dropdown, populates them from `/api/stories`, and calls a callback with `{ storyId, versionId }` on change. Placed in a new `story-selector.js` file.

**Rationale**: The selector appears identically in Extend, Deliver, and Feedback. A shared JS module avoids duplication and ensures all three sections behave consistently.

**Alternatives considered**:
- Copy-paste per section: Rejected — violates Principle IV (readability/maintainability).
- Web Components: Overkill for a static Vanilla JS app; not aligned with zero-dependency principle.

---

## Shared Story Preview component

**Decision**: Extract the existing right-pane preview rendering logic from `app.js` into a shared `renderStoryPreview(containerId, versionData)` function, placed in a new `story-preview.js` file.

**Rationale**: The preview currently only exists in Build Story's right pane. Extend, Deliver, and Feedback all need the same read-only preview. Extraction avoids duplication.

**Alternatives considered**:
- Inline HTML in each new section file: Rejected — three copies of the same logic.

---

## DB migration strategy

**Decision**: Add a single new migration file `backend/src/db/migrations/002_v040.sql`. Create three new tables (`story_extensions`, `story_deliveries`, `story_feedbacks`) and two new enum types (`extension_element_type`, `extension_anchor`, `delivery_format`).

**Rationale**: The existing migration runner (`migrate.js`) applies all `.sql` files in order. A separate numbered file follows the established pattern.

**Alternatives considered**:
- Alter existing migration: Rejected — would break idempotent replay on fresh installs.

---

## App shell refactor strategy

**Decision**: Refactor `frontend/index.html` to introduce a two-column layout: a `<nav class="sidebar">` on the left and a `<main class="main-canvas">` on the right. The existing Build Story content moves into `<section id="section-build">`. Three new `<section>` elements are added for Extend, Deliver, and Feedback. Only the active section is visible at a time (CSS `display: none` / `display: block`).

**Rationale**: Preserves the existing Build Story markup unchanged. The section-switching is pure JS (toggle a `data-active-section` attribute on `<body>` and CSS rules handle visibility). No router library needed.

**Alternatives considered**:
- Full SPA router: Overkill for 4 sections; violates zero-dependency constraint.
- Separate HTML pages: Would lose the shared auth state and auto-save queue.

---

## Navigation rail implementation

**Decision**: The sidebar has two visual states controlled by a CSS class on `<nav class="sidebar">`:
- `.sidebar--expanded`: full width, shows text labels, My Stories accordion
- `.sidebar--collapsed` (rail mode): narrow width, shows only icons + tooltips, hides My Stories; a "Stories" icon at the bottom expands to full sidebar

Toggle state is persisted in `localStorage` so the preference survives page reload.

**Rationale**: Pure CSS + minimal JS, no new library. `localStorage` persists across sessions without a server round-trip.

**Alternatives considered**:
- sessionStorage: Cleared on tab close — worse UX.
- No persistence: User must re-toggle every session — rejected.

---

## Ownership validation on new endpoints

**Decision**: All new routes validate ownership by joining through `story_versions` → `stories` → `users`. The pattern mirrors the existing `versions.js` route where `story_id` is validated against the authenticated user's stories before any write.

**Rationale**: Consistent with the existing security model. No new auth mechanism needed.

---

## element_type enum naming

**Decision**: DB enum values use snake_case matching the UI card names: `challenge`, `data`, `quote`, `alternative`, `fail`, `call_to_action`.

**Rationale**: "Opening Challenge" was renamed to "Challenge" in the UI (per user edit to spec). The DB enum reflects the final UI label, not the original Extension Pack term.
