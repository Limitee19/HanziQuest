
---
id: OL-DESIGN-001
title: OmniLife Design Constitution
category: Design System / Product Architecture
status: Active
version: 1.0.0
owner: OmniLife
scope: Entire Application
applies_to:
  - Desktop
  - Tablet
  - Mobile
  - Web
  - Future Native Clients
priority: Critical
---

# OMNILIFE DESIGN CONSTITUTION

> The visual constitution of OmniLife.
>
> OmniLife is a personal life operating system designed to manage a complex life
> through a calm, understandable, and highly intentional interface.
>
> **Simple on the surface. Deep underneath.**

---

# 00 — DESIGN NORTH STAR

## 00.1 Core Principle

OmniLife must feel:

- calm
- mature
- intentional
- useful
- intelligent
- personal
- trustworthy
- efficient
- quietly sophisticated

OmniLife must NOT feel:

- flashy
- template-generated
- excessively futuristic
- overly decorative
- generic SaaS
- AI-generated
- visually noisy
- like a collection of dashboard widgets

The central design principle is:

> **Complexity belongs in the system, not on the surface.**

OmniLife may contain extremely complex functionality.

The interface should expose only the complexity that is relevant to the user's
current context.

---

## 00.2 Design Philosophy

### Simple ≠ Simplistic

OmniLife is not a simple application.

It is intentionally capable of managing many areas of life:

- tasks
- projects
- schedules
- calendar
- routines
- study
- courses
- assignments
- exams
- notes
- knowledge
- goals
- finances
- subscriptions
- inventory
- important information
- documents
- vault
- analytics
- AI assistance
- and future systems

The interface must therefore use:

> **Progressive disclosure**

rather than attempting to display everything simultaneously.

---

## 00.3 The OmniLife Feeling

When a user opens OmniLife, the intended feeling is:

> "I can see what matters."

Not:

> "Wow, there are many widgets."

The application should feel like a:

### Personal Command Center

rather than a:

### Dashboard Template

---

# 01 — THE OMNILIFE DESIGN LAWS

These laws have the highest priority.

## Law 01 — Content Before Container

Do not create a card merely because content exists.

A container must provide a functional purpose such as:

- grouping
- separation
- interaction
- hierarchy
- state indication
- security
- navigation

If a border, background, or card does not improve comprehension,
remove it.

---

## Law 02 — Hierarchy Before Decoration

Prefer:

1. typography
2. spacing
3. alignment
4. contrast
5. grouping

before:

1. gradient
2. glow
3. shadow
4. blur
5. decorative illustration
6. excessive icons

---

## Law 03 — Every Element Must Earn Its Place

Every visual element should answer:

> "Why does this exist?"

If the answer is only:

> "It looks modern."

remove it.

---

## Law 04 — Color Has Meaning

Color must communicate semantic information.

Color must not exist merely to make the interface colorful.

---

## Law 05 — Complexity Must Be Progressive

Do not expose advanced functionality until it becomes relevant.

Basic interaction:

> simple

Advanced interaction:

> available

Expert functionality:

> discoverable when needed

---

## Law 06 — Decoration Is a Limited Resource

Decorative visual language must be used sparingly.

The more decoration appears throughout the interface,
the less meaningful each decorative element becomes.

---

## Law 07 — Consistency Does Not Mean Repetition

Do not repeat the same component pattern simply because it already exists.

A consistent design system means:

> consistent principles

not:

> identical visual boxes everywhere.

---

## Law 08 — Utility Over Novelty

When choosing between:

- visually impressive
- functionally useful

prefer:

> functionally useful.

---

# 02 — ANTI-AI-SLOP STANDARD

This section exists specifically to prevent generic AI-generated UI.

## 02.1 Forbidden Default Patterns

AI agents MUST NOT automatically introduce:

- excessive rounded cards
- giant gradient sections
- glassmorphism
- backdrop blur
- excessive shadows
- glowing borders
- purple neon effects
- floating cards everywhere
- card-inside-card structures
- excessive statistics
- decorative analytics
- unnecessary badges
- excessive icons
- excessive uppercase labels
- excessive section numbering
- excessive pill controls
- excessive centered layouts
- generic SaaS hero sections
- unnecessary AI sparkles
- unnecessary gradients
- decorative blobs
- random abstract backgrounds
- excessive empty-state illustrations
- fake "premium" effects
- UI elements that exist only to make screenshots look impressive

---

## 02.2 Card Abuse

Never assume:

> "Each section should be a card."

Incorrect:

```text
[ Card ]
  [ Card ]
    [ Card ]
      content
````

Prefer:

```text
SECTION TITLE
────────────────────────────

content

────────────────────────────
```

Cards should be introduced only when the content benefits from
physical grouping.

---

## 02.3 Radius Abuse

Rounded corners are allowed.

However:

> Rounded corners must not become the dominant visual identity.

Do not apply large radii indiscriminately to:

* cards
* buttons
* inputs
* navigation
* panels
* dialogs
* containers

Prefer restrained radii.

Default visual language should favor:

* subtle radius
* clean edges
* controlled geometry

Large rounded surfaces should be reserved for:

* special interactive elements
* important contextual surfaces
* deliberately emphasized content

---

## 02.4 Gradient Abuse

Gradients are NOT a default styling technique.

Do not use gradients simply to make a component feel modern.

Gradients may be used when they have a clear product purpose,
for example:

* special AI state
* visual transition
* controlled emphasis
* rare branding moment

Do not use gradients simultaneously across:

* page background
* cards
* buttons
* icons
* text
* borders

---

## 02.5 Glassmorphism

Glassmorphism is not part of the default OmniLife visual language.

Avoid:

```text
blur
+
transparency
+
glowing border
+
gradient
+
shadow
```

unless there is a strong functional reason.

Prefer:

* solid surfaces
* subtle contrast
* restrained borders

---

## 02.6 Shadow Rules

Shadows should be subtle.

Do not use dramatic floating shadows to artificially separate
every component.

Prefer:

```text
surface difference
+
border
+
spacing
```

before:

```text
large shadow
```

---

## 02.7 Glow Rules

Glow is exceptional.

Avoid:

* neon glow
* purple glow
* glowing cards
* glowing text
* glowing borders
* ambient UI glow

Glow should never become the primary method of indicating importance.

---

## 02.8 Decorative Icon Rules

Icons exist to:

* identify
* navigate
* communicate state
* support recognition

Icons do NOT exist merely to fill empty space.

Do not add icons to every heading.

Do not add icons when text already communicates the meaning clearly.

---

# 03 — VISUAL PERSONALITY

OmniLife's visual personality:

## Primary

* dark
* quiet
* editorial
* technical
* personal
* restrained
* precise

## Secondary

* slightly futuristic
* intelligent
* structured
* sophisticated

## Avoid

* cyberpunk
* neon dashboard
* gaming UI
* excessive glass
* excessive gradients
* startup landing page aesthetics
* childish productivity aesthetics

---

# 04 — VISUAL DENSITY

OmniLife should be:

> Information-dense but visually quiet.

This is one of the most important characteristics of the product.

High information density is allowed.

Visual noise is not.

---

## 04.1 Density Rules

When adding information, prefer:

```text
better hierarchy
```

over:

```text
more containers
```

When reducing clutter, prefer:

```text
progressive disclosure
```

over:

```text
removing useful functionality
```

---

## 04.2 Dense Does Not Mean Crowded

Avoid:

```text
text
text
text
text
text
button
icon
badge
icon
badge
```

Use:

```text
clear hierarchy

primary information

secondary information

contextual actions
```

---

# 05 — LAYOUT SYSTEM

## 05.1 Page Structure

Pages should generally follow:

```text
GLOBAL NAVIGATION
        ↓
PAGE CONTEXT
        ↓
PRIMARY CONTENT
        ↓
SECONDARY CONTENT
        ↓
OPTIONAL DETAILS
```

Avoid:

```text
header
card
card
card
card
card
card
footer
```

---

## 05.2 Alignment

Prefer strong alignment.

Use shared:

* left edges
* columns
* baselines
* content boundaries

Avoid arbitrary positioning.

---

## 05.3 Whitespace

Whitespace is an active design element.

Whitespace should:

* separate concepts
* establish hierarchy
* reduce cognitive load
* create rhythm

Do not fill whitespace simply because it exists.

---

## 05.4 Asymmetry

Intentional asymmetry is allowed.

Do not force every section into:

```text
50 / 50
```

or:

```text
33 / 33 / 33
```

Use layout proportions based on content importance.

---

# 06 — CONTAINERS AND SURFACES

## 06.1 Surface Hierarchy

Prefer a small number of surface levels.

Example:

```text
Level 0
Application background

Level 1
Primary surface

Level 2
Elevated/contextual surface

Level 3
Modal / temporary surface
```

Do not create dozens of subtly different backgrounds.

---

## 06.2 Border Usage

Borders should be:

* subtle
* functional
* consistent

Use borders primarily to:

* separate
* contain
* define interactive boundaries

Do not outline everything.

---

## 06.3 Container Nesting

Avoid deep nesting.

Preferred:

```text
Page
 └── Section
      └── Content
```

Avoid:

```text
Page
 └── Card
      └── Card
           └── Card
                └── Card
```

Maximum nesting should be justified by function.

---

# 07 — COLOR SYSTEM

## 07.1 Color Philosophy

OmniLife should use a restrained palette.

The interface should be predominantly:

* dark neutral
* off-white / light neutral text
* muted secondary text
* restrained accent

Purple remains the primary OmniLife accent.

However:

> Purple must feel intentional, not omnipresent.

---

## 07.2 Accent Usage

Purple may indicate:

* primary action
* active navigation
* selected state
* OmniLife identity
* AI-related functionality
* important emphasis

Do not use purple simply because an element exists.

---

## 07.3 Semantic Colors

Semantic colors should remain consistent.

### Positive

Used for:

* income
* successful completion
* healthy state
* positive trend

### Negative

Used for:

* expense
* destructive action
* failure
* critical problem

### Warning

Used for:

* approaching deadline
* incomplete information
* attention required

### Neutral

Used for:

* informational states
* secondary metadata

---

## 07.4 Color Hierarchy

Most content should remain neutral.

Approximate hierarchy:

```text
Primary information
    ↓
high contrast

Secondary information
    ↓
medium contrast

Metadata
    ↓
low contrast

Decorative information
    ↓
minimal
```

---

# 08 — TYPOGRAPHY

Typography is one of OmniLife's primary visual tools.

## 08.1 Typography Should Create Hierarchy

Prefer typography changes before adding containers.

Hierarchy may be created through:

* size
* weight
* line height
* spacing
* contrast

---

## 08.2 Large Headlines

Large typography is allowed.

However, avoid the generic AI pattern:

```text
HUGE HEADLINE
+
gradient text
+
glow
+
center alignment
```

Prefer:

```text
large
strong
simple
purposeful
```

---

## 08.3 Uppercase Labels

Uppercase micro-labels may be used sparingly.

Do not turn every piece of metadata into:

```text
SMALL UPPERCASE LETTER SPACING
```

This pattern quickly creates AI-generated dashboard aesthetics.

---

## 08.4 Numbers

Large numbers may be used when the number itself is important.

Examples:

* balance
* task count
* progress
* score

Do not create statistics simply because statistics look good.

---

# 09 — ICONOGRAPHY

Icons should follow one coherent visual language.

Prefer:

* simple
* restrained
* recognizable
* consistent stroke weight

Avoid mixing:

* filled icons
* outlined icons
* colorful icons
* 3D icons
* emoji
* decorative illustrations

without a deliberate reason.

---

## 09.1 Icon Priority

Use:

```text
text + icon
```

when the icon improves recognition.

Use:

```text
text only
```

when the icon adds no information.

---

# 10 — NAVIGATION

The OmniLife sidebar represents the architecture of the user's life.

It should remain:

* stable
* predictable
* calm
* hierarchical

The sidebar should NOT become visually noisy.

---

## 10.1 Navigation Groups

Navigation groups should represent meaningful life domains.

Examples:

```text
HOME

STUDY & COLLEGE

PLAN & TIME

LIFE & KNOWLEDGE

MONEY & FINANCE

SECURITY & VAULT
```

These groups communicate the OmniLife information architecture.

---

## 10.2 Active Navigation

The active item should be clearly visible.

However:

> Active state does not require glowing borders or excessive decoration.

Use:

* contrast
* subtle background
* restrained accent
* clear typography

---

# 11 — INFORMATION ARCHITECTURE

## 11.1 Progressive Disclosure

Show:

### Level 1

What matters now.

### Level 2

What the user may need next.

### Level 3

Advanced information.

### Level 4

Configuration / system details.

Do not expose Level 4 information at Level 1.

---

## 11.2 Contextual Complexity

A finance page can be complex.

A task detail page can be complex.

A study planning page can be complex.

The home screen should not contain all of that complexity.

---

# 12 — TODAY / DASHBOARD

## 12.1 Dashboard Philosophy

OmniLife's Dashboard should function as:

> **Personal Command Center**

not:

> **Widget Collection**

---

## 12.2 Primary Question

The Dashboard should help answer:

> "What matters right now?"

Possible information:

* today's tasks
* upcoming events
* routines
* urgent deadlines
* relevant reminders
* important financial information
* study priorities
* AI recommendations

Only show information when it is relevant.

---

## 12.3 Avoid Widget Overload

Do not automatically show:

* analytics
* charts
* statistics
* goals
* finance
* study
* tasks
* calendar
* routines
* projects
* AI
* notes

all simultaneously.

The Dashboard should adapt to context.

---

## 12.4 Empty Dashboard

When there is little data, do NOT compensate with decorative UI.

Avoid:

```text
large empty card
+
illustration
+
gradient
+
huge icon
+
motivational quote
```

Prefer:

```text
Tasks today

No tasks scheduled.

+ Add task
```

Simple.

---

# 13 — AI EXPERIENCE

AI is a system capability, not a visual theme.

## 13.1 AI Must Not Dominate the Product

OmniLife should not constantly advertise:

> "AI POWERED"

The user already knows they are using OmniLife.

---

## 13.2 AI Visual Language

AI functionality may use the OmniLife accent.

However:

* no mandatory sparkle icons
* no excessive gradients
* no glowing AI cards
* no futuristic animations
* no unnecessary "AI" badges

---

## 13.3 AI Should Feel Like a Capability

Prefer:

```text
Generate plan
```

over:

```text
✨ MAGIC AI LIFE OPTIMIZER ✨
```

Prefer:

```text
Ask OmniLife
```

over:

```text
Ask AI ✨
```

when the product context makes the assistant identity obvious.

---

## 13.4 AI Output

AI-generated information should be presented as normal useful content.

The interface should prioritize:

```text
answer
↓
reason/context
↓
optional actions
```

rather than:

```text
AI branding
↓
animation
↓
decorative container
↓
answer
```

---

# 14 — COMPONENT PRINCIPLES

## 14.1 Buttons

Buttons should be:

* clear
* compact
* readable
* functional

Avoid making every button a pill.

Primary buttons may use accent color.

Secondary buttons should remain restrained.

---

## 14.2 Inputs

Inputs should prioritize:

* clarity
* focus
* error feedback
* accessibility

Avoid excessive:

* glow
* blur
* roundedness
* decoration

---

## 14.3 Lists

Lists should often be preferred over cards.

Example:

```text
09:00   Mandarin
        Pengantar Bahasa Mandarin

11:30   Study
        Review HSK vocabulary

18:00   Workout
```

This is often preferable to:

```text
┌──────────────┐
│ Mandarin     │
└──────────────┘

┌──────────────┐
│ Study        │
└──────────────┘

┌──────────────┐
│ Workout      │
└──────────────┘
```

---

## 14.4 Tables

Use tables when:

* comparing records
* displaying structured data
* scanning many values

Do not turn tables into cards on desktop unless responsive behavior requires it.

---

## 14.5 Modals

Modals should be used for:

* focused actions
* confirmation
* compact workflows
* contextual editing

Do not use modals simply because the UI has to contain something.

---

## 14.6 Tabs

Tabs should represent genuine peer categories.

Do not use tabs as decoration.

Avoid excessive nested tabs.

---

# 15 — EMPTY STATES

Empty states should be:

* contextual
* short
* useful
* calm

Structure:

```text
What is empty?

Why is it empty?

What can the user do?
```

Example:

```text
No upcoming events.

Your calendar is clear for today.

+ Add event
```

Avoid generic:

```text
Nothing here yet! 🎉
Let's get started!
✨
```

unless the context genuinely calls for it.

---

# 16 — FEEDBACK AND STATES

Every interactive component should have clear states.

Minimum considerations:

```text
default
hover
focus
active
disabled
loading
success
error
```

Do not rely solely on color.

Use:

* typography
* icons
* labels
* borders
* position
* motion

when necessary.

---

# 17 — MOTION & ANIMATION

Motion should communicate:

* transition
* hierarchy
* state change
* cause and effect

Avoid motion that exists only to impress.

---

## 17.1 Avoid

* excessive bouncing
* glowing transitions
* floating cards
* parallax everywhere
* animated gradients
* constant background motion
* unnecessary particle effects

---

## 17.2 Preferred Motion

Prefer:

* subtle fade
* controlled slide
* height transition
* state transition
* intentional focus movement

Motion should feel:

> quiet and precise.

---

# 18 — RESPONSIVE DESIGN

Responsive design must preserve hierarchy, not merely shrink the desktop UI.

---

## Desktop

Can support:

* persistent sidebar
* multi-column layouts
* dense information
* simultaneous context

---

## Tablet

May:

* collapse navigation
* reduce columns
* simplify secondary information

---

## Mobile

Should prioritize:

1. current context
2. primary actions
3. essential information
4. secondary information
5. advanced functionality

Do not simply stack every desktop card vertically.

---

# 19 — ACCESSIBILITY

Accessibility is part of the design system.

Ensure:

* sufficient contrast
* keyboard accessibility
* visible focus
* readable text
* appropriate touch targets
* meaningful labels
* semantic HTML where applicable
* screen-reader-friendly structure

Never sacrifice usability for visual minimalism.

---

# 20 — RESPONSIBLE INFORMATION DENSITY

Complex pages should be dense when the task requires density.

Examples:

### Finance

Can legitimately contain:

* balances
* transactions
* categories
* trends
* budgets
* subscriptions

### Study

Can contain:

* courses
* assignments
* deadlines
* exams
* study sessions
* notes

### Projects

Can contain:

* tasks
* dependencies
* status
* milestones
* resources

The solution is NOT to remove complexity.

The solution is:

> **organize complexity.**

---

# 21 — VISUAL PRIORITY SYSTEM

Every page should establish:

## Primary

What the user came here to do.

## Secondary

Information supporting that task.

## Tertiary

Context and metadata.

## Optional

Advanced functionality.

The UI must visually communicate this hierarchy.

---

# 22 — ANTI-PATTERN LIBRARY

The following patterns should trigger a design review.

## Anti-pattern A — Card Grid Everything

```text
[Card] [Card] [Card]
[Card] [Card] [Card]
```

Question:

> Can this information exist as a list, section, or inline layout?

---

## Anti-pattern B — Gradient Hero

```text
██████████████████
     BIG TEXT
   gradient glow
██████████████████
```

Use only if there is a genuine reason.

---

## Anti-pattern C — AI Sparkle

```text
✨ AI INSIGHT
```

Repeated throughout the product.

Avoid.

---

## Anti-pattern D — Everything Rounded

If every object is rounded, the interface loses hierarchy.

---

## Anti-pattern E — Everything Floating

Objects should not appear to float unless their elevation has meaning.

---

## Anti-pattern F — Decorative Statistics

Do not show:

```text
12
Tasks

87%
Productivity

4
Goals
```

unless the information is actually useful.

---

## Anti-pattern G — Generic Welcome

Avoid automatically generating:

```text
Welcome back, User 👋
```

Prefer contextual language.

Example:

```text
Good afternoon.

3 tasks · 2 events · 1 deadline
```

---

## Anti-pattern H — Dashboard Theater

Do not create visualizations merely because dashboards are expected
to contain visualizations.

---

# 23 — EDITORIAL CHARACTER

OmniLife may use subtle editorial characteristics to create personality.

Examples:

* restrained labels
* intentional numbering
* typography hierarchy
* compact metadata
* precise alignment
* subtle technical terminology

However:

> Editorial character must support hierarchy, not become decoration.

---

# 24 — PERSONALITY WITHOUT NOVELTY

OmniLife should feel unique through:

* information architecture
* interaction design
* typography
* hierarchy
* context
* system coherence

not through:

* strange shapes
* excessive gradients
* excessive animation
* novelty for novelty's sake

---

# 25 — DESIGN TOKEN PHILOSOPHY

Design tokens should be centralized.

Avoid arbitrary values throughout components.

Tokens should cover:

* colors
* spacing
* typography
* radius
* borders
* shadows
* motion
* breakpoints

---

## 25.1 Spacing

Use a consistent spacing scale.

Do not introduce arbitrary spacing values unless necessary.

However:

> consistency should not create mechanical repetition.

---

## 25.2 Radius

Use a restrained radius scale.

Example conceptual hierarchy:

```text
none
small
medium
large
```

Do not create ten different radius values.

---

## 25.3 Shadow

Use a minimal elevation scale.

Example:

```text
none
subtle
elevated
overlay
```

---

# 26 — COMPONENT REUSE

Components should be reusable when they represent a real recurring concept.

Good candidates:

* Button
* Input
* Select
* Dialog
* Navigation item
* List item
* Section header
* Data table
* Toast
* Badge
* Progress indicator

Do not abstract components merely to avoid writing markup twice.

---

# 27 — DESIGN DECISION PRIORITY

When design decisions conflict, use this priority:

```text
1. Accessibility
2. Usability
3. Information hierarchy
4. Product consistency
5. Performance
6. Maintainability
7. Visual refinement
8. Decoration
```

Never reverse this order.

---

# 28 — AI AGENT DESIGN BEHAVIOR

AI Agents implementing OmniLife must follow this process.

## Step 1 — Understand the User Task

Before designing a page, determine:

* What is the user trying to accomplish?
* What information is primary?
* What actions are primary?
* What information is contextual?
* What can remain hidden?

---

## Step 2 — Check Existing Patterns

Before creating a new component:

1. inspect existing components
2. inspect existing tokens
3. inspect existing layouts
4. reuse existing patterns when appropriate

Do not create a new visual pattern unnecessarily.

---

## Step 3 — Choose the Simplest Valid Layout

Start with:

```text
content
```

Then add:

```text
grouping
```

Then:

```text
container
```

only if necessary.

Do not start with cards.

---

## Step 4 — Establish Hierarchy

Use:

* typography
* spacing
* alignment
* contrast

before decoration.

---

## Step 5 — Add Interaction

Only after the information hierarchy is correct.

---

## Step 6 — Add Visual Refinement

Only after the previous steps work.

---

## Step 7 — Perform Anti-Slop Review

Before considering the UI complete, check:

```text
[ ] Did I create unnecessary cards?
[ ] Did I use excessive rounded corners?
[ ] Did I use unnecessary gradients?
[ ] Did I use glassmorphism?
[ ] Did I add unnecessary shadows?
[ ] Did I add decorative icons?
[ ] Did I add unnecessary badges?
[ ] Did I overuse purple?
[ ] Did I add excessive uppercase labels?
[ ] Did I add unnecessary statistics?
[ ] Did I create a generic dashboard layout?
[ ] Did I add decoration without function?
[ ] Can this design be simpler without losing functionality?
```

If several answers are "yes", revise the design.

---

# 29 — THE 60% RULE

When a new UI appears too visually elaborate,
the first revision should attempt to remove approximately:

> **30–60% of decorative visual treatment**

without removing actual functionality.

This may mean removing:

* cards
* shadows
* labels
* icons
* borders
* gradients
* unnecessary buttons
* redundant metadata

The goal is not to make the interface empty.

The goal is to reveal the underlying structure.

---

# 30 — THE "REMOVE IT" TEST

Before adding a visual element, ask:

> What happens if this element does not exist?

If the answer is:

> "Nothing important."

Do not add it.

---

# 31 — THE "BLACK AND WHITE" TEST

A page should remain understandable when:

* accent colors are removed
* gradients are removed
* shadows are removed
* decorative icons are removed

If hierarchy collapses without decoration,
the hierarchy is too dependent on styling.

---

# 32 — THE "CARD REMOVAL" TEST

For every major card, ask:

> Could this content work better as a section, list, table, or inline block?

If yes, prefer the simpler structure.

---

# 33 — THE "10 SECOND" TEST

A user should be able to understand the primary purpose of a page
within approximately ten seconds.

They should know:

* where they are
* what matters
* what they can do
* what requires attention

without inspecting every card.

---

# 34 — THE "MATURE PRODUCT" TEST

Ask:

> Does this look like a mature application that has evolved through years
> of product decisions?

rather than:

> Does this look like a modern UI concept generated for a showcase?

Prefer the first.

---

# 35 — OMNILIFE DASHBOARD DESIGN RULE

The Dashboard should behave like a **daily briefing**.

It should answer:

```text
What is happening?

What matters?

What needs action?

What is coming next?
```

Not:

```text
How many widgets can fit on the screen?
```

---

# 36 — OMNILIFE SYSTEM DEPTH

The UI should hide unnecessary complexity,
but the system underneath should remain capable.

For example:

```text
Simple task view
        ↓
Task detail
        ↓
Advanced properties
        ↓
Dependencies
        ↓
Project relationships
        ↓
Goals
        ↓
Analytics
```

The user enters complexity progressively.

---

# 37 — CROSS-MODULE CONSISTENCY

All OmniLife modules should feel like parts of the same operating system.

A user moving from:

```text
Study
→ Tasks
→ Calendar
→ Finance
→ Knowledge
→ Vault
```

should recognize the same design language.

However, each module may have its own information density
and interaction patterns.

Consistency must exist at the foundation,
not necessarily at the surface layout.

---

# 38 — MODULE PERSONALITY

Modules may have subtle personality differences.

For example:

### Study

More academic and structured.

### Finance

More precise and data-oriented.

### Calendar

More temporal and spatial.

### Knowledge

More content-oriented.

### Vault

More restrained and security-focused.

### AI

More conversational.

But all must remain recognizably OmniLife.

---

# 39 — SECURITY & VAULT

Security-related interfaces should prioritize:

* trust
* clarity
* restraint
* explicit state

Avoid playful visual treatments.

Security should feel:

> serious and reliable.

Not:

> futuristic hacker UI.

---

# 40 — FINANCE

Finance should prioritize:

* numbers
* clarity
* comparison
* trends
* transaction scanning

Avoid turning every financial metric into a colorful card.

Numbers should be readable first.

---

# 41 — STUDY & COLLEGE

Study interfaces should prioritize:

* deadlines
* schedules
* courses
* assignments
* study sessions
* progress

Avoid unnecessary gamification unless explicitly requested.

---

# 42 — KNOWLEDGE

Knowledge interfaces should prioritize:

* reading
* writing
* linking
* retrieval
* organization

Content should be allowed to breathe.

Do not over-cardify documents or notes.

---

# 43 — SETTINGS

Settings should be:

* boring
* predictable
* organized

This is intentional.

Settings should not attempt to impress the user visually.

---

# 44 — ERROR DESIGN

Errors should be:

* clear
* specific
* actionable

Avoid dramatic red interfaces.

Instead:

```text
What happened?

Why?

How can the user fix it?
```

---

# 45 — LOADING DESIGN

Loading states should preserve layout stability.

Prefer:

* subtle skeletons
* progress indicators
* contextual loading text

Avoid:

* elaborate animations
* glowing loaders
* unnecessary AI animation

---

# 46 — EMPTY DATA VS ERROR

These must never look identical.

### Empty

```text
There is currently no data.
```

### Error

```text
The system attempted to retrieve data but failed.
```

The interface should communicate the difference.

---

# 47 — MICROCOPY

Microcopy should be:

* concise
* human
* contextual
* useful

Avoid excessive marketing language.

Avoid:

```text
Supercharge your productivity 🚀
```

unless the context genuinely requires it.

Prefer:

```text
Nothing urgent today.
```

---

# 48 — LANGUAGE

OmniLife may support Indonesian and English.

UI language should remain consistent within a context.

Do not mix languages unnecessarily.

Technical metadata may use English where appropriate,
but user-facing language should remain natural.

---

# 49 — DESIGN REVIEW CHECKLIST

Before shipping a page:

## Structure

```text
[ ] Is the primary task obvious?
[ ] Is information hierarchy clear?
[ ] Is navigation understandable?
[ ] Is the page appropriately dense?
```

## Visual

```text
[ ] Are cards actually necessary?
[ ] Are borders necessary?
[ ] Are shadows necessary?
[ ] Are gradients necessary?
[ ] Is purple being overused?
[ ] Are rounded corners restrained?
[ ] Is typography doing enough work?
```

## Interaction

```text
[ ] Are primary actions obvious?
[ ] Are secondary actions appropriately secondary?
[ ] Are states clear?
[ ] Is keyboard navigation supported?
```

## Anti-Slop

```text
[ ] Does this resemble a generic AI dashboard?
[ ] Does it resemble a generic SaaS template?
[ ] Does it contain unnecessary decorative UI?
[ ] Does every element have a purpose?
[ ] Could 20% of the visual treatment be removed?
```

---

# 50 — BEFORE / AFTER PRINCIPLES

## Example 1 — Card

### Avoid

```text
╭────────────────────────╮
│        TASKS           │
│                        │
│     No tasks today     │
│                        │
│    + Add task          │
╰────────────────────────╯
```

### Prefer

```text
Tasks today

No tasks scheduled.

+ Add task
```

---

## Example 2 — AI

### Avoid

```text
╭──────────────────────────────╮
│ ✨ AI DAILY INTELLIGENCE     │
│                              │
│ 0 TASKS                      │
│                              │
│      Generate Magic Plan     │
╰──────────────────────────────╯
```

### Prefer

```text
Today's overview

No urgent items.

Generate a plan
```

---

## Example 3 — Statistics

### Avoid

```text
┌────────┐ ┌────────┐ ┌────────┐
│ 82%    │ │ 12     │ │ 94%    │
│ FOCUS  │ │ TASKS  │ │ HEALTH │
└────────┘ └────────┘ └────────┘
```

### Prefer

```text
Today

12 tasks · 3 completed · 2 upcoming
```

when those numbers actually matter.

---

# 51 — DESIGN EVOLUTION

The design system is allowed to evolve.

New patterns may be introduced when:

* the product gains a new interaction type
* existing patterns become insufficient
* accessibility requires change
* responsive behavior requires change
* usability testing demonstrates a better solution

Do not reject a new pattern merely because it is new.

Instead ask:

> Does it belong to OmniLife?

---

# 52 — EXCEPTION SYSTEM

The constitution is a decision framework,
not a prison.

An AI Agent may violate a guideline when:

1. there is a clear functional reason
2. accessibility requires it
3. the existing pattern cannot solve the problem
4. the new solution materially improves usability

When breaking a guideline, the implementation should favor:

> intentional exception

over:

> accidental inconsistency.

---

# 53 — PRIORITY WHEN CONFLICTS OCCUR

If two rules conflict:

```text
Accessibility
    ↓
Usability
    ↓
Information hierarchy
    ↓
Context
    ↓
Consistency
    ↓
Aesthetics
    ↓
Decoration
```

Higher levels always win.

---

# 54 — AI AGENT HARD CONSTRAINTS

AI Agents MUST NOT:

* redesign unrelated parts of the application without reason
* introduce a new visual language without checking this constitution
* replace existing components unnecessarily
* introduce gradients as a default solution
* introduce glassmorphism as a default solution
* create cards for every section
* add decorative icons without purpose
* add AI sparkle aesthetics by default
* turn every metric into a card
* increase visual complexity merely to make a page look "premium"
* copy generic SaaS dashboard patterns
* blindly imitate popular productivity applications

---

# 55 — AI AGENT SHOULD

AI Agents SHOULD:

* reuse existing components
* simplify layouts
* preserve hierarchy
* use whitespace intentionally
* use typography as a primary design tool
* prefer lists where lists are more efficient
* use cards only when meaningful
* preserve OmniLife's dark identity
* use purple intentionally
* keep visual noise low
* expose complexity progressively
* consider the user's current context
* optimize for long-term usability rather than screenshot aesthetics

---

# 56 — DESIGN QUALITY DEFINITION

A high-quality OmniLife interface is NOT:

> The most visually impressive interface.

It is:

> The interface that communicates the most useful information
> with the least unnecessary visual noise.

---

# 57 — FINAL DESIGN PRINCIPLES

Remember these seven principles above everything else:

### 01

> **Simple on the surface, deep underneath.**

### 02

> **Complexity belongs in the system, not on the surface.**

### 03

> **Content before container.**

### 04

> **Hierarchy before decoration.**

### 05

> **Every visual element must earn its place.**

### 06

> **Color is semantic, not decoration.**

### 07

> **OmniLife should feel like a mature personal operating system,
> not an AI-generated SaaS dashboard.**

---

# 58 — THE ULTIMATE TEST

Before shipping any OmniLife interface, ask:

> **If all gradients, glows, shadows, rounded cards, decorative icons,
> and visual effects were removed, would the interface still be good?**

If the answer is:

### Yes

The underlying design is strong.

If the answer is:

### No

The design is relying too heavily on decoration.

Then simplify.

---

# 59 — OMNILIFE DESIGN MANTRA

```text
QUIET SURFACE.
DEEP SYSTEM.

LESS DECORATION.
MORE INTENTION.

LESS UI NOISE.
MORE INFORMATION HIERARCHY.

LESS SHOWCASE.
MORE PRODUCT.

SIMPLE TO ENTER.
POWERFUL TO EXPLORE.

OMNILIFE IS COMPLEX.

THE USER DOES NOT HAVE TO FEEL THAT COMPLEXITY.
```

---

# END OF CONSTITUTION

Version: 1.0.0
Status: Active
Product: OmniLife
Design Philosophy: Editorial Utility / Quiet Productivity OS
Core Principle: Simple on the surface, deep underneath.

```
```
