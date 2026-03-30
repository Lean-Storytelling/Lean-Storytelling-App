# Tasks: v0.4.0 — App Shell + Extend, Deliver, Feedback

**Input**: Design documents from `/specs/006-extend-deliver-feedback/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/api.md ✅

**Tests**: Not requested — no test tasks generated.

**Organization**: Tasks grouped by user story (P1→P5) to enable independent implementation and testing.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story label (US1–US5 from spec.md)

---

## Phase 1: Setup

**Purpose**: Verify the baseline is working before any changes.

- [ ] T001 Verify the existing v0.3 app runs cleanly (`docker compose up`, open http://localhost:3000, confirm auth + Build Story + Stories sidebar all work)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: DB schema and shared UI components that US3, US4, US5 all depend on.

**⚠️ CRITICAL**: Must complete before starting US3, US4, US5. US1 and US2 can proceed in parallel with this phase.

- [x] T002 Create `backend/src/db/migrations/002_v040.sql` with the three enums (`extension_element_type`, `extension_anchor`, `delivery_format`) and three tables (`story_extensions`, `story_deliveries`, `story_feedbacks`) with indexes and CASCADE deletes — per `specs/006-extend-deliver-feedback/data-model.md`
- [ ] T003 Restart backend and confirm migration applies cleanly: `docker compose restart backend`, check logs for migration success, verify tables exist in DB
- [x] T004 [P] Create `frontend/story-selector.js` exporting `renderStoryVersionSelector(containerId, onSelectCallback)` — fetches `/api/stories`, renders story dropdown + version dropdown, defaults to most recent story/latest version, calls `onSelectCallback({ storyId, versionId })` on change; all user content via `.textContent`
- [x] T005 [P] Create `frontend/story-preview.js` exporting `renderStoryPreview(containerId, versionData)` — extracts the existing right-pane preview rendering logic from `frontend/app.js`, renders story fields in canonical delivery order (Context → Target → Empathy → Problem → Consequences → Solution → Benefits → Why), read-only; all user content via `.textContent`

**Checkpoint**: Migration applied, `story_selector.js` and `story-preview.js` exist and are importable.

---

## Phase 3: User Story 1 — Developer finds a credible repository (Priority: P1) 🎯

**Goal**: Replace all methodology/book content with developer-first files. Full GitHub community standards compliance.

**Independent Test**: Open the repository on GitHub. Community standards checklist is 100% green. No `docs/` or `book/` directories exist.

- [ ] T006 [P] [US1] Replace `COPYING` (or existing license file) with `LICENSE` containing the AGPLv3 full text
- [ ] T007 [P] [US1] Create `CODE_OF_CONDUCT.md` using the Contributor Covenant v2.1 standard template (contact email: use project maintainer email or GitHub private advisory link)
- [ ] T008 [P] [US1] Create `CONTRIBUTING.md` covering: prerequisites (Docker, Node 20), local setup (`docker compose up`), dev workflow (branch from master, PR to master), coding conventions (vanilla JS ES2020, no new deps without justification, `.textContent` for user content), commit style (conventional commits)
- [ ] T009 [P] [US1] Create `SECURITY.md` stating: do not open public issues for vulnerabilities; report via GitHub private security advisory; include link to repo's Security tab advisory form
- [ ] T010 [P] [US1] Delete `docs/` directory entirely (`git rm -r docs/`)
- [ ] T011 [P] [US1] Delete `book/` directory entirely (`git rm -r book/`)
- [ ] T012 [US1] Rewrite `README.md` with sections in order: **About** (what the app does, 3 sentences), **Methodology** (3–5 sentences summarising Lean Storytelling + link to https://github.com/Lean-Storytelling/Lean-Storytelling), **Quickstart** (`git clone` + `docker compose up` + open http://localhost:3000), **Book** (link to https://github.com/Lean-Storytelling/Lean-Storytelling-Book), **Contributing** (link to CONTRIBUTING.md), **License** (AGPLv3); tone: welcoming, professional, concise

**Checkpoint**: `git status` shows all community files present, `docs/` and `book/` gone. GitHub repo community standards shows green.

---

## Phase 4: User Story 2 — User navigates between story-building sections (Priority: P2)

**Goal**: Introduce the two-column app shell (sticky top bar + collapsible sidebar + main canvas with 4 section slots).

**Independent Test**: Open the app. Click Build, Extend, Deliver, Feedback in the sidebar — breadcrumb and main canvas update each time. Collapse sidebar to rail, click nav icons — navigation works without expanding. Click Stories icon in rail — full sidebar expands.

- [ ] T013 [US2] Refactor `frontend/index.html`: wrap existing content in a two-column layout — `<nav class="sidebar" id="sidebar">` on the left containing nav items (Build, Extend, Deliver, Feedback) + `<hr class="nav-separator">` + existing stories accordion; `<main class="main-canvas">` on the right containing existing Build Story markup inside `<section id="section-build" class="section">` + three new empty placeholder sections (`<section id="section-extend" class="section">`, `<section id="section-deliver" class="section">`, `<section id="section-feedback" class="section">`); update `<header class="app-header">` to include sidebar toggle button (left) and breadcrumb `<span class="app-breadcrumb">` (centre-left)
- [ ] T014 [US2] Add CSS to `frontend/style.css` for: two-column layout (`.app-layout`, `.sidebar`, `.main-canvas`); sidebar nav items (`.nav-item`, `.nav-item--active`); visual separator between nav and stories (`.nav-separator`); section visibility (`.section` hidden by default, `.section--active` shown); navigation rail collapsed state (`.sidebar--collapsed` — icon only, narrow width, tooltips); breadcrumb (`.app-breadcrumb`); sidebar toggle button; My Stories section distinct visual treatment below separator
- [ ] T015 [US2] Create `frontend/nav.js` exporting `initNav()`: reads `localStorage` for sidebar state; handles toggle button click (add/remove `.sidebar--collapsed`, persist in `localStorage`); handles nav item clicks (add `.nav-item--active`, show correct `.section--active`, update `.app-breadcrumb` text); handles Stories icon click in rail mode (remove `.sidebar--collapsed`); exports `navigateTo(sectionId)` for programmatic navigation
- [ ] T016 [US2] Update `frontend/sidebar.js`: add the four nav item click handlers (`Build`, `Extend`, `Deliver`, `Feedback`) above the existing stories accordion; ensure the nav items delegate to `nav.js`'s `navigateTo()`; visual separator between nav items and stories list is present in the HTML (done in T013) — no JS needed for separator
- [ ] T017 [US2] Update `frontend/app.js`: import and call `initNav()` from `nav.js`; default active section to `build` on load; ensure existing Build Story initialisation (`initBuildStory()` or equivalent) still fires when the build section is active
- [ ] T018 [US2] Update `frontend/service-worker.js`: add `nav.js` to `CACHE_FILES` array

**Checkpoint**: Four sections switchable via sidebar and rail. Breadcrumb updates. Sidebar toggle persists. Extend/Deliver/Feedback sections are empty but visible. Build Story still works.

---

## Phase 5: User Story 3 — User extends a story (Priority: P3)

**Goal**: Full Extend Story section — element cards, inline textareas, placement widget, Blend scaffold, auto-save.

**Independent Test**: Log in, select a story, add a Quote element, type content (wait 2 s), reposition it in the placement widget, reload — quote content and position persist.

- [x] T019 [US3] Create `backend/src/routes/extensions.js`: `GET /api/stories/:storyId/versions/:versionId/extensions` (list, ordered by anchor + sort_order); `POST /api/stories/:storyId/versions/:versionId/extensions` (create); `PATCH /api/extensions/:extensionId` (update content and/or anchor/sort_order); `DELETE /api/extensions/:extensionId` — all routes validate ownership (join through story_versions → stories → user_id); per `specs/006-extend-deliver-feedback/contracts/api.md`
- [x] T020 [US3] Register extensions routes in `backend/src/server.js`: `await fastify.register(extensionRoutes, { prefix: '/api' })`
- [ ] T021 [P] [US3] Create `frontend/extend.js` exporting `initExtend()`: renders the Extend Story section inside `#section-extend`; on mount: call `renderStoryVersionSelector` → on select call `loadExtendSection(storyId, versionId)`; `loadExtendSection` calls `renderStoryPreview` + fetches extensions from API + renders Add Elements + Placement Widget + Blend scaffold
- [ ] T022 [P] [US3] Implement Add Elements card grid inside `frontend/extend.js`: render 6 cards (Challenge, Data, Quote, Alternative, Fail, Call to Action) each with title + summary + goal + advice (from spec); clicking a card opens an inline `<textarea>` below it; multiple cards can be open simultaneously; "Add" triggers `POST /api/.../extensions` to create a record, returns `extensionId` stored on the textarea as `data-extension-id`; all text content via `.textContent`; advice text injected as static hardcoded strings (not user input → may use `textContent` or safe innerHTML for the card advice)
- [ ] T023 [US3] Implement placement widget inside `frontend/extend.js`: render ordered LS structure (Context · Target · Empathy · Problem · Consequences · Solution · Benefits · Why) as drop zones; render added extensions as draggable chips using `draggable="true"` + native HTML5 DnD events (`dragstart`, `dragover`, `drop`); each chip has ↑/↓ buttons; on drop or button press, compute new `anchor` + `sort_order` and call `PATCH /api/extensions/:id` immediately; re-render chip positions after each update; all chip labels via `.textContent`
- [ ] T024 [US3] Implement Blend scaffold inside `frontend/extend.js`: render "Blend to another story" heading + second `renderStoryVersionSelector` (disabled state) + four non-clickable blend type cards (Prequel-Sequel, Nested sub-story, Parallel, Flashback) + `<div class="coming-soon-overlay">Coming soon</div>` overlaid on the entire Blend section; no API calls
- [ ] T025 [US3] Wire auto-save in `frontend/extend.js`: each extension textarea uses debounced 2 s auto-save calling `PATCH /api/extensions/:id` with `{ content }` (reuse auto-save pattern from `auto-save.js`); show sync indicator ("Saving…" / "Saved" / "⚠ Not saved") per the existing pattern
- [ ] T026 [US3] Add CSS to `frontend/style.css` for: Extend section layout; element cards grid (`.element-card`, `.element-card__title`, `.element-card__advice`); inline textarea below card; placement widget drop zones and chips (`.placement-zone`, `.extension-chip`, `.chip-arrows`); Blend scaffold overlay (`.coming-soon-overlay`, `.blend-scaffold`)
- [ ] T027 [US3] Update `frontend/app.js`: import `initExtend` from `extend.js`; call `initExtend()` when user navigates to the extend section (lazy init on first visit)
- [ ] T028 [US3] Update `frontend/service-worker.js`: add `extend.js` to `CACHE_FILES`

**Checkpoint**: Add a Quote, type content, drag it to after_problem, reload — persists.

---

## Phase 6: User Story 4 — User prepares a story delivery (Priority: P4)

**Goal**: Full Deliver Story section — audience, context, format card selection, auto-save.

**Independent Test**: Log in, select a story, fill Audience and Context (wait 2 s each), select "Slides", reload — all three fields restored.

- [x] T029 [US4] Create `backend/src/routes/deliveries.js`: `GET /api/stories/:storyId/versions/:versionId/deliveries`; `POST /api/stories/:storyId/versions/:versionId/deliveries`; `PATCH /api/deliveries/:deliveryId` (audience, context, format — format nullable); `DELETE /api/deliveries/:deliveryId` — all routes validate ownership; per `specs/006-extend-deliver-feedback/contracts/api.md`
- [x] T030 [US4] Register deliveries routes in `backend/src/server.js`: `await fastify.register(deliveryRoutes, { prefix: '/api' })`
- [ ] T031 [US4] Create `frontend/deliver.js` exporting `initDeliver()`: renders Deliver Story section inside `#section-deliver`; story selector → on select load existing delivery or `POST` to create new record; render story preview; render Audience textarea with advice text (static); render Context textarea with advice text (static); render Format cards (Text, Slides, Live — each with title + summary + goal + advice from spec); all user content via `.textContent`; static advice text may use `textContent`
- [ ] T032 [US4] Implement format card selection in `frontend/deliver.js`: clicking a card adds `.format-card--selected` class + immediately calls `PATCH /api/deliveries/:id` with `{ format }`; clicking selected card deselects it + calls PATCH with `{ format: null }`; only one card selected at a time
- [ ] T033 [US4] Wire auto-save in `frontend/deliver.js`: Audience and Context textareas use debounced 2 s auto-save calling `PATCH /api/deliveries/:id`; format selection saves immediately (T032); sync indicator per existing pattern
- [ ] T034 [US4] Add CSS to `frontend/style.css` for: Deliver section layout; format cards (`.format-card`, `.format-card--selected`); advice labels
- [ ] T035 [US4] Update `frontend/app.js`: import `initDeliver` from `deliver.js`; call on first navigation to deliver section
- [ ] T036 [US4] Update `frontend/service-worker.js`: add `deliver.js` to `CACHE_FILES`

**Checkpoint**: Audience + Context saved, format card selected, reload — all restored.

---

## Phase 7: User Story 5 — User captures feedback on a story (Priority: P5)

**Goal**: Full Feedback Story section — third-party feedback and self-impression textareas, auto-save.

**Independent Test**: Log in, select a story, type in both fields (wait 2 s each), reload — both fields restored.

- [x] T037 [US5] Create `backend/src/routes/feedbacks.js`: `GET /api/stories/:storyId/versions/:versionId/feedbacks`; `POST /api/stories/:storyId/versions/:versionId/feedbacks`; `PATCH /api/feedbacks/:feedbackId` (third_party, self_impression); `DELETE /api/feedbacks/:feedbackId` — all routes validate ownership; per `specs/006-extend-deliver-feedback/contracts/api.md`
- [x] T038 [US5] Register feedbacks routes in `backend/src/server.js`: `await fastify.register(feedbackRoutes, { prefix: '/api' })`
- [ ] T039 [US5] Create `frontend/feedback.js` exporting `initFeedback()`: renders Feedback Story section inside `#section-feedback`; story selector → on select load existing feedback or `POST` to create new record; render story preview; render "Third-party feedback" textarea with advice text; render "Self-impression" textarea with advice text; all user content via `.textContent`; static advice text may use `textContent`
- [ ] T040 [US5] Wire auto-save in `frontend/feedback.js`: both textareas use debounced 2 s auto-save calling `PATCH /api/feedbacks/:id`; sync indicator per existing pattern
- [ ] T041 [US5] Add CSS to `frontend/style.css` for: Feedback section layout; textarea labels and advice styling (consistent with Deliver section)
- [ ] T042 [US5] Update `frontend/app.js`: import `initFeedback` from `feedback.js`; call on first navigation to feedback section
- [ ] T043 [US5] Update `frontend/service-worker.js`: add `feedback.js` to `CACHE_FILES`

**Checkpoint**: Both feedback fields saved, reload — persists.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Validation, security sweep, and final wiring across all sections.

- [ ] T044 [P] Verify empty states: navigate to Extend, Deliver, Feedback with a user account that has no stories — confirm a friendly empty state ("Build a story first" prompt + link to Build section) is shown in each section instead of an error
- [ ] T045 [P] XSS sweep: audit all three new frontend modules (`extend.js`, `deliver.js`, `feedback.js`) + shared components (`story-selector.js`, `story-preview.js`) — confirm every write of user-controlled data uses `.textContent`, never `.innerHTML`; fix any violations
- [ ] T046 [P] Cascade delete verification: delete a story version that has extensions, deliveries, and feedbacks — confirm all child records are removed (check DB directly or via API returning 404 after version delete)
- [ ] T047 [P] CSP compliance check: load the app in a browser with DevTools open, navigate through all four sections — confirm zero CSP violations in the console
- [ ] T048 Run the complete end-to-end user flow manually: build a story → extend it (add + position element) → create a delivery plan → log feedback → verify all data persists across a page reload
- [ ] T049 Update `CLAUDE.md`: add `006-extend-deliver-feedback` entry under **Active Technologies** (vanilla JS ES2020, no new deps) and note the new shared components (`story-selector.js`, `story-preview.js`) and new route pattern under **Recent Changes**

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — BLOCKS US3, US4, US5
- **Phase 3 (US1 — Repo)**: Independent — can run in parallel with Phase 2 and Phase 4
- **Phase 4 (US2 — App Shell)**: Can run in parallel with Phase 2 and Phase 3 — does not depend on DB migration
- **Phase 5 (US3 — Extend)**: Requires Phase 2 (DB + shared components) + Phase 4 (app shell sections exist)
- **Phase 6 (US4 — Deliver)**: Requires Phase 2 (DB + shared components) + Phase 4; can run in parallel with Phase 5
- **Phase 7 (US5 — Feedback)**: Requires Phase 2 (DB + shared components) + Phase 4; can run in parallel with Phase 5/6
- **Phase 8 (Polish)**: Requires all user story phases complete

### User Story Dependencies

- **US1 (P1 — Repo)**: Fully independent
- **US2 (P2 — App Shell)**: Fully independent
- **US3 (P3 — Extend)**: Requires Phase 2 (DB + shared components) + Phase 4 (sections in HTML)
- **US4 (P4 — Deliver)**: Requires Phase 2 + Phase 4; independent of US3
- **US5 (P5 — Feedback)**: Requires Phase 2 + Phase 4; independent of US3 and US4

### Within Each User Story

- Backend route file created before registering in `server.js`
- Frontend JS module created before being imported in `app.js`
- CSS tasks can run in parallel with JS tasks (different file)

---

## Parallel Examples

### Phase 2: Run together

```
T004 Create story-selector.js
T005 Create story-preview.js
```

### Phase 3 (US1): Run together

```
T006 Replace LICENSE
T007 Create CODE_OF_CONDUCT.md
T008 Create CONTRIBUTING.md
T009 Create SECURITY.md
T010 Delete docs/
T011 Delete book/
```
Then: T012 Rewrite README

### Phase 5+6+7: Run together (after Phase 2 + 4 complete)

```
T019 Create extensions.js (backend)     T029 Create deliveries.js (backend)     T037 Create feedbacks.js (backend)
T021 Create extend.js (frontend)        T031 Create deliver.js (frontend)        T039 Create feedback.js (frontend)
T026 CSS for Extend section             T034 CSS for Deliver section             T041 CSS for Feedback section
```

---

## Implementation Strategy

### MVP First (US1 + US2 only)

1. Complete Phase 1 + Phase 2
2. Complete Phase 3 (US1 — repo is clean and credible)
3. Complete Phase 4 (US2 — app shell navigation works, empty sections visible)
4. **STOP and VALIDATE**: New shell works, Build Story still works, repo is open-source ready
5. Deploy if ready

### Incremental Delivery

1. Setup + Foundational → baseline ready
2. US1 → repo credible for open-source audiences ✓
3. US2 → navigation shell live (empty Extend/Deliver/Feedback visible) ✓
4. US3 → Extend Story functional ✓
5. US4 → Deliver Story functional ✓
6. US5 → Feedback Story functional ✓
7. Polish → complete feature shipped ✓

### Parallel Team Strategy

After Phase 1 + 2 complete:
- **Developer A**: US1 (repo files, no code) + US2 (app shell HTML/CSS/JS)
- **Developer B**: US3 backend (`extensions.js`) + US3 frontend (`extend.js`)
- **Developer C**: US4 + US5 backend and frontend

---

## Notes

- `[P]` = different files, no blocking dependencies on incomplete tasks in the same phase
- Build Story (`#section-build`) is **not touched** — all changes are additive
- No tests requested — manual validation only (per project conventions)
- Always use `.textContent` for user-controlled content; static copy (card titles, advice) may use `textContent` or safe direct assignment
- Each new backend route file follows the existing pattern in `backend/src/routes/versions.js`
- Commit after each logical group (e.g., after T002+T003, after each user story phase)
