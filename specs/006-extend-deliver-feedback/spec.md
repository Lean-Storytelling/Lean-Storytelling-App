# Feature Specification: v0.4.0 — App Shell + Extend, Deliver, Feedback

**Feature Branch**: `006-extend-deliver-feedback`
**Created**: 2026-03-30
**Status**: Draft
**Input**: User description: "v0.4.0: app shell redesign + Extend, Deliver, Feedback story sections"

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Developer opens the repository and finds it credible (Priority: P1)

A new contributor or potential user lands on the GitHub repository. They expect the standard open-source signals: a clear README, a license, a contribution guide, a code of conduct, and a way to report security issues privately. Currently the repo mixes methodology documentation and book content with the app code, which is confusing for developers.

**Why this priority**: Without a developer-oriented repository, the project cannot attract contributors or be taken seriously as open-source software. This unblocks community growth and is independent of all UI work.

**Independent Test**: Clone a fresh copy of the repo, read only `README.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, and verify the GitHub community standards checklist is fully green.

**Acceptance Scenarios**:

1. **Given** a developer visits the repository, **When** they read the README, **Then** they understand what the app does, how to run it locally, and where to find the methodology and book.
2. **Given** a developer wants to contribute, **When** they read `CONTRIBUTING.md`, **Then** they know how to set up their environment, submit a PR, and follow coding conventions.
3. **Given** a security researcher finds a vulnerability, **When** they read `SECURITY.md`, **Then** they know how to report it privately without opening a public issue.
4. **Given** the repo contains methodology and book directories, **When** v0.4.0 ships, **Then** `docs/` and `book/` no longer exist in the repository.

---

### User Story 2 — App User navigates between story-building sections (Priority: P2)

An authenticated user wants to work on their story across its full lifecycle: build it, extend it, prepare a delivery, and capture feedback. Currently the app only exposes the Build section. The new app shell gives them a persistent sidebar (expandable/collapsible) with four sections — Build, Extend, Deliver, Feedback — plus their stories list below.

**Why this priority**: The app shell is the structural foundation that makes all other new sections accessible. Without it, Build, Extend, Deliver, and Feedback (and stories list) cannot be reached.

**Independent Test**: Navigate between all four sections using both the full sidebar and the collapsed navigation rail; verify the breadcrumb and main canvas update correctly on each click.

**Acceptance Scenarios**:

1. **Given** a user is on any section, **When** they click a nav item in the sidebar, **Then** the main canvas switches to that section and the breadcrumb updates (e.g., "Lean Storytelling > Extend Story").
2. **Given** the sidebar is expanded, **When** the user clicks the toggle button, **Then** the sidebar collapses to a narrow icon-only navigation rail.
3. **Given** the sidebar is collapsed to a rail, **When** the user clicks a nav icon, **Then** they navigate to that section without the sidebar expanding.
4. **Given** the sidebar is collapsed, **When** the user clicks the Stories icon in the rail, **Then** the full sidebar expands to show the My Stories section.
5. **Given** a user is authenticated, **When** they look at the top bar, **Then** they see their avatar dropdown with Profile, Intent, and Log out options.
6. **Given** a user is anonymous, **When** they look at the top bar, **Then** they see a "Magic Login / Sign Up" button.

---

### User Story 3 — User extends a story with additional elements (Priority: P3)

An authenticated user has built a story and wants to enrich it. They go to Extend Story, select the story and version they want to work on, preview it, then add one or more extension elements (Challenge, Data, Quote, Alternative, Fail, Call to Action). They then position each element within the Lean Storytelling structure using drag-and-drop or arrow buttons. All changes are auto-saved.

**Why this priority**: Extending a story is the first new user-facing workflow beyond Build. It directly expands the value of the app by teaching users the Extension Pack.

**Independent Test**: Add two extension elements to a story, reposition them, reload the page — verify both elements and their positions persist.

**Acceptance Scenarios**:

1. **Given** a user opens Extend Story, **When** they select a story and version, **Then** a read-only preview of that story appears below.
2. **Given** a user is on the Add Elements step, **When** they click an element card (e.g., Quote), **Then** a free-form text area opens inline below that card.
3. **Given** a user has added an element, **When** they view the placement widget, **Then** the element appears as a chip in the LS structure, positioned at a default anchor.
4. **Given** a user wants to reposition a chip, **When** they drag it or click the ↑/↓ buttons, **Then** the chip moves to the new anchor and the change saves immediately.
5. **Given** a user has typed content in an element field, **When** 2 seconds pass without further input, **Then** the content is saved automatically.
6. **Given** a user views the Blend section, **When** they look at it, **Then** blend type cards are visible but non-interactive (Prequel-Sequel, Nest sub-story, Parallel, Flashback), with a "Coming soon" badge over the entire section.

---

### User Story 4 — User prepares a story delivery (Priority: P4)

An authenticated user is about to present a story and wants to capture their delivery plan: who they're speaking to, the context of the presentation, and the format (text, slides, or live). They go to Deliver Story, select the story, fill in the three fields, and their plan is saved for future reference.

**Why this priority**: Deliver Story adds a new layer of value (delivery adaptation) and is simpler than Extend — good incremental step once the shell is live.

**Independent Test**: Create a delivery plan for a story, close the browser, reopen — verify audience, context, and format are all restored.

**Acceptance Scenarios**:

1. **Given** a user opens Deliver Story and selects a story version, **When** they fill in the Audience textarea, **Then** the content auto-saves after 2 seconds of inactivity.
2. **Given** a user is on the Format step, **When** they click a format card (Text, Slides, or Live), **Then** the card is highlighted and the selection saves immediately.
3. **Given** a user has selected a format, **When** they click the same card again, **Then** the format is deselected and set to none.
4. **Given** a user has saved a delivery plan, **When** they navigate away and return, **Then** all fields (audience, context, format) are restored.

---

### User Story 5 — User captures feedback on a delivered story (Priority: P5)

After delivering a story, an authenticated user wants to record what others said and how they felt about the delivery. They go to Feedback Story, select the relevant story and version, and fill in two free-form fields: third-party feedback and self-impression. This is saved for future iterations.

**Why this priority**: Feedback closes the story improvement loop — it comes after Extend and Deliver in the workflow and is the simplest of the three new sections.

**Independent Test**: Fill in both feedback fields, reload — verify both persist.

**Acceptance Scenarios**:

1. **Given** a user opens Feedback Story and selects a story version, **When** they fill in the Third-party feedback field, **Then** it auto-saves after 2 seconds of inactivity.
2. **Given** a user fills in Self-impression, **When** they navigate away and return, **Then** the text is restored.
3. **Given** a user has multiple delivery sessions for the same story, **When** they create multiple feedback records, **Then** each is stored independently (multiple feedback records per story version are allowed).

---

### Edge Cases

- What happens when a user navigates to Extend/Deliver/Feedback with no stories yet? Show an empty state with a prompt to build a story first.
- What happens if a user tries to access another user's story version via a direct URL? The server rejects the request and returns an error.
- What happens when offline during auto-save in the new sections? Pending writes are queued (same offline queue pattern as Build Story) and flushed on reconnect.
- What happens when a user deletes a story version that has extensions, deliveries, or feedback? All associated records (StoryExtension, StoryDelivery, StoryFeedback) are cascade-deleted.
- What happens when the placement widget has no elements? The widget shows the LS structure with empty chips — an empty but valid state.
- What happens if a user adds a large number of extension elements? Max number of added elemants is 3; the UI must remain usable and the placement widget scrollable.

---

## Requirements *(mandatory)*

### Functional Requirements

**F1 — Repository**
- **FR-001**: The repository MUST include `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `SECURITY.md`, and `LICENSE` (AGPLv3).
- **FR-002**: `SECURITY.md` MUST direct reporters to use GitHub private security advisories, not public issues.
- **FR-003**: The `docs/` and `book/` directories MUST be removed from the repository.
- **FR-004**: `README.md` MUST cover: About, Methodology (brief + link), Quickstart, Book (link), Contributing, License — in that order.

**F2 — App Shell**
- **FR-005**: A sticky top bar MUST be visible on all pages, showing a sidebar toggle, app title, breadcrumb, and auth controls.
- **FR-006**: The sidebar MUST contain four navigation items (Build, Extend, Deliver, Feedback) and, below a visual separator, the existing My Stories accordion.
- **FR-007**: The sidebar MUST be collapsible to a navigation rail (icon-only) via a toggle button.
- **FR-008**: In rail mode, clicking a nav icon MUST navigate to that section without expanding the sidebar.
- **FR-009**: In rail mode, clicking the Stories icon MUST expand the full sidebar.
- **FR-010**: The breadcrumb in the top bar MUST update to reflect the active section.

**F3 — Extend Story**
- **FR-011**: Users MUST be able to select a story and version before adding elements.
- **FR-012**: A read-only story preview MUST be shown after story selection.
- **FR-013**: Users MUST be able to add extension elements from six types: Challenge, Data, Quote, Alternative, Fail, Call to Action.
- **FR-014**: Multiple elements of the same type MUST be allowed.
- **FR-015**: Users MUST be able to position elements within the LS structure (9 possible anchor points: before Context, or after each of the 8 LS elements).
- **FR-016**: The placement widget MUST support both drag-and-drop and ↑/↓ button repositioning.
- **FR-017**: Element content MUST auto-save (debounced) on change; placement MUST save immediately.
- **FR-018**: The Blend section MUST be visible as a non-interactive scaffold with a "Coming soon" badge; no backend logic is required.

**F4 — Deliver Story**
- **FR-019**: Users MUST be able to capture audience (free text), context (free text), and format (card selection: Text, Slides, Live) for a selected story version.
- **FR-020**: Multiple delivery records per story version MUST be supported.
- **FR-021**: Audience and context MUST auto-save (debounced); format selection MUST save immediately.
- **FR-022**: Format MUST be deselectable (toggles back to null).

**F5 — Feedback Story**
- **FR-023**: Users MUST be able to capture third-party feedback (free text) and self-impression (free text) for a selected story version.
- **FR-024**: Multiple feedback records per story version MUST be supported.
- **FR-025**: Both fields MUST auto-save (debounced) on change.

**Security**
- **FR-026**: All new data endpoints MUST verify that the authenticated user owns the story version being read or written.
- **FR-027**: All user-supplied content in new views MUST be rendered as plain text (no HTML injection).

### Key Entities

- **StoryExtension**: An optional enrichment element added to a story version, with a type (one of six), free-form content, an anchor position in the LS structure, and a sort order among elements sharing that anchor. Belongs to one StoryVersion. Multiple per version allowed.
- **StoryDelivery**: A delivery plan for a story version, capturing audience profile, delivery context, and format choice. Belongs to one StoryVersion. Multiple per version allowed.
- **StoryFeedback**: Post-delivery reflection for a story version, capturing third-party feedback and self-impression. Belongs to one StoryVersion. Multiple per version allowed.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer landing on the repository for the first time can understand the project purpose, run the app locally, and find contribution guidelines within 5 minutes — with no prior knowledge of the project.
- **SC-002**: GitHub community standards checklist shows 100% green after F1 ships.
- **SC-003**: A user can navigate between all four sections (Build, Extend, Deliver, Feedback) and back using only the sidebar or navigation rail, with no page reload and no broken breadcrumb.
- **SC-004**: A user can complete an extension workflow (select story → add one element → position it) in under 3 minutes.
- **SC-005**: All data entered in Extend, Deliver, and Feedback sections persists across browser sessions and devices for authenticated users.
- **SC-006**: No data loss occurs when the user goes offline during input — pending changes are recovered automatically on reconnect.

---

## Assumptions

- The existing v0.3 app (Build Story, auth, Stories list) ships unchanged; v0.4.0 is purely additive.
- Users are professionals (managers, leaders, product people) on desktop/large screens; mobile support remains out of scope.
- Blend feature appetite is unvalidated — it ships as a visual scaffold only; no user data is collected for Blend in this version.
- The Stories list in the sidebar (My Stories accordion) is reused as-is from v0.3, with no modifications.
- Element type `challenge` maps to the Extension Pack's "Opening Challenge" concept, renamed to "Challenge" for conciseness in the UI.
- StoryExtension, StoryDelivery, and StoryFeedback records are cascade-deleted when their parent StoryVersion is deleted.
- Auto-save behaviour (debounce 2 s, offline queue, sync indicator) for new sections is identical to the existing Build Story auto-save pattern.
- The Story + Version Selector and Story Preview components are built once and reused across Extend, Deliver, and Feedback — no per-section variation.