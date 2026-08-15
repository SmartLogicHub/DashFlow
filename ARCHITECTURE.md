# DashFlow v0.1 Architecture

## Core rule

DashFlow separates user content from UI configuration.

```text
Markdown / frontmatter
        │
        ▼
 VaultIndexService
        │
        ▼
 Task / Project domain
        │
        ▼
 Services / queries
        │
        ▼
 Widget instances
        │
        ▼
 Dashboard + Layout
```

## Source of truth

### Vault content

- Task: Markdown checkbox
- Project: Markdown note + frontmatter
- Project ↔ Task relation: `#project/<project_id>`

### Plugin data (`data.json`)

- Dashboard definitions
- Widget instances
- Widget config
- Widget position / size
- Plugin settings

Uninstalling DashFlow does not remove Task or Project data.

## Model boundaries

### Task

A normalized view of a Markdown checkbox. A Task keeps its source path, line and raw text so v0.1 can write completion state back to the source note.

### Project

A normalized view of a note whose frontmatter `type` matches the configured project type. It does not own a duplicate Task array; ProjectService resolves tasks by `projectId`.

### WidgetDefinition

Describes a Widget type: name, icon, default size, min size and default config. Definitions live in code and are registered in WidgetRegistry.

### WidgetInstance

A concrete card placed on a Dashboard. Multiple instances can share the same WidgetDefinition but have different config and layout.

### Dashboard

A container for WidgetInstance objects and layout settings. The data model supports multiple Dashboards from v0.1 even though the v0.1 UI exposes only the Home dashboard.

## Indexing

Widgets never scan the Vault directly. `VaultIndexService` reads Markdown files once, builds normalized Task and Project data, then incrementally refreshes changed files using Vault / MetadataCache events.

## Presentation layer

The v0.1 installable build uses dependency-free DOM rendering so it can be copied directly into a test Vault without a package install/build step. Presentation is isolated from the domain, registry, services and persistence model, so a future React renderer can replace it without changing the four core data contracts.
