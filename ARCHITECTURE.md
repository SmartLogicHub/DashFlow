# DashFlow 0.7 Architecture

## Core boundary

DashFlow separates Vault content, derived indexes, private plugin configuration, and presentation. Markdown remains the canonical business store.

```text
Vault Markdown / frontmatter
          │
          ▼
    VaultIndexService ──► VaultQueryService
          │                       │
          ▼                       ▼
 Task / Project / Habit services ─► Product surfaces
          │                       │
          └──────────────► WidgetRegistry / DashboardManager
                                      │
                                      ▼
                         DashboardRenderService + DesignSystemService
```

## Product surfaces

- **Personal Home** is a calm, content-led overview with Today focus, Activity, recent notes, WeRead highlights and navigation rows.
- **Work** is the extension canvas. Every registered Widget is available unless its instance is explicitly hidden; focused sections apply purpose-specific visibility policy.
- **Inbox, Today, Projects, Calendar, Habits and Review** are workflow surfaces backed by the same index and services, not duplicated stores.
- **Feature Hub** is the discoverability surface for registered Widgets, workflow actions and optional integrations. It reads the canonical feature catalog and routes to existing services instead of owning another feature model.
- **Settings** owns appearance, workflow, optional integrations and recovery. The first-run modal chooses a starting template without taking ownership of existing Markdown.

## Data and migration

`DashFlowData` is schema-backed private UI state. Schema 8 includes onboarding completion and a bounded recovery snapshot. `migratePluginData` validates dashboards before persistence; malformed or future data is used only in memory and requires explicit recovery action. AI credentials are migrated separately by `migrateAiCredential`: plugin data stores only a SecretStorage identifier.

`VaultIndexService` builds normalized notes, tasks, projects and habits from Markdown and refreshes incrementally through Vault and MetadataCache events. `VaultQueryService` derives search, filters and calendar ranges by index revision, keeping caches in memory.

## Rendering and interaction

`DashboardRenderService` owns root-scoped render lifecycle, request coalescing and render profiling. `ProductExperienceService` owns section navigation, vocabulary, focused-page summaries and Hero content. `PresentationRuntimeService` injects bundled Hero resource paths and resolves optional Vault-image overrides through `Vault.getResourcePath`; it does not fetch third-party scenes. `DesignSystemService` composes feature styles followed by the canonical `ProductPresentationStyles` layer and reduced-motion rules.

Project Kanban and Opportunity Board keep desktop drag and drop, but every card also exposes a native stage selector. Both paths call the same Markdown-backed service methods, so touch and keyboard access do not create alternative persistence behavior.

Destructive interactions are explicit: Dashboard and Widget removal require timed confirmation, Opportunity removal offers an eight-second Undo, and recovery reset requires a second click. No action silently rewrites Markdown or malformed plugin data.

## Network and security

The default path is offline: indexing, rendering, local Hero assets and Markdown writes do not require network access. AI Planning, AI News, WeRead and click-to-load Magic Embed are opt-in boundaries with bounded requests and provider-specific validation. SecretStorage values are resolved only at request time and are never written into `data.json` or recovery exports.

## Build and release

The source is bundled with esbuild into `main.js`; `styles.css`, `manifest.json` and `assets/heroes/*.webp` form the install artifact. `package-lock.json` and `npm ci` make CI reproducible. Node tests cover data boundaries, visibility, migration, destructive actions, onboarding, offline assets and release metadata. `npm run test:ui` is the opt-in real-Obsidian smoke gate: it connects to a locally launched debug instance through CDP, exercises product surfaces without writing Vault data, saves ignored diagnostics, and restores the original UI state.

GitHub Release creation is tag-driven. The pushed tag must equal the version in `manifest.json`, and publishing is blocked until the repository owner commits a chosen `LICENSE`. Ordinary `main` pushes only use the CI workflow and cannot create an immutable Release.

The repository owner must make the final license and copyright decision before publication. This document intentionally does not copy a historical repository license without authorization.
