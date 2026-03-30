# Context

Previously:
- This repository used to be: https://github.com/Nyco/Lean-Storytelling
- It was containing different things: methodology, app, and book

Now:
- Umbrella organisation: https://github.com/Lean-Storytelling
- Contains this repository structure:
  - Methodology: https://github.com/Lean-Storytelling/Lean-Storytelling
  - Book: https://github.com/Lean-Storytelling/Lean-Storytelling-Book
  - Webapp: https://github.com/Lean-Storytelling/Lean-Storytelling-App

# Goals

High-level:
- Sync repos
- Create a new branch for a new version v0.4.0
- Refactor the repository: reorient it from doc to code
- Create specifications for "Spec Kit":
  - Review the top-down UX/UI workflow
  - Add new features:
    - Extend a story
    - Deliver a story
    - Feedback a story

# Reorganise the repository

Goals:
- Clean it from methodology and book
- Make it a developper repo

Tasks:
- Add a standard code of conduct
- Add a quickstart guide
- Add a contribution guide
- Change license to AGPLv3
- Remove docs/ and book/ directories
- Add instructions on how to report vulnerabilities privately rather than opening a public issue
- Revamp README:
  - Reorient it towards code
  - Keep a very short methodology decription
  - Make it standard for opensource audiences: no surprise, no missing parts
  - Tone is welcoming, professional, straght to the point
  - Add call to actions to learn the methodology and read the book (links to the two other repos of the sam organisation)

Acceptance criteria:
- The repo is clear for developers and opensource crowds
- It is possible to make an automatic review/assessement/audit of the repository organisation

# Create specifications for "Spec Kit"

## Review the top-down UX/UI workflow

Goals:
- Reorganise the app to accept and welcome new features
- Re-use standard UX/UI patterns and best practices

High-level view of the top-down UX/UI review:
- Top Title Sticky Bar:
  - Hierarchical navigation breadcrumbs/path
  - "Magic Log in & Sign Up" or "User Options, Avatar Menu, Account Dropdown"
- Collapsible/Foldable Siderbar/Drawer/Sidepanel vs Navigation Rail, with items: Build, Extend, Deliver, Feedback
- Main Section/Stage/Canvas/Viewport, with Utility/Action Bar

Acceptance criteria:
- We have a new "Spec Kit" specifications for v0.4.0:
  - Clean, concise, and easily readable and modifiable by humans
  - Structured
  - Unambiguous
  - Ready to consume by Spec Kit, with minimal token consumption

## Add new features: Extend, Deliver, Feedback

Goals:

We already have the "Buid a Story" feature, we keep it as it is working

Old state:
- Build a story

We want to add new features:
- Extend a story
- Deliver a story
- Feedback a story

New state:
- Build a story
- Extend a story
- Deliver a story
- Feedback a story

Add these three new features to:
- Collapsible/Foldable Siderbar/Drawer/Sidepanel vs Navigation Rail, with items: Build, Extend, Deliver, Feedback
- Main Section/Stage/Canvas/Viewport, with Utility/Action Bar

Acceptance criteria:
- We have a new "Spec Kit" specifications for v0.4.0:
  - Clean, concise, and easily readable and modifiable by humans
  - Structured
  - Unambiguous
  - Ready to consume by Spec Kit, with minimal token consumption
