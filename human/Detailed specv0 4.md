# Review the top-down UX/UI workflow and Add new features: Extend, Deliver, Feedback

High-level view of the top-down UX/UI review:
- Top Title Sticky Bar:
  - Hierarchical navigation breadcrumbs/path
  - "Magic Log in & Sign Up" or "User Options, Avatar Menu, Account Dropdown"
- Collapsible/Foldable Siderbar/Drawer/Sidepanel vs Navigation Rail, with items: Build, Extend, Deliver, Feedback
- Main Section/Stage/Canvas/Viewport, with Utility/Action Bar

Add new features:
- Extend
- Deliver
- Feedback

Acceptance criteria:
- User can navigate (build, extend, deliver, feedback): breadcrumbs and Main Section/Stage/Canvas/Viewport update
- User collapse/fold Siderbar/Drawer/Sidepanel to Navigation Rail
- User open/view Navigation Rail to Siderbar/Drawer/Sidepanel
- User can still use the old "Story Build" in "Build Story"

## 1. Top Title Sticky Bar

Always shown, thin, clean, minimalistic

### 1.1 App title and breadcrumb, left
- **App Title**: "Lean Storytelling" (main title in header), on the left
- Breadcrumb:
    - "Lean Storytelling" > "Build Story"
    - "Lean Storytelling" > "Extend Story"
    - "Lean Storytelling" > "Deliver Story"
    - "Lean Storytelling" > "Feedback Story"

### 1.2 Anonymous/unidentified/unauthenticated users: Magic Log in & Sign Up (top right)

- **Auth Navigation**: "Magic Login/Signup" button, opens Auth Modal

### 1.3 Identified/authenticated users: User Options, Avatar Menu, Account Dropdown (top right)

- **User Options, Avatar Menu, Account Dropdown**, drop-down menu items
  - **Profile**: Input for job title, opens Profile Modal
	- **Intent**: Input for what the user wants to get better at, opens Intent Modal
	- **Log out**: Button to log out, opens Logout Modal

## 2. Collapsible/Foldable Siderbar/Drawer/Sidepanel vs Navigation Rail, with items: Build, Extend, Deliver, Feedback
- **Sidebar Menu** (foldable slider/drawer/panel), user clicks on item to open Main Section/Stage/Canvas/Viewport:
    - "Build"
    - "Extend"
    - "Deliver"
    - "Feedback"
- **Sidebar Toggle**: Button to toggle sidebar visibility

## 3. Main Section/Stage/Canvas/Viewport, with Utility/Action Bar

Based on what user has clicked on the sidebar:
- "Build Story"
- "Extend Story"
- "Deliver Story"
- "Feedback story"

### 3.1 "Build Story"

This one is already built, and refined enough, we keep it as is

This text is here for documentation

#### 3.1.1 "Build Story" Utility/Action Bar
- **Build Story Heading**: "Build Story" title
- **Story Title Display/Input**: Shows the current story title, editable field on hover, crayon emoji on the left
- **Save Button**: Button to save the story on the right, active when user has modified

#### 3.1.2 Wave Navigation Bar
- **Wave Cards**: Cards representing different story-building phases
  - **Basic Story Wave Card**: First wave for fundamental building blocks
  - **Detailed Story Wave Card**: Second wave for enriching the story
  - **Full Story Wave Card**: Third wave for finishing touches
- **Wave Progress**: Progress indicators within each wave card
  - **Wave Steps**: Individual steps within each wave (e.g., Target, Problem, Solution)
  - **Wave Step Labels**: Labels for each step (e.g., "Target", "Problem")
  - **Wave Complete Badge**: Checkmark badge indicating wave completion

#### 3.1.2 Build Story, 2-pane sub-container
- **Left Pane**: Input form section
  - **Pane Label**: "Craft" label for the left pane
  - **Form View**: Main form area for story input
  - **Storage Notice**: Warning about session storage unavailability
  - **Basic Story Form**: Form for basic story elements (Target, Problem, Solution)
  - **Detailed Story Form**: Form for detailed story elements (Empathy, Consequences, Benefits)
  - **Full Story Form**: Form for full story elements (Context, Why)
  - **Field Groups**: Groups of fields for each story element
    - **Field Title**: Title of the field (e.g., "Target", "Problem")
    - **Field Explainer**: Explanation text for the field
    - **Textarea**: Input area for the field content
    - **Field Advice**: Advice section with toggle
    - **Field Advice Toggle**: Button to toggle advice visibility
    - **Field Advice Body**: Content of the advice section
    - **Status Select**: Dropdown for confidence level (Unsure, Needs Review, Confirmed)

- **Right Pane**: Story preview section
  - **Pane Label**: "View" label for the right pane
  - **Story Preview**: Preview of the story
  - **Preview Heading**: "Your Story" heading
  - **Preview Narrative**: Narrative preview text
  - **Preview Placeholder**: Placeholder text for empty story
  - **Consistency Check**: Placeholder for consistency analysis (coming soon)
  - **Coaching**: Placeholder for coaching questions (coming soon)

### 3.2 "Extend Story"

Task:
create a simple and minimalistic workflow based on free forms
respect both the new hierarchy of new user tasks described below
respect the existing app philosophy and patterns

Utility/Action Bar:
"Extend your Story"

Main Section/Stage/Canvas/Viewport:

Hierarchy of user tasks:
- "Select Story and Version", default user-selected Story to latest Version
- Preview Story + Version (like in "Build Story" > "View" right pane)
- "Add element(s)" visual selection cards, one to many possible, add advice like "the simpler the better" and "test before adding more"
  - Cards available (each card contains title, and very concise summary, goal, advice), clicking on card opens free form for user to fill
  	- Opening challenge
	  - Data
	  - Quote
	  - Alternative
	  - Fail
	  - Call to action
   - Place you addition(s): dynamic visual placement widget, the user can move up/down his additions inside the context|target|empathy|problem|consequences|solution|benefits|why Lean Storytelling structure
- "Blend to another story": "Choose your second Story", story selector drop down, version selector drop-down, add advice like "carefull, hard to write, hard to understand"
  - Prequel-Sequel
	- Nest sub-story
  - Parallel
  - Flashback

Process:
- the user has to choose a Story and a Version to start extending
- the user can choose to add element and/or blend to another story
- the user can freely position his additions in the Lean Storytelling structure

### 3.3 "Deliver Story"

Task:
create a simple and minimalistic workflow based on free forms
respect both the new hierarchy of new user tasks described below
respect the existing app philosophy and patterns

Utility/Action Bar:
"Deliver your Story"

Main Section/Stage/Canvas/Viewport:

Hierarchy of user tasks:
- "Select Story and Version", default user-selected Story to latest Version
- Preview Story + Version (like in "Build Story" > "View" right pane)
- Audience: Describe audience profiles
- Context: Detail the context of the delivery
- Format: text, slides, live

### 3.4 "Feedback Story"

Task:
create a simple and minimalistic workflow based on free forms
respect both the new hierarchy of new user tasks described below
respect the existing app philosophy and patterns

Utility/Action Bar:
"Feedback your Story"

Main Section/Stage/Canvas/Viewport:

Hierarchy of user tasks:
- "Select Story and Version", default user-selected Story to latest Version
- Preview Story + Version (like in "Build Story" > "View" right pane)
- Input third-party feedback: free form for user to fill, give advice like "quali vs quanti, positive vs negative vs neutral, suggestions"
- Capture self-impression: free form for user to fill, give advice like "how it felt, what seemed good, what I want to improve"

## 4. Modals
- **Auth Modal**: Modal for login/signup
  - **Auth Form**: Form for entering email address
  - **Magic Link Button**: Button to send magic link
- **Profile Modal**: Free form for user to enter profile
  - **Free form**: Encourage user "Tell us more about yourself..." 
- **Intent Modal**
  - **Free form**: Encourage user "Tell us more about what you want to achieve..." 
- **Logout Modal**
  - **Confirmation**: Yes/no
