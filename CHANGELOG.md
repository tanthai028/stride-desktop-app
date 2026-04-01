# Changelog

All notable changes and structural improvements made to this project.

---

## v0.1.0 — Initial Template Refactor (Electron + React Base)

### Overview

Converted a single-file prototype into a structured, reusable Electron + React desktop app template.

### Key Changes

#### Project Structure

- Introduced a modular folder structure:
  - `app/` → top-level app composition
  - `components/` → layout, ui, sections
  - `lib/` → shared helpers (Electron bridge)
  - `styles/` → global styling
- Removed unused Vite starter CSS and cleaned up legacy files

#### Electron Integration

- Added preload bridge for safe IPC communication
- Created `windowControls.js` abstraction to avoid direct `window` usage
- Updated Electron main process to support:
  - dev mode (Vite)
  - production build (future-ready)

#### UI Decomposition

- Broke large `App.jsx` into:
  - layout components (`WindowFrame`, `AppHeader`)
  - reusable UI components (`StatCard`, `ActionButton`, etc.)
  - section-level components

---

## v0.2.0 — Data + Constants Separation

### Overview

Moved hardcoded UI content into structured data and constants.

### Key Changes

#### Data Layer

- Added:
  - `data/summaryCards.js`
  - `data/dashboardStats.js`
  - `data/quickActions.js`
- Refactored components to render from data instead of inline values

#### Constants

- Added `constants/app.js`
  - centralized app name, tagline, default settings

#### Benefits

- Easier content updates
- Cleaner components
- Better separation of concerns

---

## v0.3.0 — Settings System (State + Persistence)

### Overview

Introduced a real feature system with local persistence.

### Key Changes

#### Feature Structure

- Added:
  - `features/settings/hooks/useSettings.js`
  - `features/settings/storage/settingsStorage.js`

#### Functionality

- Added persistent settings:
  - `animationsEnabled`
  - `compactMode`
- Settings stored in `localStorage`
- Automatic sync via React hook

#### Integration

- Connected settings to:
  - animation behavior
  - layout spacing

---

## v0.4.0 — Settings UI (Modal → Page Evolution)

### Overview

Implemented UI for settings and established interaction patterns.

### Key Changes

#### Initial Implementation

- Built `SettingsPanel` modal
- Connected Quick Actions → Settings

#### Refactor

- Converted settings into a full page:
  - `features/settings/pages/SettingsPage.jsx`
- Removed reliance on modal-based UI

#### Benefits

- Scalable for future settings
- Consistent page-based navigation

---

## v0.5.0 — App Navigation System

### Overview

Introduced multi-page navigation with sidebar layout.

### Key Changes

#### Navigation

- Added:
  - `AppSidebar`
  - `constants/navigation.js`
- Implemented page state:
  - `dashboard`
  - `settings`

#### Layout Update

- Updated `WindowFrame` to support:
  - sidebar + content layout

#### Routing Logic

- Centralized page switching in `App.jsx`

#### Benefits

- App now supports multiple pages
- Foundation for scaling features

---

## v0.6.0 — Page System (Reusable Layout Primitives)

### Overview

Standardized page structure across the app.

### Key Components

- `PageShell` → page container + header
- `PageSection` → grouped content blocks
- `PageCard` → consistent card UI

#### Refactor

- Updated:
  - `DashboardPage`
  - `SettingsPage`

#### Benefits

- Consistent spacing and structure
- Faster page creation
- Easier global design updates

---

## v0.7.0 — Settings Refactor (Reusable + Config Driven)

### Overview

Improved settings scalability by removing duplication.

### Key Changes

#### Reusable UI

- Added `SettingsToggleRow`

#### Config-Driven Settings

- Added:
  - `features/settings/config/settingsSections.js`
- Settings now rendered via config mapping

#### Benefits

- Adding new settings requires only config changes
- Reduced duplication
- Cleaner page logic

---

## v0.8.0 — Library Page (Scalability Test)

### Overview

Added a third page to validate navigation and structure.

### Key Changes

#### New Feature

- Added:
  - `features/library/pages/LibraryPage.jsx`
  - `data/libraryItems.js`

#### Navigation Update

- Added `library` route

#### Purpose

- Test multi-page scalability
- Validate feature folder pattern with a second non-settings page

---

## v0.9.0 — Collection Patterns (Empty State + Grid)

### Overview

Introduced reusable patterns for list-based pages.

### Key Components

- `EmptyState` → no-data UI
- `ItemGrid` → reusable card grid

#### Library Improvements

- Supports:
  - populated state
  - empty state fallback

#### Benefits

- Reusable for:
  - lists
  - history
  - search results
  - dashboards

---

## v1.0.0 — Action Bar (Search + Sort + Controls)

### Overview

Added a reusable action bar for real-world page interactions.

### Key Component

- `PageActionBar`

#### Features

- Search input
- Sort dropdown
- Compact controls layout for list pages

#### Library Upgrade

- Implemented:
  - search filtering
  - sorting logic
  - empty state for no results

#### Benefits

- Makes the library page feel like a real app page instead of a static mock
- Likely reusable across future searchable/sortable views

---

## v1.1.0 — Library Item Creation + Persistence Polish

### Overview

Extended the library page from a read-only demo into a small interactive feature with saved user state.

### Key Changes

#### Library State Persistence

- Added `localStorage` persistence for library items using `library-items`
- Hydrates saved items on load
- Falls back to default seed data when storage is empty or invalid

#### Item Creation Flow

- Added an `Add Item` action in the library page header
- Added modal-based item creation with fields for:
  - title
  - description
  - tag
- Added lightweight validation that blocks empty submissions
- New items are inserted at the top of the collection

#### Modal UX

- Reused shared `Modal` component for the add-item flow
- Added Escape key handling to close the modal
- Added overlay click close behavior
- Added open/close motion transitions with Framer Motion

#### Result

- The library page now behaves more like a real feature instead of only a layout test
- The project now demonstrates a complete mini CRUD-style interaction loop:
  - load default data
  - filter and sort
  - add new records
  - persist state locally

---

# Current Architecture Summary

### Layout Layer

- `WindowFrame`
- `AppSidebar`
- `AppHeader`

### Page Layer

- `PageShell`
- `PageSection`
- `PageCard`
- `PageActionBar`
- `EmptyState`
- `ItemGrid`

### Feature Layer

- `dashboard`
- `settings`
- `library`

### Data Layer

- `data/`
- `constants/`

### State Layer

- `useSettings` (persistent local state)
- `LibraryPage` local state + `localStorage` persistence

---

# Next Real Feature Steps

## Immediate Next Steps

- Add edit item flow to the library page
- Add delete item flow to the library page
- Keep search/sort working against user-created data
- Make empty-library state work correctly after deletes

## After CRUD Works

- Decide whether the add/edit form should stay inline or move into a reusable feature component
- Only extract shared behavior if a second feature actually needs the same pattern
- Build the next real page or workflow instead of polishing library architecture further

## Later, If Needed

- Extract shared collection hook only if another page needs the same search/sort behavior
- Add lightweight app-level state only when local page state starts getting painful
- Add file storage or backend only when `localStorage` becomes limiting
- Add Electron packaging when the app is ready for distribution

---

# Refactor Guardrails

To avoid tunneling into unnecessary cleanup next time, use this rule:

A refactor should only happen when it does at least one of these:

- removes real duplication in 2+ places
- makes an active feature easier to change
- prevents a real bug or state problem
- speeds up the next real feature

Do not refactor just to make one page feel “cleaner” in isolation.

Preferred order:

1. build real feature
2. feel real pain
3. extract only what solves that pain

---

# Notes

This project should prioritize:

- real user-facing functionality
- persistence
- scalable but practical structure
- feature-driven iteration over premature abstraction

The current direction is:

- keep the foundation clean
- stop over-optimizing one page
- use the library feature to validate real CRUD patterns before introducing more abstractions
