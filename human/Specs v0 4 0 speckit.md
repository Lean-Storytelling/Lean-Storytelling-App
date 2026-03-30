# Lean Storytelling — v0.4.0 Spec

**Version**: 0.4.0
**Date**: 2026-03-30
**Status**: Draft

---

## Feature scope

v0.4.0 reorganises the repository as a developer-first project, redesigns the app shell (sticky top bar, collapsible sidebar, navigation rail), and adds three new full-stack feature sections: Extend, Deliver, and Feedback.

**In scope:**
- Repository reorganisation: license, contribution guides, security policy, revamped README
- App shell redesign: sticky top bar with breadcrumbs, collapsible sidebar (nav + stories list), navigation rail
- Extend Story: add extension elements, place them in the LS structure; Blend is a non-interactive visual scaffold only
- Deliver Story: capture audience, context, and format for a selected story version
- Feedback Story: capture third-party feedback and self-impression for a selected story version
- Full-stack: new DB tables + API routes for Extend, Deliver, Feedback; auto-save on all text inputs (same pattern as v0.3)

**Out of scope:**
- Blend interaction logic (scaffold and "Coming soon" badge only — no backend)
- Build Story changes (kept as-is)
- Mobile / small screen support
- Billing, admin panel, data export

---

## Architecture

No stack changes. Same Node.js + Fastify + PostgreSQL + vanilla JS stack as v0.3.
Additions: three new DB tables, corresponding API routes (GET, POST, PATCH, DELETE per resource).

---

## Data model (new tables)

### StoryExtension

| Field | Type | Notes |
|---|---|---|
| id | UUID | PK |
| story_version_id | UUID | FK → StoryVersion |
| element_type | enum | `opening_challenge`, `data`, `quote`, `alternative`, `fail`, `call_to_action` |
| content | text | free-form, optional |
| anchor | enum | `before_context`, `after_context`, `after_target`, `after_empathy`, `after_problem`, `after_consequences`, `after_solution`, `after_benefits`, `after_why` |
| sort_order | integer | order among elements sharing the same anchor; starts at 1 |
| created_at | timestamp | |
| updated_at | timestamp | |

Multiple instances of the same `element_type` are allowed per `story_version_id`.

### StoryDelivery

| Field | Type | Notes |
|---|---|---|
| id | UUID | PK |
| story_version_id | UUID | FK → StoryVersion |
| audience | text | optional |
| context | text | optional |
| format | enum | `text`, `slides`, `live` — nullable until selected |
| created_at | timestamp | |
| updated_at | timestamp | |

Multiple deliveries per `story_version_id` are allowed (same story delivered in different contexts).

### StoryFeedback

| Field | Type | Notes |
|---|---|---|
| id | UUID | PK |
| story_version_id | UUID | FK → StoryVersion |
| third_party | text | optional |
| self_impression | text | optional |
| created_at | timestamp | |
| updated_at | timestamp | |

Multiple feedback records per `story_version_id` are allowed.

---

## Shared UI components

These components are reused identically across F3, F4, F5:

- **Story + Version Selector**: story dropdown + version dropdown. Defaults to the user's last active story and its latest version.
- **Story Preview**: read-only preview panel rendering the full story in delivery order (same as Build Story right pane, "View").

---

## Features

### F1 — Repository reorganisation

1. Replace license with AGPLv3 (`LICENSE` file).
2. Add `CODE_OF_CONDUCT.md` (Contributor Covenant, standard template).
3. Add `CONTRIBUTING.md`: local setup, dev workflow, PR process, coding conventions.
4. Add `SECURITY.md`: how to report vulnerabilities privately (GitHub private security advisory or dedicated email). Explicitly states: do not open a public issue for security vulnerabilities.
5. Remove `docs/` and `book/` directories entirely.
6. Revamp `README.md`:
   - Sections (in order): About, Methodology (3–5 sentences + link to [Lean-Storytelling/Lean-Storytelling](https://github.com/Lean-Storytelling/Lean-Storytelling)), Quickstart (`docker compose up`), Book (link to [Lean-Storytelling/Lean-Storytelling-Book](https://github.com/Lean-Storytelling/Lean-Storytelling-Book)), Contributing, License.
   - Tone: welcoming, professional, concise. No methodology deep-dive — link out.
   - Standard open-source structure: no surprises, no missing parts.

**Acceptance criteria:**
- GitHub community standards checklist is fully green.
- No methodology or book content remains in this repository.

---

### F2 — App shell redesign

#### 2.1 Sticky top bar

Always visible, full width, minimal height.

| Zone | Content |
|---|---|
| Left | Sidebar toggle icon · "Lean Storytelling" app title · `>` separator · current section name (e.g., "Build Story") |
| Right (anonymous) | "Magic Login / Sign Up" button → opens Auth Modal (existing) |
| Right (authenticated) | Avatar dropdown → Profile, Intent, Log out (existing) |

Breadcrumb values per section:
- Lean Storytelling > Build Story
- Lean Storytelling > Extend Story
- Lean Storytelling > Deliver Story
- Lean Storytelling > Feedback Story

#### 2.2 Sidebar (expanded state)

```
┌──────────────────────────┐
│  Build                   │  ← active item highlighted
│  Extend                  │
│  Deliver                 │
│  Feedback                │
├──────────────────────────┤  ← visual separator
│  My Stories  [+ New]     │
│  ▶ Story title       v3  │  ← existing v0.3 accordion, unchanged
│  ▼ Other story       v1  │
│    ├─ v1  today          │
│    └─ ...                │
└──────────────────────────┘
```

The My Stories section is visually distinct from the nav items (different background, typography weight, or indent level — to be decided in design).

#### 2.3 Navigation rail (collapsed state)

When the sidebar is toggled closed, it collapses to a narrow icon-only rail.

- Build, Extend, Deliver, Feedback: icon + tooltip on hover
- Visual separator
- Stories: single icon; clicking it expands the full sidebar to show My Stories

Clicking a nav icon navigates to that section without expanding the sidebar.
Clicking the toggle button re-expands to the full sidebar.

#### 2.4 Main canvas

Renders the active section. Each section has a **Utility/Action Bar** at the top with the section title and, where applicable, the Story Title Display (editable, same as Build Story).

---

### F3 — Extend Story

**Utility/Action Bar**: "Extend your Story"

**Workflow (top to bottom):**

1. **Story + Version Selector** (shared component)
2. **Story Preview** (shared component, read-only)
3. **Add Elements**
   - Advice banner: "The simpler the better. Test with one addition before adding more."
   - Card grid — each card contains title, one-sentence summary, goal, and advice:

   | Card | Summary | Goal | Advice |
   |---|---|---|---|
   | Challenge | A provocative question or statement | Refocus the audience | Keep it short — one sentence max |
   | Data | A fact, statistic, or metric | Ground the story in evidence | Cite the source; one data point only |
   | Quote | A direct quote from a person | Add credibility or emotion | Use real quotes; attribute clearly |
   | Alternative | A path not taken | Show you considered options | Brief — the story is not about the alternative |
   | Fail | What didn't work before | Build authenticity and trust | Vulnerability is a strength; stay factual |
   | Call to Action | What you want the audience to do | Close with intent | One action only; make it concrete |

   - Clicking a card opens an **inline free-form textarea** below the card for content input.
   - Multiple cards can be open simultaneously.
   - Multiple instances of the same card type are allowed (e.g., two Quotes).

4. **Placement widget**
   - Displays the full LS structure as an ordered list: Context · Target · Empathy · Problem · Consequences · Solution · Benefits · Why
   - Added elements appear as draggable chips inserted at their anchor points
   - User can **drag-and-drop** chips to reposition them, OR use **↑ / ↓ arrow buttons** on each chip
   - Valid anchors: before Context, or after any of the 8 LS elements
   - Placement saves immediately on drop or button press

5. **Blend (non-interactive scaffold)**
   - Section header: "Blend to another story"
   - Second **Story + Version Selector** (shared component)
   - Second **Story Preview** (shared component, read-only)
   - Blend type cards displayed (non-clickable): Prequel-Sequel, Nested sub-story, Parallel, Flashback
   - "Coming soon" badge overlaid on the entire Blend section

**Auto-save:** debounced 2 s on element content fields; immediate on placement changes.

---

### F4 — Deliver Story

**Utility/Action Bar**: "Deliver your Story"

**Workflow (top to bottom):**

1. **Story + Version Selector** (shared component)
2. **Story Preview** (shared component, read-only)
3. **Audience**
   - Free-form textarea
   - Advice: "Describe who will receive this story: their role, level of familiarity, and what they care about."
4. **Context**
   - Free-form textarea
   - Advice: "Describe where, when, why this story will be delivered: meeting type, group size, energy level, constraints."
5. **Format** — card-based single selection:

   | Card | Summary | Goal | Advice |
   |---|---|---|---|
   | Text | Written document or message | Async reading, lasting reference | Structure clearly; use delivery order |
   | Slides | Presentation deck | Visual support for live delivery | One idea per slide; story drives the deck |
   | Live | Spoken delivery, no deck | Direct, human connection | Rehearse the opening and closing |

   - Selecting a card highlights it and saves immediately.
   - Selecting again deselects (sets format to null).

**Auto-save:** debounced 2 s on Audience and Context; immediate on Format selection.

---

### F5 — Feedback Story

**Utility/Action Bar**: "Feedback your Story"

**Workflow (top to bottom):**

1. **Story + Version Selector** (shared component)
2. **Story Preview** (shared component, read-only)
3. **Third-party feedback**
   - Free-form textarea
   - Advice: "Capture what others said: qualitative and/or quantitative, positive, negative, neutral, direct suggestions."
4. **Self-impression**
   - Free-form textarea
   - Advice: "Capture how it felt: what seemed to land well, what you want to improve next time."

**Auto-save:** debounced 2 s on both fields.

---

## Security

- All new API routes require a valid JWT (httpOnly cookie); server validates `story_version_id` ownership before any read or write.
- XSS prevention: all user content rendered via `.textContent`, never `.innerHTML` (existing rule, applies to all new views).
- No new auth mechanisms; no new sensitive data types.
