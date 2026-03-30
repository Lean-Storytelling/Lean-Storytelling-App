# Implementation Plan: v0.4.0 — App Shell + Extend, Deliver, Feedback

**Branch**: `006-extend-deliver-feedback` | **Date**: 2026-03-30 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/006-extend-deliver-feedback/spec.md`

## Summary

v0.4.0 ships in five parts: (1) repository reorganisation (license, README, community files), (2) a redesigned app shell (sticky top bar with breadcrumbs, collapsible sidebar with Build/Extend/Deliver/Feedback nav + existing Stories list, navigation rail), and (3–5) three new full-stack feature sections — Extend Story, Deliver Story, and Feedback Story — each with its own DB table, API routes, and vanilla JS frontend module. All new sections reuse the existing auto-save pattern and two new shared components (Story+Version Selector, Story Preview). Build Story is unchanged. No new runtime dependencies are introduced.

## Technical Context

**Language/Version**: Node.js 20 LTS (backend) + Vanilla JS ES2020 (frontend)
**Primary Dependencies**: Fastify 5.2.1, `@fastify/jwt`, `@fastify/cookie`, `@fastify/static`, `@fastify/cors`, `postgres` v3.4.5, Resend — **no new dependencies**
**Storage**: PostgreSQL 16 (three new tables: `story_extensions`, `story_deliveries`, `story_feedbacks`) + `localStorage` (sidebar toggle state)
**Testing**: Manual (no automated test framework in this project)
**Target Platform**: Linux server (VPS, Docker Compose) + modern evergreen browsers (desktop only)
**Project Type**: Web service (Fastify API) + SPA (vanilla JS)
**Performance Goals**: Auto-save debounced 2 s on text fields; immediate on placement/format selection
**Constraints**: `default-src 'self'` CSP enforced; zero new runtime deps; all fonts self-hosted; offline-capable (service worker)
**Scale/Scope**: Personal productivity tool, small number of concurrent users

## Constitution Check

*GATE: Must pass before Phase 0 research.*

| Principle | Status | Notes |
|---|---|---|
| I. Simplicity First | ✅ PASS | No new dependencies. New sections follow existing patterns. Blend is scaffold-only — no premature implementation. |
| II. LS Methodology Fidelity | ✅ PASS | Story Preview in all new sections renders in canonical delivery order. Field names unchanged. Extension element names match Extension Pack. |
| III. Responsive & Progressive | ⚠️ SCOPED | Mobile remains out of scope (carried from v0.3, same product decision). CSP + service worker + offline queue unchanged. |
| IV. Readability & Maintainability | ✅ PASS | One new JS file per section (extend.js, deliver.js, feedback.js, nav.js). One new route file per resource. All logic follows existing module pattern. |
| V. Incremental Story-Level Growth | ✅ PASS | Extension Pack elements ship in v0.4.0 as designed. Blend (advanced) is scaffold-only — not built ahead of validation. |
| VI. Elegant & Focused UI/UX | ✅ PASS | Each new section has one primary action. Card patterns are consistent. Advice banners provide focused guidance. No visual clutter. |

**Constitution violations requiring justification**: None.

## Project Structure

### Documentation (this feature)

```text
specs/006-extend-deliver-feedback/
├── plan.md              ← this file
├── research.md          ← Phase 0 output
├── data-model.md        ← Phase 1 output
├── quickstart.md        ← Phase 1 output
├── contracts/
│   └── api.md           ← Phase 1 output
├── checklists/
│   └── requirements.md  ← spec quality checklist
└── tasks.md             ← Phase 2 output (/speckit.tasks — not yet created)
```

### Source Code

```text
backend/src/
├── server.js                         (modified — register new routes)
├── db/migrations/
│   └── 002_v040.sql                  (new — 3 tables + 3 enums)
└── routes/
    ├── extensions.js                 (new — CRUD for story_extensions)
    ├── deliveries.js                 (new — CRUD for story_deliveries)
    └── feedbacks.js                  (new — CRUD for story_feedbacks)

frontend/
├── index.html                        (modified — new app shell layout)
├── style.css                         (modified — sidebar, rail, breadcrumb, section styles, card styles)
├── app.js                            (modified — wire new sections, import new modules)
├── sidebar.js                        (modified — add nav items above stories list; add visual separator)
├── nav.js                            (new — section switching, breadcrumb update, rail toggle)
├── story-selector.js                 (new — shared Story+Version Selector component)
├── story-preview.js                  (new — shared read-only Story Preview component)
├── extend.js                         (new — Extend Story section UI + placement widget)
├── deliver.js                        (new — Deliver Story section UI)
├── feedback.js                       (new — Feedback Story section UI)
└── service-worker.js                 (modified — add new JS files to CACHE_FILES)

(root-level methodology/book files)
README.md                             (rewritten — developer-first)
LICENSE                               (replaced — AGPLv3)
CODE_OF_CONDUCT.md                    (new — Contributor Covenant)
CONTRIBUTING.md                       (new — setup, workflow, conventions)
SECURITY.md                           (new — private vulnerability reporting)
docs/                                 (deleted)
book/                                 (deleted)
```

**Structure Decision**: Web application (Option 2), backend + frontend separation. Follows the existing v0.3 layout exactly. Three new backend route files mirror the existing pattern in `backend/src/routes/`. Four new frontend JS modules follow the existing per-feature file pattern.

## Complexity Tracking

> No constitution violations — this table is empty.
