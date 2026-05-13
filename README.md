# Stride – Job Application Tracker

## Overview

Lifetime is a desktop application I built to solve a problem I was personally struggling with during my new grad job search:

I had no consistent system for actually applying to jobs.

I would save links everywhere, lose track of what I already applied to, overthink the process, and spend more time organizing than actually applying.

Instead of building another generic CRUD application, I wanted to build a tool around my real workflow:

1. Find jobs throughout the day
2. Dump them into a queue quickly
3. Enter a focused “apply mode” session
4. Open jobs one by one
5. Track progress and momentum visually
6. Reduce friction so applying feels easier mentally

The project started as a simple tracker and gradually evolved into a more structured desktop productivity system focused on reducing application friction.

---

# Why I Built It

A lot of job trackers focus only on storing data.

I realized my actual problem was behavioral.

I did not need another spreadsheet.
I needed a system that:

- encouraged consistency
- reduced context switching
- made applying feel lightweight
- gave visible progress feedback
- minimized repetitive work
- stayed visually pleasant enough that I actually wanted to use it daily

That changed how I approached the architecture and UI decisions.

The core idea became:

> “How do I reduce the amount of mental resistance between finding a job and actually applying to it?”

---

# Main Features

## Application Library

A centralized job tracking system where applications can be:

- added quickly through a modal workflow
- organized by status
- sorted and filtered
- viewed as cards or tables
- opened directly from the app
- prioritized for later application sessions

The library supports:

- company name
- role title
- location
- job posting URL
- application status
- notes
- timestamps
- priority levels

I also added automatic job metadata parsing from URLs so the user does not always need to manually enter information.

---

## Apply Mode

This became the most important feature in the project.

Instead of treating applying as passive tracking, I created a dedicated workflow mode focused entirely on execution.

Apply Mode:

- shows unapplied jobs in a queue
- allows quick “Done” or “Skip” actions
- visually tracks progress
- separates “current job” from “recently applied” jobs
- reduces distractions by using a compact overlay-style UI
- keeps the interaction lightweight and fast

The goal was to create something that feels closer to a productivity session than a traditional dashboard.

This part of the project forced me to think more deeply about:

- user flow
- state transitions
- friction reduction
- interaction speed
- session management
- visual hierarchy

---

## Dashboard System

The dashboard contains:

- Pomodoro-style timer
- recent applications
- quick links
- application metrics
- daily goal tracking

I intentionally designed the dashboard around actionable information instead of decorative analytics.

For example:

- recent applications exist to reinforce momentum
- quick links reduce repeated navigation friction
- the timer supports focused application sessions
- goal tracking provides visible progress feedback

---

## Responsive Desktop UI

One challenge was creating a desktop UI that still behaved responsively like a web application.

I implemented:

- adaptive layouts
- container-based responsiveness
- dynamic card sizing
- animated transitions
- conditional layouts at different widths
- reusable layout shells

I spent a lot of time refining spacing, hover behavior, transitions, and component consistency because I wanted the app to feel polished rather than “just functional.”

---

# My Development Process

## Step 1 – Start Simple

The first version was intentionally small.

I focused only on:

- adding applications
- storing them locally
- rendering lists
- basic filtering

I wanted to validate the workflow first before overengineering the architecture.

---

## Step 2 – Identify Real Friction

Once I started using the application daily, I noticed patterns:

- I still delayed applying
- too much information was visible at once
- adding applications felt heavier than expected
- I was organizing more than executing

This changed the direction of the project significantly.

Instead of adding random features, I began designing around behavioral bottlenecks.

That is what eventually led to Apply Mode.

---

## Step 3 – Refactor Into Feature-Based Architecture

As the application grew, large files became difficult to maintain.

I reorganized the project into feature-based modules:

```txt
src/features/dashboard
src/features/library
src/features/settings
src/features/apply-mode
```

Each feature contains:

- components
- hooks
- utilities
- constants
- configuration

This improved:

- scalability
- readability
- debugging speed
- onboarding clarity
- component isolation

I also separated:

- layout components
- reusable UI primitives
- semantic styling
- business logic

instead of keeping everything inside large JSX files.

---

## Step 4 – Build Reusable UI Systems

I noticed I was repeatedly solving the same styling problems.

Instead of continuing with large inline class lists, I created:

- reusable page shells
- semantic CSS layers
- shared UI components
- centralized theme variables
- reusable modal systems
- reusable card layouts
- reusable pagination systems

This reduced duplication and made future iteration much faster.

---

## Step 5 – Improve UX Through Iteration

A large amount of development time went into micro-interactions and UX polish.

Some examples:

- reducing layout shifts
- preventing flickering during page transitions
- keeping card heights visually consistent
- improving animation direction based on interaction type
- making hover states feel responsive but subtle
- minimizing visual noise
- refining spacing and typography hierarchy
- improving empty states
- reducing unnecessary clicks

---

# Technical Decisions

## Why Electron?

I chose Electron because:

- I wanted desktop-level workflows
- I wanted overlay-style windows
- I wanted tighter desktop interaction control
- I wanted to use React while still accessing native window behavior

This allowed me to implement:

- frameless windows
- custom window controls
- always-on-top apply mode
- desktop notifications
- taskbar interactions
- custom drag regions
- native-feeling workflows

---

## Frontend Stack

### Core Technologies

- React
- Vite
- Electron
- JavaScript
- CSS

### Additional Libraries

- Framer Motion
- Lucide React

I intentionally avoided adding excessive dependencies unless they solved a real scaling or maintainability issue.

---

## State Management Approach

I avoided introducing a large global state library early.

Instead, I relied on:

- localized feature state
- reusable hooks
- utility functions
- derived selectors
- controlled prop flow

This kept the project simpler while the feature set was still evolving.

---

## Styling Philosophy

One of my main goals was creating an interface that felt lightweight and modern.

I designed a reusable theme system using:

- CSS variables
- semantic styling layers
- shared surface tokens
- reusable motion timing
- centralized theme colors

I separated:

```txt
styles/semantics
styles/modes
styles/theme
```

to reduce styling duplication and make themes easier to maintain.

I also spent time refining:

- frosted glass effects
- blur behavior
- hover consistency
- card depth
- responsive spacing
- animation smoothness

because I wanted the application to feel intentionally designed rather than visually random.

---

# Challenges I Ran Into

## 1. UI Consistency

As the number of components grew, keeping spacing, transitions, and sizing consistent became difficult.

I solved this by:

- creating reusable layout primitives
- centralizing variables
- reducing component-specific overrides
- introducing semantic styling layers

---

## 2. Responsive Desktop Layouts

Desktop applications do not automatically behave responsively the way websites often do.

I had to manually handle:

- card sizing
- dynamic grid behavior
- scroll regions
- height balancing
- conditional layouts
- overflow behavior

especially around dashboard cards and Apply Mode.

---

## 3. Managing UX Complexity

A surprising challenge was avoiding feature clutter.

I constantly had to ask:

> “Does this feature actually reduce friction, or is it just more functionality?”

That mindset helped prevent the project from turning into a generic productivity dashboard.

---

## 4. Animation and Visual Polish

Animations are easy to add but difficult to make feel intentional.

I spent a lot of time refining:

- motion direction
- fade timing
- interaction feedback
- hover responsiveness
- transition consistency

to make the UI feel smooth without becoming distracting.

---

# What I Learned

This project taught me significantly more than just React or Electron.

I learned how to:

- structure growing frontend applications
- refactor large components into scalable systems
- think about behavioral UX problems
- design around friction reduction
- build reusable UI architecture
- iterate based on real usage patterns
- separate business logic from presentation
- improve maintainability over time
- balance polish with practicality

More importantly, I learned how much product thinking matters.

The biggest improvements did not come from adding more features.
They came from reducing friction and simplifying workflows.

---

# Future Improvements

Some future ideas I want to continue exploring:

- cloud synchronization
- analytics and insights
- AI-assisted application tracking
- smarter prioritization systems
- browser extension integration
- automated job ingestion
- cross-device workflows
- persistent apply sessions
- improved export/import systems

I also want to continue improving:

- accessibility
- performance
- architecture scalability
- desktop-native behavior

---

# Final Thoughts

This project became much more than a job tracker.

It turned into an experiment in:

- workflow design
- friction reduction
- productivity UX
- scalable frontend architecture
- desktop application development

A major focus throughout development was building something I would genuinely want to use every day.

That forced me to continuously evaluate:

- whether interactions felt efficient
- whether layouts reduced mental load
- whether the workflow encouraged action
- whether features solved real problems

Instead of treating the project like a checklist of technologies, I approached it as an evolving system that needed to improve through real-world usage and iteration.

That mindset shaped nearly every architectural and UX decision in the application.
